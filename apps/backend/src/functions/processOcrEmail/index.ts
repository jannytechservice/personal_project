import {
  InvocationType,
  InvokeCommand,
  LambdaClient,
} from '@aws-sdk/client-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SNSEvent } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { BEEntity } from 'dependency-layer/be.types';
import { simpleParser } from 'mailparser';
import { queryRecords } from 'dependency-layer/dynamoDB';

const { OCR_EMAIL_DOMAIN } = process.env;

const {
  AWS_REGION,
  STORAGE_BUCKETNAME,
  TABLE_ENTITY,
  FUNCTION_CREATE_DOCUMENT_ANALYSIS,
} = process.env;
const s3Client = new S3Client({});

const lambda = new LambdaClient({ region: AWS_REGION });

export const handler = async (event: SNSEvent) => {
  if (!STORAGE_BUCKETNAME || !TABLE_ENTITY || !OCR_EMAIL_DOMAIN) {
    console.error(
      'Environment variables STORAGE_BUCKETNAME or TABLE_ENTITY or OCR_EMAIL_DOMAIN are not set.'
    );
    return {
      statusCode: 500,
      body: 'Configuration error.',
    };
  }

  console.log('Received SNS event:', JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    let snsMessage;
    try {
      snsMessage = JSON.parse(record.Sns.Message);
      console.log('Parsed SNS message:', snsMessage);
    } catch (err) {
      console.error('Error parsing SNS message:', err);
      continue; // Skip this record
    }

    const { content, mail } = snsMessage;
    if (!content || !mail) {
      console.log('No content or mail information found in the SNS message.');
      continue;
    }

    // Get OCR email from the message and query entity details
    if (!mail.destination || mail.destination.length === 0) {
      console.log('No destination email found in the SNS message.');
      continue;
    }

    const ocrEmail = mail?.destination?.find(() =>
      mail.destination.find((item: string) =>
        item.includes(OCR_EMAIL_DOMAIN as string)
      )
    );
    console.log('ocrEmail:', ocrEmail);

    if (!ocrEmail) {
      console.log('No OCR email found in the destination.');
      continue;
    }

    let entities: BEEntity[] = [];
    try {
      entities = await queryRecords({
        tableName: TABLE_ENTITY,
        keys: {
          ocrEmail,
        },
        indexName: 'entityByOcrEmail',
        limit: 1,
      });

      console.log('entities:', entities);

      // If no entity found, terminate processing for this record
      if (!entities || entities.length === 0) {
        console.log(
          'No entity found for the provided OCR email. Terminating request.'
        );
        continue;
      }
    } catch (err) {
      console.error('Error querying records:', err);
      continue;
    }

    const ownerIdentityId = entities[0]?.ownerIdentityId;
    console.log('ownerIdentityId: ', ownerIdentityId);

    // Parse the email content (MIME format) using mailparser
    let parsedEmail;
    try {
      parsedEmail = await simpleParser(content);
      console.log('parsedEmail:', parsedEmail);
    } catch (err) {
      console.error('Error parsing email content:', err);
      continue;
    }

    // Process the attachments
    const attachments = parsedEmail.attachments ?? [];
    console.log('From:', parsedEmail.from.text);
    console.log('To:', parsedEmail.to.text);
    console.log('Subject:', parsedEmail.subject);
    console.log('Date:', parsedEmail.date);
    console.log('Text Content:', parsedEmail.text);
    console.log('HTML Content:', parsedEmail.html);

    console.log('attachments: ', attachments);
    const uploadPromises = attachments.map(async (attachment) => {
      const { content, filename, contentType } = attachment;
      if (!content || !filename) {
        console.log('Skipping attachment due to missing content or filename.');
        return;
      }

      console.log('attachment.contentType:', contentType);

      // Generate a unique filename with the original extension
      const fileExtension = filename.split('.').pop();
      const fileKey = `${randomUUID()}.${fileExtension}`;

      // Upload the attachment to S3 in the /private folder
      const s3Key = `private/${ownerIdentityId}/${fileKey}`;
      console.log('s3Key: ', s3Key);
      const putCommand = new PutObjectCommand({
        Bucket: STORAGE_BUCKETNAME,
        Key: s3Key,
        Body: content,
        ContentType: contentType || 'application/octet-stream',
      });

      try {
        await s3Client.send(putCommand);
        console.log(`Successfully uploaded to ${STORAGE_BUCKETNAME}/${s3Key}`);

        // Invoke the createDocumentAnalysis Lambda function
        const params = {
          FunctionName: FUNCTION_CREATE_DOCUMENT_ANALYSIS,
          InvocationType: InvocationType.Event,
          Payload: Buffer.from(
            JSON.stringify({
              entityId: entities[0].id,
              fileKey,
              identityId: ownerIdentityId,
            })
          ),
        };

        const command = new InvokeCommand(params);
        const response = await lambda.send(command);
        console.log('Lambda invoke response: ', response);
      } catch (err) {
        console.error(`Error uploading to S3 or invoking Lambda:`, err);
      }
    });

    // invoke function createDocumentAnalysis

    // Wait for all attachments to upload
    try {
      await Promise.all(uploadPromises);
    } catch (err) {
      console.error('Error processing attachments:', err);
    }
  }
  return {
    statusCode: 200,
    body: 'Email processed successfully.',
  };
};
