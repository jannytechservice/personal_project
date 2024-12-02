const { TABLE_ENTITY_USER, TABLE_PAYTO_AGREEMENT, TABLE_PAYMENT, TABLE_TASK } =
  process.env;
import {
  BillsPaymentInput,
  Payment,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
  Task,
  TaskPaymentStatus,
} from 'dependency-layer/API';
import {
  batchGet,
  batchPut,
  getRecord,
  updateRecord,
} from 'dependency-layer/dynamoDB';
import {
  createZaiPayToAgreement,
  CreateZaiAuthTokenResponse,
  validateBills,
  validateEntityUser,
  validatePayToAgreements,
  getIsoDateFromZaiDate,
  getPaymentFromToData,
  initZai,
} from 'dependency-layer/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';
import {
  getScheduledAtStatus,
  getTaskPaymentAmount,
  getTaskPaymentGstAmount,
} from 'dependency-layer/payment';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log('EVENT RECEIVED: ', JSON.stringify(ctx));
  const { sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  //const { billPayments, entityId } = ctx.arguments.input;
  const { agreementUuids, billPayments } = ctx.arguments.input; //TODO - status for validate?

  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }

  const ip = sourceIp[0];

  // get all agreement records from database
  let payToAgreementRecords;
  try {
    payToAgreementRecords = await batchGet({
      tableName: TABLE_PAYTO_AGREEMENT ?? '',
      keys: agreementUuids.map((agreementUuid: string) => ({
        id: agreementUuid,
      })),
    });

    console.log('payToAgreementRecords: ', payToAgreementRecords);
  } catch (err: any) {
    console.log('ERROR batch get agreements: ', err);
    throw new Error(err.message);
  }

  validatePayToAgreements(payToAgreementRecords);

  const entityId = payToAgreementRecords[0].entityId;

  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      entityId,
      userId: sub,
    });
  } catch (err: any) {
    console.log('ERROR getRecord EntityUser: ', err);
    throw new Error(err.message);
  }

  validateEntityUser(entityUser);

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  const response = [];
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

  const requests = [];
  for (let i = 0; i < payToAgreementRecords.length; i++) {
    const agreement = payToAgreementRecords[i];
    console.log('Agreement: ', agreement);

    let createdAgreement;
    try {
      createdAgreement = createZaiPayToAgreement(
        zaiAuthToken?.access_token,
        agreement.agreementUuid ?? ''
      );

      requests.push(createdAgreement);
    } catch (err: any) {
      console.log('ERROR createPayToAgreement: ', err);
      throw new Error(err.message);
    }
  }

  let createdAgreements;
  try {
    createdAgreements = await Promise.all(requests);
    console.log('Created agreements: ', createdAgreements);
  } catch (err: any) {
    console.log('ERROR create payto agreements: ', err);
    throw new Error(err.message);
  }

  for (let i = 0; i < createdAgreements.length; i++) {
    const createdAgreement = createdAgreements[i];
    const agreement = payToAgreementRecords.find(
      (record) => record.agreementUuid === createdAgreement.agreement_uuid
    );

    response.push({
      ...agreement,
      status: createdAgreement.status,
      updatedAt: getIsoDateFromZaiDate(createdAgreement.updated_at),
    });
  }

  console.log('response: ', response);

  // only map a response as webhook will receive update // TODO: double check if the case
  //const response = createdAgreements.map((agreement) => ({
  //  id: agreement.agreement_uuid,
  //  agreementUuid: agreement.agreement_uuid,
  //  status: agreement.status,
  //  entityId,
  //}));

  //console.log('response: ', response);

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const taskPayment = billPayments.find(
      (billPayment: BillsPaymentInput) => billPayment.id === task.id
    );

    console.log('taskPayment: ', taskPayment);

    // prevents TS issues, validation occurs in validateBills
    if (!taskPayment || !task.amount) {
      throw new Error(`INVALID_BILL_PAYMENT`);
    }

    // get amount for this payment
    const amount = getTaskPaymentAmount({
      amount: task.amount,
      installments: taskPayment.installments,
      paymentType: taskPayment.paymentType,
      isFirstInstallment: true,
      isTaxBill: false, // TODO: payto parked for now, but will need to handle tax bills
    });

    const { buyerId, sellerId } = await getPaymentFromToData(task);

    const futurePayments = [];

    let status;
    if (taskPayment.paymentType === PaymentType.SCHEDULED) {
      status = getScheduledAtStatus({
        amount,
        scheduledAt: taskPayment.scheduledAt,
      });
    } else {
      status = PaymentStatus.PENDING_PAYTO_AGREEMENT_CREATION;
    }

    // take payment in future if scheduled as scheduled for future
    const createdAt = new Date().toISOString();
    const payment: Payment = {
      id: randomUUID(),
      entityId: task.entityId,
      taskId: task.id,
      amount,
      gstAmount: getTaskPaymentGstAmount({
        amount: task.amount,
        installments: taskPayment.installments,
        paymentType: taskPayment.paymentType,
        isFirstInstallment: true,
        isTaxBill: false,
        gstInclusive: task.gstInclusive ?? false,
      }),
      status,
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
      createdAt,
      updatedAt: createdAt,
      scheduledAt: taskPayment.scheduledAt,
      __typename: 'Payment',
    };

    futurePayments.push(payment);

    // update task to scheduled
    try {
      const taskParams = {
        // TODO: task params type
        paymentStatus: TaskPaymentStatus.PENDING_PAYTO_AGREEMENT_CREATION,
        status: TaskPaymentStatus.SCHEDULED,
        updatedAt: new Date().toISOString(),
      };

      await updateRecord(
        TABLE_TASK ?? '',
        { entityId: task.entityId, id: task.id },
        taskParams
      );
    } catch (err: any) {
      console.log('ERROR update task status: ', err);
      throw new Error(err.message);
    }

    for (let j = 1; j < (taskPayment.installments ?? 1); j++) {
      const nextScheduledAt = DateTime.fromFormat(
        task.dueAt ?? '',
        'yyyy-MM-dd'
      )
        .plus({ months: j }) // TODO: NOT CORRECT - SHOULDNT BE MONTHS
        .toFormat('yyyy-MM-dd');
      // create installment
      const createdAt = new Date().toISOString();
      const installment: Payment = {
        id: randomUUID(),
        entityId: task.entityId,
        taskId: task.id,
        paymentType: PaymentType.INSTALLMENTS,
        paymentProvider: PaymentProvider.ZAI,
        ipAddress: ip,
        //feeId,
        fromId: task.fromId,
        fromType: task.fromType,
        toId: task.toId,
        amount: getTaskPaymentAmount({
          paymentType: taskPayment.paymentType,
          amount: task.amount,
          installments: taskPayment.installments,
          isFirstInstallment: false,
          isTaxBill: false, //TODO: payto parked for now, but will need to handle tax bills
        }),
        gstAmount: getTaskPaymentGstAmount({
          amount: task.amount,
          paymentType: taskPayment.paymentType,
          installments: taskPayment.installments,
          isFirstInstallment: false,
          isTaxBill: false,
          gstInclusive: task.gstInclusive ?? false,
        }),
        buyerId,
        sellerId,
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
        console.log('ERROR batch put payments: ', err);
        throw new Error(err.message);
      }
    }
  }

  return response;
};
