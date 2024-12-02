import {
  InvocationType,
  InvokeCommand,
  LambdaClient,
} from '@aws-sdk/client-lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createHmac } from 'crypto';

const { FUNCTION_XEROWEBHOOKHANDLER, XERO_WEBHOOK_KEY } = process.env;
const lambda = new LambdaClient({ apiVersion: '2015-03-31' });

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  try {
    console.log(`EVENT RECEIVED: ${JSON.stringify(event)}`);
    const signatureHeader = event.headers['x-xero-signature'];
    console.log('Signature Header: ', signatureHeader);

    if (!signatureHeader) {
      return {
        statusCode: 400,
        body: 'No x-xero-signature header',
      };
    }

    const body = event.body;
    if (!body) {
      return {
        statusCode: 400,
        body: 'Missing webhook body',
      };
    }
    console.log('Webhook body: ', body);

    // Verify the Xero webhook signature using HMAC-SHA256
    const expectedSignature = createHmac('sha256', XERO_WEBHOOK_KEY!)
      .update(body)
      .digest('base64');

    console.log('expectedSignature: ', expectedSignature);

    if (expectedSignature !== signatureHeader) {
      console.error('Signature mismatch, invalid request');
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid signature' }),
      };
    }

    console.log('Webhook signature verified');

    const parsedBody = JSON.parse(body);
    if (parsedBody.events && parsedBody.events.length === 0) {
      console.log('Handling Intent to Receive validation');
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Intent to receive validation successful',
        }),
      };
    }

    const invokeCommand = new InvokeCommand({
      FunctionName: FUNCTION_XEROWEBHOOKHANDLER,
      InvocationType: InvocationType.Event,
      Payload: Buffer.from(JSON.stringify(event)),
    });

    const invokeResponse = await lambda.send(invokeCommand);
    console.log('Handler function invoked, response: ', invokeResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook received and processed' }),
    };
  } catch (error: any) {
    console.error('Error processing webhook: ', error);
    throw new Error(error.message);
  }
};
