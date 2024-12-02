const {
  TABLE_ENTITY,
  TABLE_ENTITY_USER,
  TABLE_TASK,
  TABLE_PAYMENT,
  TABLE_PAYMENT_METHODS,
} = process.env;
import {
  BillsPaymentInput,
  CreatePaymentInput,
  Payment,
  PaymentMethodType,
  PaymentProvider,
  PaymentType,
  Task,
  TaskPaymentStatus,
  TaskStatus,
} from 'dependency-layer/API';
import {
  batchGet,
  batchPut,
  getRecord,
  updateRecord,
} from 'dependency-layer/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  createZaiItem,
  CreateZaiItemRequest,
  getPaymentFromToData,
  getZaiItem,
  initZai,
  ItemStatuses,
  listZaiFees,
  makeZaiPayment,
  updateZaiItem,
  validateBills,
  validateEntityUser,
  validateFeeId,
  validateEntityTo,
  validatePaymentMethod,
} from 'dependency-layer/zai';
import { getTaskStatus, getTaskSearchStatus } from 'dependency-layer/task';
import {
  DATE_TIME_FREQUENCY_MAP,
  getScheduledAtStatus,
  getTaskPaymentAmount,
  getTaskPaymentGstAmount,
} from 'dependency-layer/payment';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

export const handler: AppSyncResolverHandler<any, any> = async (
  ctx,
  _check1,
  _check2
) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  console.log('_check1: ', JSON.stringify(_check1));
  console.log('_check2: ', JSON.stringify(_check2));
  const { claims, sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { entityId, billPayments, paymentMethodId } =
    input as CreatePaymentInput;

  console.log('claims.phone: ', claims.phone_number);
  console.log('sourceIp: ', sourceIp);

  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

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

  // buyer
  let entityPayer;
  try {
    entityPayer = await getRecord(TABLE_ENTITY ?? '', {
      id: entityId,
    });
  } catch (err: any) {
    console.log('ERROR get entity: ', err);
    throw new Error(err.message);
  }

  console.log('entityPayer: ', entityPayer);

  validateEntityTo(entityPayer);

  // get payment method for payment
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

  // get all the tasks for payment
  const paymentsResponse = [];
  let tasks: Task[] = [];
  const keys = billPayments.map(({ id }: { id: string }) => ({ entityId, id }));
  try {
    tasks = await batchGet({
      tableName: TABLE_TASK ?? '',
      keys,
    });

    console.log('tasks: ', tasks);
  } catch (err: any) {
    console.log('ERROR batch get tasks: ', err);
    throw new Error(err.message);
  }

  validateBills(tasks, billPayments, entityId);

  let zaiFeesData;
  try {
    zaiFeesData = await listZaiFees(zaiAuthToken?.access_token, {
      limit: 200,
      offset: 0,
    });
    console.log('zaiFeesData: ', zaiFeesData);
  } catch (err: any) {
    console.log('ERROR get zai fee: ', err);
    throw new Error(err.message);
  }

  for (let i = 0; i < tasks.length; i++) {
    let updateTaskParams: Partial<Task> = {};
    const task = tasks[i];
    const taskPayment = billPayments.find(
      (billPayment: BillsPaymentInput) => billPayment.id === task.id
    );
    console.log('taskPayment: ', taskPayment);
    let payment: Payment;

    // prevents TS issues, validation occurs in validateBills
    if (!taskPayment || !task.amount) {
      throw new Error(`INVALID_BILL_PAYMENT`);
    }

    const { buyerId, sellerId, isTaxBill, sellerPhone, customDescriptor } =
      await getPaymentFromToData(task);

    // get zai fee to apply to payment
    const feeIds: string[] = [];
    if (
      !isTaxBill &&
      taskPayment.installments > 1 &&
      taskPayment.paymentType === PaymentType.INSTALLMENTS
    ) {
      const fee = zaiFeesData.fees.find(
        (fee) => fee.name === 'BUSINESS_PLAN_260'
      );
      if (fee?.id) {
        feeIds.push(fee.id);
      }
    }

    // non business plan fees
    else {
      if (
        isTaxBill &&
        taskPayment.installments > 1 &&
        taskPayment.paymentType === PaymentType.INSTALLMENTS
      ) {
        const fee = zaiFeesData.fees.find((fee) => fee.name === 'ATO_PLAN_88');
        if (fee?.id) {
          feeIds.push(fee?.id);
        }
      }

      if (paymentMethod?.paymentMethodType === PaymentMethodType.CARD) {
        const fee = zaiFeesData.fees.find((fee) => fee.name === 'CARD_220');
        if (fee?.id) {
          feeIds.push(fee?.id);
        }
      } else if (paymentMethod?.paymentMethodType === PaymentMethodType.BANK) {
        const fee = zaiFeesData.fees.find((fee) => fee.name === 'BANK_90');
        if (fee?.id) {
          feeIds.push(fee?.id);
        }
      }
    }

    validateFeeId(feeIds);

    // get amount for this payment
    const amount = getTaskPaymentAmount({
      amount: task.amount,
      installments: taskPayment.installments,
      paymentType: taskPayment.paymentType,
      isFirstInstallment: true,
      isTaxBill,
    });

    const futurePayments = [];
    let zaiItem;
    // get zai item
    try {
      const zaiItemData = await getZaiItem(zaiAuthToken?.access_token, task.id);
      zaiItem = zaiItemData?.items;
    } catch (err: any) {
      console.log(
        'ERROR getZaiItem (may not exist, we create if the case): ',
        err
      );
    }

    // existing zai item - update it
    if (zaiItem) {
      try {
        const zaiItemData = await updateZaiItem(
          zaiAuthToken?.access_token,
          task.id,
          {
            amount,
            name: `task: ${task.id}`,
            buyer_id: buyerId,
            seller_id: sellerId,
            custom_descriptor: customDescriptor,
          }
        );
        zaiItem = zaiItemData?.items;
      } catch (err: any) {
        console.log('ERROR updateZaiItem: ', err);
        throw new Error(err.message);
      }
    }

    // new zai item required - create it
    else {
      try {
        const itemParams: CreateZaiItemRequest = {
          id: task.id,
          name: `task: ${task.id}`,
          amount,
          currency: 'AUD',
          payment_type: 2, //TODO: payment type? not well documented on Zai api docs
          buyer_id: buyerId,
          seller_id: sellerId,
          custom_descriptor: customDescriptor,
        };

        if (feeIds?.length > 0) {
          itemParams.fee_ids = feeIds.join(',');
        }

        console.log('create item params: ', itemParams);

        const zaiItemData = await createZaiItem(
          zaiAuthToken?.access_token,
          itemParams
        );
        console.log('zaiItemData: ', zaiItemData);
        zaiItem = zaiItemData?.items;
      } catch (err: any) {
        console.log('ERROR createZaiItem err: ', err);
        console.log('ERROR createZaiItem err?.errors: ', err?.errors);
        throw new Error(err.message);
      }
    }

    if (!zaiItem) {
      throw new Error('ERROR_CREATE_UPDATE_ZAI_ITEM');
    }

    // scheduled payment - take payment in future
    if (taskPayment.paymentType === PaymentType.SCHEDULED) {
      payment = {
        id: zaiItem.id,
        entityId: task.entityId,
        taskId: task.id,
        amount,
        gstAmount: getTaskPaymentGstAmount({
          amount,
          installments: taskPayment.installments,
          paymentType: taskPayment.paymentType,
          isFirstInstallment: true,
          isTaxBill: false,
          gstInclusive: task.gstInclusive ?? false,
        }),
        status: getScheduledAtStatus({
          amount,
          scheduledAt: taskPayment.scheduledAt,
        }),
        installment: 1,
        installments: taskPayment.installments,
        paymentType: taskPayment.paymentType,
        paymentProvider: PaymentProvider.ZAI,
        ipAddress: ip,
        fromId: task.fromId,
        fromType: task.fromType,
        toId: task.toId,
        toType: task.toType,
        buyerId,
        sellerId,
        feeIds,
        createdAt: zaiItem.created_at + '',
        updatedAt: zaiItem.updated_at + '',
        scheduledAt: taskPayment.scheduledAt,
        __typename: 'Payment',
      };

      updateTaskParams = {
        ...updateTaskParams,
        paymentStatus: TaskPaymentStatus.SCHEDULED,
        status: TaskStatus.SCHEDULED,
        updatedAt: new Date().toISOString(),
      };
    }

    // take payment for pay now / installments
    else {
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
        console.log(
          'ERROR create payment makeZaiPayment: ',
          JSON.stringify(err)
        );
        throw new Error(err.message);
      }

      if (
        zaiItem?.state === 'completed'
        //&& zaiItem?.released_amount === zaiItem?.amount
      ) {
        if (
          taskPayment.paymentType === PaymentType.PAY_NOW &&
          taskPayment.installments === 1
        ) {
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
            if (task.toId) {
              updateTaskParams.toSearchStatus = `${task.toId}#${searchStatus}`;
            }
          }
        }
        // handle installments reconciliation of task
        //else if (taskPayment.paymentType === PaymentType.INSTALLMENTS) {
        else if (taskPayment.installments > 1) {
          updateTaskParams = {
            ...updateTaskParams,
            paymentStatus: TaskPaymentStatus.SCHEDULED,
            status: TaskStatus.SCHEDULED,
          };
        }
      } else if (zaiItem?.state === 'pending') {
        //TODO: verify its what's expected when Direct Debit enabled by Zai
        updateTaskParams = {
          ...updateTaskParams,
          paymentStatus: TaskPaymentStatus.PENDING_TRANSFER,
          status: TaskStatus.SCHEDULED,
        };
      } else {
        console.log('UNHANDLED ZAI PAYMENT STATE: ', zaiItem?.state, zaiItem);
      }

      // create payment record with details from transaction
      payment = {
        id: zaiItem.id,
        entityId: task.entityId,
        taskId: task.id,
        amount: zaiItem.total_amount,
        netAmount: zaiItem.net_amount,
        payerFees: zaiItem.buyer_fees,
        totalAmount: zaiItem.total_amount,
        gstAmount: getTaskPaymentGstAmount({
          amount,
          installments: taskPayment.installments,
          paymentType: taskPayment.paymentType,
          isFirstInstallment: true,
          isTaxBill: false,
          gstInclusive: task.gstInclusive ?? false,
        }),
        buyerId,
        sellerId,
        paymentType: taskPayment.paymentType,
        paymentProvider: PaymentProvider.ZAI,
        ipAddress: ip,
        feeIds,
        fromId: task.fromId,
        fromType: task.fromType,
        toId: task.toId,
        toType: task.toType,
        scheduledAt: taskPayment.scheduledAt,
        installment: 1,
        installments: taskPayment.installments,
        status: ItemStatuses[zaiItem.status],
        createdAt: zaiItem.created_at + '',
        updatedAt: zaiItem.updated_at + '',
        paidAt: new Date().toISOString(),
        __typename: 'Payment',
      };
    }

    // push payment to future payment requests
    futurePayments.push(payment);

    // create further installments if installments payment
    for (let j = 1; j < (taskPayment.installments ?? 1); j++) {
      const period =
        DATE_TIME_FREQUENCY_MAP[
          taskPayment.paymentFrequency as keyof typeof DATE_TIME_FREQUENCY_MAP
        ];

      console.log('period: ', period);
      const nextScheduledAt = DateTime.fromFormat(
        task.dueAt ?? '',
        'yyyy-MM-dd'
      )
        .plus({ [period.label]: j * period.multiplier })
        .toFormat('yyyy-MM-dd');

      const amount = getTaskPaymentAmount({
        amount: task.amount,
        installments: taskPayment.installments,
        paymentType: taskPayment.paymentType,
        isFirstInstallment: false,
        isTaxBill,
      });

      // create installment
      const createdAt = new Date().toISOString();
      const installment: Payment = {
        id: randomUUID(),
        entityId: task.entityId,
        taskId: task.id,
        paymentType: taskPayment.paymentType,
        paymentProvider: PaymentProvider.ZAI,
        ipAddress: ip,
        fromId: task.fromId,
        fromType: task.fromType,
        toId: task.toId,
        toType: task.toType,
        amount,
        gstAmount: getTaskPaymentGstAmount({
          amount: task.amount,
          installments: taskPayment.installments,
          paymentType: taskPayment.paymentType,
          isFirstInstallment: false,
          isTaxBill: false,
          gstInclusive: task.gstInclusive ?? false,
        }),
        buyerId,
        sellerId,
        feeIds,
        status: getScheduledAtStatus({ amount, scheduledAt: nextScheduledAt }),
        scheduledAt: nextScheduledAt,
        installment: j + 1,
        installments: taskPayment.installments,
        createdAt,
        updatedAt: createdAt,
        __typename: 'Payment',
      };

      futurePayments.push(installment);
    }

    if (futurePayments.length > 0) {
      try {
        await batchPut({
          tableName: TABLE_PAYMENT ?? '',
          items: futurePayments,
        });
      } catch (err: any) {
        console.log('ERROR batch put installments: ', err);
        throw new Error(err.message);
      }
    }

    paymentsResponse.push(...futurePayments);

    if (updateTaskParams) {
      try {
        await updateRecord(
          TABLE_TASK ?? '',
          { entityId: task.entityId, id: task.id },
          updateTaskParams
        );
      } catch (err: any) {
        console.log('ERROR update task status: ', err);
        throw new Error(err.message);
      }
    }
  }

  return paymentsResponse;
};
