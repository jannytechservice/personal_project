import { randomUUID } from 'crypto';
import {
  ActivityType,
  Task,
  TaskPaymentStatus,
  TaskSignatureStatus,
  TaskStatus,
  TaskType,
} from 'dependency-layer/API';
import { batchPut, getRecord, updateRecord } from 'dependency-layer/dynamoDB';
import { sendInvoiceEmail } from 'dependency-layer/payment';
import { sendEmail } from 'dependency-layer/pinpoint';
import {
  AnnotationDocument,
  getUpdatedAnnotations,
  sendInvoiceSms,
  sendSignatureEmail,
} from 'dependency-layer/task';
import { DateTime } from 'luxon';
import { updateReferral } from 'dependency-layer/user';
import { XeroClient, Invoices, Invoice } from 'xero-node';
import { initializeXeroClientWithTokenSet } from 'dependency-layer/xero';

const {
  FROM_EMAIL,
  WEB_DOMAIN,
  TABLE_ACTIVITY,
  TABLE_ENTITY_USER,
  TABLE_CONTACT,
  TABLE_USER,
  TABLE_XERO_TOKEN,
} = process.env;

const getUpdatedActivityMessages = (newTask: Task, oldTask: Task) => {
  const activityMessages: {
    message: string;
    userId?: string;
    entityId?: string;
    contactId?: string;
    signerType?: string;
  }[] = [];

  const updatedAnnotations = getUpdatedAnnotations({
    oldAnnotations: oldTask.annotations as
      | AnnotationDocument
      | null
      | undefined,
    newAnnotations: newTask.annotations as
      | AnnotationDocument
      | null
      | undefined,
  });
  console.log('updatedAnnotations: ', updatedAnnotations);
  for (const annotation of updatedAnnotations) {
    if (
      annotation.customData.signerType === 'ENTITY_USER' &&
      annotation.customData?.signerId &&
      annotation.customData?.signerId !== 'undefined' && //TODO: should undefined be even saved?
      newTask.fromId
    ) {
      activityMessages.push({
        message: 'TASK_USER_SIGNED',
        userId: annotation.customData.signerId,
        entityId: newTask.fromId,
        signerType: annotation.customData.signerType,
      });
    } else if (
      annotation.customData.signerType === 'CONTACT' &&
      annotation.customData?.signerId &&
      annotation.customData?.contactId !== 'undefined'
    ) {
      activityMessages.push({
        message: 'TASK_USER_SIGNED',
        contactId: annotation.customData.signerId,
        signerType: annotation.customData.signerType,
      });
    }
  }

  if (
    newTask.signatureStatus !== oldTask.signatureStatus &&
    newTask.signatureStatus === TaskSignatureStatus.SIGNED
  ) {
    activityMessages.push({ message: 'TASK_SIGNED' });
  }

  if (newTask.viewedAt && !oldTask.viewedAt) {
    activityMessages.push({ message: 'TASK_VIEWED' });
  }

  if (newTask.paymentStatus !== oldTask.paymentStatus) {
    if (newTask.paymentStatus === TaskPaymentStatus.PAID)
      activityMessages.push({ message: 'TASK_PAID' });
    else if (newTask.paymentStatus === TaskPaymentStatus.MARKED_AS_PAID)
      activityMessages.push({ message: 'TASK_MARKED_AS_PAID' });
  }

  if (newTask.status !== oldTask.status) {
    if (newTask.status === TaskStatus.COMPLETED)
      activityMessages.push({ message: 'TASK_COMPLETED' });
    else if (newTask.status === TaskStatus.ARCHIVED)
      activityMessages.push({ message: 'TASK_ARCHIVED' });
    else if (newTask.status === TaskStatus.SCHEDULED)
      activityMessages.push({ message: 'TASK_SCHEDULED' });
  }

  return activityMessages;
};

