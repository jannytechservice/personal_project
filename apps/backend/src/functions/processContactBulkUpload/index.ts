import { appSyncRequest } from 'dependency-layer/appsync';
import { toTitleCase } from 'dependency-layer/code';
import { batchPut } from 'dependency-layer/dynamoDB';
import { createNotification as CREATE_NOTIFICATION } from 'dependency-layer/graphql/mutations';
import { getPhoneNumber } from 'dependency-layer/phone';
import { REGEX } from 'dependency-layer/utils';
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { SQSEvent } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { parse } from 'csv-parse';
import { isValidABN } from 'dependency-layer/zai';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { Readable } from 'stream';
import {
  Contact,
  ContactFieldsInput,
  ContactStatus,
} from 'dependency-layer/API';

const { TABLE_CONTACT } = process.env;

const { REGION, STORAGE_BUCKETNAME } = process.env;

const s3 = new S3Client({ region: REGION, apiVersion: '2012-10-17' });

const createErrorNotification = async ({
  userId,
  entityId,
  message,
}: {
  userId?: string;
  entityId?: string;
  message?: string;
}) => {
  if (userId && entityId) {
    try {
      const body = {
        query: CREATE_NOTIFICATION,
        variables: {
          input: {
            title: 'ERROR_IMPORTING_CSV',
            message,
            status: 'UNREAD',
            type: 'error',
            owner: userId,
          },
        },
      };

      const result = await appSyncRequest(body);
      console.log('Create error notification result: ', result);
    } catch (err: any) {
      console.log('ERROR creating notification: ', err);
    }
  }
};

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    // parse message body
    let messageAttributes;
    try {
      messageAttributes = record.messageAttributes;
    } catch (err) {
      console.log('ERROR parsing message: ', err);
    }

    const entityId = messageAttributes?.entityId.stringValue;
    const userId = messageAttributes?.userId.stringValue;
    const identityId = messageAttributes?.identityId.stringValue;
    const fileKey = messageAttributes?.fileKey.stringValue;
    let fields: ContactFieldsInput;

    if (messageAttributes?.fields.stringValue) {
      try {
        fields = JSON.parse(messageAttributes?.fields.stringValue);
        console.log('fields: ', fields);
      } catch (err) {
        console.log('ERROR parsing message: ', err);
        continue;
      }

      // query S3 file and parse records json
      const records: Record<any, any>[] = [];
      let csvData;
      try {
        const command = new GetObjectCommand({
          Bucket: STORAGE_BUCKETNAME,
          Key: `private/${identityId}/${fileKey}`,
        });

        csvData = await s3.send(command);
        console.log('S3 get object data: ', csvData);
      } catch (err: any) {
        console.log('ERROR get S3 file: ', err);
        await createErrorNotification({
          userId,
          entityId,
          message: `ERROR get S3 file: ${err?.message || ''}`,
        });
      }

      if (csvData?.Body) {
        const readableCSVStream = Readable.from(csvData.Body as Readable);

        const parseOptions = {
          columns: true, // Assumes first row of CSV are column names
          skip_empty_lines: true,
          relax_column_count: true,
        };
        const parser = readableCSVStream.pipe(parse(parseOptions));

        for await (const record of parser) {
          console.log('record of parser: ', record);
          records.push(record);
        }

        console.log('records: ', records);

        try {
          // filter records that don't have an email or dont have either firstname lastname OR company name or valid name
          const filteredRecords = records.filter((record) => {
            const email = fields.email ? record?.[fields.email] ?? '' : '';
            const firstName = fields.firstName
              ? record?.[fields.firstName] ?? ''
              : '';
            const lastName = fields.lastName
              ? record?.[fields.lastName] ?? ''
              : '';
            const companyName = fields.companyName
              ? record?.[fields.companyName] ?? ''
              : '';
            const taxNumber = fields.taxNumber
              ? record?.[fields.taxNumber] ?? ''
              : '';

            return (
              email &&
              REGEX.EMAIL.test(email) &&
              (firstName || lastName || (companyName && isValidABN(taxNumber)))
            );
          });

          // map records for dynamodb batch put
          const mappedRecords = filteredRecords.map((record) => {
            const createdAt = new Date().toISOString();
            const firstName = fields.firstName
              ? record?.[fields.firstName] ?? ''
              : '';
            const lastName = fields.lastName
              ? record?.[fields.lastName] ?? ''
              : '';
            const email = fields.email ? record?.[fields.email] ?? '' : '';
            const companyName = fields.companyName
              ? record?.[fields.companyName] ?? ''
              : '';
            const accountName = fields.accountName
              ? record?.[fields.accountName] ?? ''
              : '';
            const accountNumber = fields.accountNumber
              ? record?.[fields.accountNumber] ?? ''
              : '';
            const routingNumber = fields.routingNumber
              ? record?.[fields.routingNumber] ?? ''
              : '';
            //const bankName = fields.bankName
            //  ? record?.[fields.bankName] ?? ''
            //  : '';
            const billerCode = fields.billerCode
              ? typeof record?.[fields.billerCode] === 'string' &&
                /^\d+$/.test(record?.[fields.billerCode])
                ? parseInt(record?.[fields.billerCode])
                : ''
              : '';
            const referenceNumber = fields.referenceNumber
              ? record?.[fields.referenceNumber] ?? ''
              : '';
            const taxNumber = fields.taxNumber
              ? record?.[fields.taxNumber] ?? ''
              : '';
            const companyNumber = fields.companyNumber
              ? record?.[fields.companyNumber] ?? ''
              : '';
            const phone = fields.phone ? record?.[fields.phone] ?? '' : '';
            const mobile = fields.mobile ? record?.[fields.mobile] ?? '' : '';
            // contact phone

            //let mobile;
            //if (fields.mobile) {
            //  try {
            //    mobile = getPhoneNumber(record?.[fields.mobile] ?? '');
            //  } catch (err) {
            //    console.log('WARNING parsing phone number: ', err);
            //  }
            //}

            const searchName = `${
              companyName.toLowerCase()?.trim() ||
              `${firstName} ${lastName}`?.toLowerCase()?.trim()
            } ${email}`
              .toLowerCase()
              .trim();

            const newContact: Contact = {
              id: randomUUID(),
              createdAt,
              email,
              entityId: entityId ?? '',
              searchName,
              updatedAt: createdAt,
              owner: userId,
              status: ContactStatus.ACTIVE,
              __typename: 'Contact',
            };

            if (firstName) {
              newContact.firstName = toTitleCase(firstName);
            }

            if (lastName) {
              newContact.lastName = toTitleCase(lastName);
            }

            if (mobile && parsePhoneNumberFromString(mobile, 'AU')?.number) {
              newContact.mobile = parsePhoneNumberFromString(
                mobile,
                'AU'
              )?.number;
            }

            if (phone) {
              newContact.phone = phone;
            }

            if (companyName) {
              newContact.companyName = toTitleCase(companyName);
            }

            if (companyNumber) {
              newContact.companyNumber = companyNumber;
            }

            if (taxNumber) {
              newContact.taxNumber = taxNumber;
            }

            // bank
            if (accountNumber && routingNumber) {
              newContact.bank = {
                accountNumber,
                routingNumber,
                __typename: 'ContactBankAccount',
              };

              if (accountName) {
                newContact.bank.accountName = toTitleCase(accountName);
              }
            }

            //bpay
            if (billerCode && referenceNumber) {
              newContact.bpay = {
                billerCode,
                referenceNumber,
                __typename: 'ContactBpay',
              };
            }

            if (fileKey) {
              newContact.bulkUploadFileKey = fileKey;
            }

            return newContact;
          });
          console.log('mappedRecords: ', mappedRecords);
          const batchResponse = await batchPut({
            tableName: TABLE_CONTACT ?? '',
            items: mappedRecords,
          });

          console.log('batchResponse:  ', batchResponse);
        } catch (err: any) {
          console.log('ERROR batch put contacts: ', err);
          await createErrorNotification({
            userId,
            entityId,
            message: 'ERROR batch put contacts: ',
          });
        }

        // delete s3 file
        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: STORAGE_BUCKETNAME,
            Key: `private/${identityId}/${fileKey}`,
          });

          const deleteResponse = await s3.send(deleteCommand);
          console.log('deleteResponse: ', deleteResponse);
        } catch (err: any) {
          console.log('ERROR deleting s3 file: ', err);
          await createErrorNotification({
            userId,
            entityId,
            message: `ERROR deleting s3 file: ${err?.message || ''}`,
          });
        }

        try {
          //const createdAt = new Date().toISOString();
          // notify user contacts imported
          //const notificationParams = {
          //  id: uuid4(),
          //  owner: userId,
          //  entityId,
          //  status: NotificationStatus.UNREAD,
          //  type: 'success',
          //  title: 'Your contacts have been imported',
          //  message: 'Your contacts have been imported successfully',
          //  //message: 'Error processing CSV file. Please try again or contact support.',
          //  createdAt,
          //  updatedAt: createdAt
          //};

          //await createRecord(TABLE_NOTIFICATION ?? '', notificationParams);
          const body = {
            query: CREATE_NOTIFICATION,
            variables: {
              input: {
                title: 'SUCCESS_IMPORTED_CONTACTS',
                status: 'UNREAD',
                type: 'success',
                owner: userId,
              },
            },
          };

          const result = await appSyncRequest(body);
          console.log('Create notification result: ', result);
        } catch (err: any) {
          console.log('ERROR creating notification: ', err);
          await createErrorNotification({
            userId,
            entityId,
            message: 'ERROR creating notification: ',
          });
        }

        //parser.on('end', async () => {
        //  console.log('end reached & records: ', records);
        //  // Create contact dynamoDB records
        //  try {
        //    const mappedRecords = records.map(record => {
        //      const createdAt = new Date().toISOString();
        //      return {
        //        id: uuid4(),
        //        firstName: record?.[fields.firstName] ?? '',
        //        lastName: record?.[fields.lastName] ?? '',
        //        email: record?.[fields.email] ?? '',
        //        phone: record?.[fields.phone] ?? '',
        //        companyName: record?.[fields.companyName] ?? '',
        //        createdAt,
        //        updatedAt: createdAt
        //      }
        //    });
        //    console.log('mappedRecords: ', mappedRecords);
        //    const batchResponse = await batchPut({
        //      tableName: TABLE_CONTACT ?? '',
        //      items: mappedRecords
        //    });
        //
        //    console.log('batchResponse:  ', batchResponse);
        //  } catch (err: any) {
        //    console.log('ERROR batch put contacts: ', err);
        //    throw new Error(err.message);
        //  }
        //
        //  // delete s3 file
        //  try {
        //    const deleteCommand = new DeleteObjectCommand({
        //      Bucket: STORAGE_BUCKETNAME,
        //      Key: `private/${identityId}/${fileKey}`
        //    });
        //
        //    const deleteResponse = await s3.send(deleteCommand);
        //    console.log('deleteResponse: ', deleteResponse);
        //  } catch (err: any) {
        //    console.log('ERROR deleting s3 file: ', err);
        //    throw new Error(err.message);
        //  }
        //
        //});
        //
        //parser.on('error', async (err) => {
        //  console.error('ERROR with parser: ', err.message);
        //  // create notification notifying user of error
        //  const createdAt = new Date().toISOString();
        //  const notificationParams = {
        //    id: uuid4(),
        //    userId,
        //    entityId,
        //    type: 'error',
        //    title: 'Error processing Contacts CSV file. Please try again or contact support',
        //    // message: 'Error processing Contacts CSV file. Please try again or contact support',
        //    createdAt,
        //    updatedAt: createdAt
        //  };
        //
        //  await createRecord(TABLE_NOTIFICATION ?? '', notificationParams);
        //});
      }
    }
  }
};
