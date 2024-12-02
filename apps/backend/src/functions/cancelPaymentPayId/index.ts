const { REGION, TABLE_ENTITY_USER, TABLE_PAYMENT, TABLE_TASK } = process.env;
import { Payment, PaymentStatus } from 'dependency-layer/API';
import { deleteRecord, getRecord } from 'dependency-layer/dynamoDB';
import { validateEntityUser } from 'dependency-layer/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { AppSyncResolverHandler } from 'aws-lambda';

const DdbClient = new DynamoDBClient({
  region: REGION,
});
const docClient = DynamoDBDocumentClient.from(DdbClient);

const queryPayments = async (payInPaymentId: string): Promise<any> => {
  const params = {
    TableName: TABLE_PAYMENT,
    IndexName: 'paymentsByPayInPayment',
    KeyConditionExpression: '#payInPaymentId = :payInPaymentId',
    ExpressionAttributeNames: { '#payInPaymentId': 'payInPaymentId' },
    ExpressionAttributeValues: {
      ':payInPaymentId': payInPaymentId,
    },
  };

  const command = new QueryCommand(params);
  const data = await docClient.send(command);
  console.log('queryTransactions data: ', data);
  return data.Items;
};

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { claims, sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { entityId, payInPaymentId } = input as any; // CreatePaymentPayIdInput

  console.log('claims.phone: ', claims.phone_number);
  console.log('sourceIp: ', sourceIp);

  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }

  const ip = sourceIp[0];
  console.log('ip: ', ip);

  // get entity user to ensure they have permission to update the entity
  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      userId: sub,
      entityId,
    });
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  console.log('entityUser: ', entityUser);

  validateEntityUser(entityUser);

  let payments;
  try {
    payments = await queryPayments(payInPaymentId);
    console.log('tasks: ', payments);
  } catch (err: any) {
    console.log('ERROR get tasks: ', err);
    throw new Error(err.message);
  }

  // TODO: ensure payments match entityId
  //const isAllMatchEntityId = payments.every((payment: Payment) => payment.entityId === entityId);
  //if (!isAllMatchEntityId) {
  //  throw new Error('UNAUTHORISED');
  //}

  // check all payments are status PENDING_PAYID_TRANSFER
  const isAllPendingPayIdTransfer = payments.every(
    (payment: Payment) =>
      payment.status === PaymentStatus.PENDING_PAYID_TRANSFER
  );

  if (!isAllPendingPayIdTransfer) {
    throw new Error('INVALID_PAYMENT_STATUS');
  }

  const requests: Promise<any>[] = [];
  payments.forEach((task: any) => {
    requests.push(
      deleteRecord(TABLE_TASK ?? '', {
        entityId: task.entityId,
        id: task.id,
      })
    );
  });

  try {
    const response = await Promise.all(requests);
    console.log('response: ', response);

    return response;
  } catch (err: any) {
    console.log('ERROR Promise.all: ', err);
    throw new Error(err.message);
  }
};