export const handleTaskModify = async (newTask: Task, oldTask: Task) => {
  // Xero - update xero invoice
  if (newTask.xeroTenantId) {
    console.log('start xero sync stream');

    // get xeroTokenSet
    let xeroTokenSet;
    try {
      const xeroToken = await getRecord(TABLE_XERO_TOKEN ?? '', {
        id: newTask.createdBy,
      });
      xeroTokenSet = xeroToken.xeroTokenSet;
      console.log('Success getting tokenSet: ', xeroTokenSet);
    } catch (err: any) {
      console.error('Error getting tokenSet: ', err);
      throw new Error(err.message);
    }

    if (xeroTokenSet) {
      //initialize xero client
      let xero: XeroClient;
      try {
        xero = await initializeXeroClientWithTokenSet(xeroTokenSet);
        console.log('Success initialize xero: ', xero);
      } catch (err: any) {
        console.error('ERROR initialize xero: ', err);
        throw new Error(err.message);
      }

      //read token set
      const newXeroTokenSet = xero.readTokenSet();
      //update token set if changed
      if (newXeroTokenSet?.expires_at !== xeroTokenSet.expires_at) {
        try {
          const updateTokenParams = { xeroTokenSet: newXeroTokenSet };
          const xeroToken = await updateRecord(
            TABLE_XERO_TOKEN ?? '',
            { id: newTask.createdBy },
            updateTokenParams
          );
          console.log('Success update xero token table: ', xeroToken);
        } catch (err: any) {
          console.error('ERROR update xero token table: ', err);
          throw new Error(err.message);
        }
      }

      //TODO - define field precisely
      const updateInvoices: Invoices = new Invoices();
      const invoice2: Invoice = {
        invoiceID: newTask.id,
        status: newTask.invoiceStatus,
        total: newTask.amount ?? 0,
        type: newTask.type,
        attachments: newTask.documents,
        reference: newTask.reference,
        dueDate: newTask.dueAt,
        date: newTask.lodgementAt,
        updatedDateUTC: newTask.updatedAt,
        fullyPaidOnDate: newTask.completedAt,
        lineItems: newTask.lineItems,
      };
      updateInvoices.invoices = [invoice2];

      //update on Xero
      try {
        const res = await xero.accountingApi.updateOrCreateInvoices(
          newTask.xeroTenantId,
          updateInvoices
        );
        console.log('Success update xero contact: ', res.body.invoices);
      } catch (err: any) {
        console.error('ERROR updateOrCreateContacts: ', err);
        throw new Error(err.message);
      }
    }
  }

  // task activity for signatures
  const activityMessages: {
    message: string;
    userId?: string;
    entityId?: string;
    contactId?: string;
    signerType?: string;
  }[] = getUpdatedActivityMessages(newTask, oldTask);

  if (activityMessages.length > 0) {
    const activityRecords: any[] = [];
    const dateNow = new Date();
    for (let index = 0; index < activityMessages.length; index++) {
      const { message, userId, entityId, contactId, signerType } =
        activityMessages[index];
      let name = '';
      if (signerType === 'ENTITY_USER') {
        let entityUser;
        try {
          entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
            entityId,
            userId,
          });

          name = `${entityUser?.firstName ?? ''} ${entityUser?.lastName ?? ''}`;
        } catch (err) {
          console.log('ERROR get entity user: ', err);
        }
      }

      if (signerType === 'CONTACT') {
        let contact;
        try {
          contact = await getRecord(TABLE_CONTACT ?? '', {
            id: contactId,
          });

          name = `${contact?.firstName ?? ''} ${contact?.lastName ?? ''}`;
        } catch (err) {
          console.log('ERROR get contact: ', err);
        }
      }

      // dateNow + index as milliseconds to isostring
      const createdAt = new Date(dateNow.getTime() + index).toISOString();
      const activityRecord = {
        id: randomUUID(),
        compositeId: `${newTask.entityId}#${newTask.id}`,
        message,
        userId: userId ?? newTask.createdBy,
        entityId: newTask.entityId,
        type: ActivityType.TASK,
        createdAt,
        updatedAt: createdAt,
        metadata: name
          ? { name, __typename: 'ActivityMetadata' }
          : { __typename: 'ActivityMetadata' },
        __typename: 'Activity',
      };

      activityRecords.push(activityRecord);

      // signed email notification to createdBy

      let user;
      try {
        user = await getRecord(TABLE_USER ?? '', {
          id: newTask.createdBy,
        });
      } catch (err: any) {
        console.log('ERROR get user: ', err);
      }

      if (user?.email) {
        try {
          await sendEmail({
            senderAddress: FROM_EMAIL ?? '',
            templateName: 'document-signed',
            toAddresses: [user.email],
            templateData: {
              user,
              task: {
                ...newTask,
                url: `${WEB_DOMAIN}/guest/pay-task?entityId=${newTask.entityId}&taskId=${newTask.id}`,
              },
              signer: {
                name,
                dateSignedFormatted: DateTime.fromISO(createdAt).toLocaleString(
                  DateTime.DATE_HUGE
                ),
              },
            },
          });
        } catch (err: any) {
          console.log('ERROR send email: ', err);
        }
      }
    }
    console.log('activityRecords: ', activityRecords);

    try {
      await batchPut({
        tableName: TABLE_ACTIVITY ?? '',
        items: activityRecords,
      });
    } catch (err) {
      console.log('ERROR batch put activity: ', err);
    }
  }

  // signature requested email
  if (
    newTask.type === TaskType.SIGN_ONLY &&
    //newTask.entityIdBy !== newTask.toId &&
    oldTask.status === TaskStatus.DRAFT &&
    newTask.status !== TaskStatus.DRAFT
  ) {
    try {
      await sendSignatureEmail(newTask, 'signature');
    } catch (err) {
      console.log('ERROR send signature email: ', err);
    }
  }

  // payment requested email
  else if (
    newTask.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT &&
    newTask.entityIdBy !== newTask.toId &&
    oldTask.status === TaskStatus.DRAFT &&
    newTask.status !== TaskStatus.DRAFT
  ) {
    try {
      await sendInvoiceEmail(newTask, 'invoice');
    } catch (err) {
      console.log('ERROR send invoice email: ', err);
    }
    try {
      await sendInvoiceSms(newTask);
      console.log('Success send sms');
    } catch (err) {
      console.log('ERROR send sms: ', err);
    }
  }

  if (newTask.status !== oldTask.status) {
    if (newTask.status === TaskStatus.COMPLETED)
      try {
        await updateReferral(newTask);
      } catch (err) {
        console.log('ERROR updateReferral: ', err);
      }
  }
};
