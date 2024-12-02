const { TABLE_PAYMENT, TABLE_PAYMENT_METHODS, TABLE_ENTITY_USER, TABLE_TASK } =
  process.env;
import {
  Payment,
  PaymentProvider,
  Task,
  TaskPaymentStatus,
} from 'dependency-layer/API';
import { getRecord, updateRecord } from 'dependency-layer/dynamoDB';
import { getTaskSearchStatus, getTaskStatus } from 'dependency-layer/task';
import {
  CreateZaiAuthTokenResponse,
  getPaymentFromToData,
  getZaiItem,
  initZai,
  ItemStatuses,
  makeZaiPayment,
  validateEntityUser,
  validatePaymentMethod,
} from 'dependency-layer/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { id, paymentMethodId } = input;

  const ip = sourceIp[0];

  // get payment
  let payment: Payment | null = null;
  try {
    payment = await getRecord(TABLE_PAYMENT ?? '', {
      id,
    });
  } catch (err: any) {
    console.log('ERROR get payment: ', err);
    throw new Error(err.message);
  }

  // TODO: validate payment is payable?

  if (!payment) {
    throw new Error('ERROR_PAYMENT_NOT_FOUND');
  }

  let task: Task | null = null;
  try {
    task = await getRecord(TABLE_TASK ?? '', {
      id: payment.taskId,
      entityId: payment.entityId,
    });
  } catch (err: any) {
    console.log('ERROR get task: ', err);
    throw new Error(err.message);
  }

  if (!task) {
    throw new Error('ERROR_TASK_NOT_FOUND');
  }

  // get entity user
  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      userId: sub,
      entityId: payment.entityId,
    });
    console.log('entityUser: ', entityUser);
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  validateEntityUser(entityUser);

  // paymentMethod for payment
  let paymentMethod;
  try {
    paymentMethod = await getRecord(TABLE_PAYMENT_METHODS ?? '', {
      id: paymentMethodId,
    });
  } catch (err: any) {
    console.log('ERROR get paymentMethod: ', err);
    throw new Error(err.message);
  }

  validatePaymentMethod(paymentMethod);

  const { sellerPhone } = await getPaymentFromToData(payment);

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  // get existing zai item
  let zaiItem;
  // get zai item
  try {
    const zaiItemData = await getZaiItem(
      zaiAuthToken?.access_token,
      payment.id
    );
    zaiItem = zaiItemData?.items;
  } catch (err: any) {
    console.log('ERROR getZaiItem: ', err);
    throw new Error(err.message);
  }

  if (!zaiItem) {
    throw new Error('ERROR_GET_ZAI_ITEM');
  }

  // retry payment
  let itemPaymentData;
  const itemPaymentParams = {
    account_id: paymentMethod?.id,
    ip_address: ip,
    merchant_phone: sellerPhone,
  };
  console.log('makeZaiPayment params: ', itemPaymentParams);
  try {
    itemPaymentData = await makeZaiPayment(
      zaiAuthToken?.access_token,
      zaiItem.id,
      itemPaymentParams
    );
    console.log('makeZaiPayment data: ', itemPaymentData);
    zaiItem = itemPaymentData?.items;
  } catch (err: any) {
    console.log('ERROR makeZaiPayment: ', JSON.stringify(err));
    throw new Error(err.message);
  }

  let updateTaskParams: Partial<Task> = {};

  if (zaiItem?.state === 'completed') {
    if (payment?.installments === 1) {
      updateTaskParams = {
        ...updateTaskParams,
        paymentStatus: TaskPaymentStatus.PAID,
      };

      const newTaskStatus = getTaskStatus({
        signatureStatus: task.signatureStatus,
        paymentStatus: TaskPaymentStatus.PAID,
      });
      if (task.status !== newTaskStatus) {
        const searchStatus = getTaskSearchStatus({
          status: newTaskStatus,
          signatureStatus: task.signatureStatus,
          paymentStatus: TaskPaymentStatus.PAID,
        });
        updateTaskParams.status = newTaskStatus;
        updateTaskParams.fromSearchStatus = `${task.fromId}#${searchStatus}`;
        updateTaskParams.toSearchStatus = `${task.toId}#${searchStatus}`;
      }
    }
  } else if (zaiItem?.state === 'pending') {
    //TODO: verify its what's expected when Direct Debit enabled by Zai
    updateTaskParams = {
      ...updateTaskParams,
      paymentStatus: TaskPaymentStatus.PENDING_TRANSFER,
    };
  } else {
    console.log('UNHANDLED ZAI PAYMENT STATE: ', zaiItem?.state, zaiItem);
  }

  // create payment record with details from transaction
  const updatedPayment = {
    id: zaiItem.id,
    amount: zaiItem.total_amount,
    netAmount: zaiItem.net_amount,
    payerFees: zaiItem.buyer_fees,
    totalAmount: zaiItem.total_amount,
    paymentProvider: PaymentProvider.ZAI,
    ipAddress: ip,
    status: ItemStatuses[zaiItem.status],
    createdAt: zaiItem.created_at + '',
    updatedAt: zaiItem.updated_at + '',
    paidAt: new Date().toISOString(),
  };

  if (Object.keys(updateTaskParams).length > 0) {
    try {
      await updateRecord(
        TABLE_TASK ?? '',
        { entityId: task.entityId, id: task.id },
        updateTaskParams
      );
    } catch (err: any) {
      console.log('ERROR update task record: ', err);
      throw new Error(err.message);
    }
  }

  let updatedPaymentRecord: Payment | null = null;
  try {
    updatedPaymentRecord = (await updateRecord(
      TABLE_PAYMENT ?? '',
      { id: updatedPayment.id },
      updatedPayment
    )) as Payment;
  } catch (err: any) {
    console.log('ERROR update payment record', err);
    throw new Error(err.message);
  }

  console.log('updatedPaymentRecord: ', updatedPaymentRecord);

  return updatedPaymentRecord;
};
