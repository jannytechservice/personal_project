import { validateIsEntityUser } from 'dependency-layer/entity';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { updateRecord } from 'dependency-layer/dynamoDB';
import { XeroSyncStatus } from 'dependency-layer/API';
const {
  AUTH_USERPOOLID,
  TABLE_ENTITY_USER,
  REGION,
  SQS_QUEUE_URL,
  TABLE_ENTITY,
} = process.env;

const sqs = new SQSClient({ region: REGION });

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { entityId, xeroTenantId } = ctx.arguments.input;

  // get entity user
  try {
    const entityUser = await validateIsEntityUser({ entityId, userId: sub });
    console.log('Success validate entity user: ', entityUser);
  } catch (err: any) {
    console.error('ERROR validate entity user: ', err);
    throw new Error(err.message);
  }

  // sqs message
  const sqsParams = {
    MessageBody: `Xero contacts sync - entityId: ${entityId} createdBy: ${sub}`,
    MessageAttributes: {
      entityId: {
        DataType: 'String',
        StringValue: entityId,
      },
      xeroTenantId: {
        DataType: 'String',
        StringValue: xeroTenantId,
      },
      userId: {
        DataType: 'String',
        StringValue: sub,
      },
    },
    QueueUrl: SQS_QUEUE_URL,
  };

  //update entity xeroInvoiceSyncStatus to PENDING
  try {
    const updateEntityParams = {
      xeroInvoiceSyncStatus: XeroSyncStatus.PENDING,
    };
    const entity = await updateRecord(
      TABLE_ENTITY ?? '',
      { id: entityId },
      updateEntityParams
    );
    console.log('Success update entity: ', entity);
  } catch (err: any) {
    console.error('ERROR update entity : ', err);
    throw new Error(err.message);
  }

  // send xero contacts sync to sqs queue
  try {
    const command = new SendMessageCommand(sqsParams);
    const response = await sqs.send(command);
    console.log('response: ', response);
  } catch (err: any) {
    console.error('Error send SQS message', err);
    throw new Error(err.message);
  }

  return true;
};
