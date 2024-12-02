import { generateInvoiceAndQuote } from './generateInvoiceAndQuote';
import { randomUUID } from 'crypto';
import {
  ActivityType,
  Task,
  TaskPaymentStatus,
  TaskStatus,
  TaskType,
} from 'dependency-layer/API';
import { createRecord } from 'dependency-layer/dynamoDB';
import { sendInvoiceEmail } from 'dependency-layer/payment';
import {
  AnnotationDocument,
  getCreatedAnnotations,
  sendInvoiceSms,
  sendSignatureEmail,
} from 'dependency-layer/task';
import { DateTime } from 'luxon';

const { TABLE_ACTIVITY } = process.env;

export const handleTaskInsert = async (task: Task) => {
  // create task activity
  const createdAt = DateTime.now().toISO();
  const createdActivityRecord = {
    id: randomUUID(),
    compositeId: `${task.entityId}#${task.id}`,
    message: task.status === TaskStatus.DRAFT ? 'TASK_DRAFT' : 'TASK_CREATED',
    userId: task.createdBy,
    entityId: task.entityId,
    type: ActivityType.TASK,
    createdAt,
    updatedAt: createdAt,
    metadata: { __typename: 'ActivityMetadata' },
    __typename: 'Activity',
  };

  try {
    await createRecord(TABLE_ACTIVITY ?? '', createdActivityRecord);
  } catch (err: any) {
    console.log('ERROR create activity: ', err);
  }

  if (task.annotations) {
    const updatedAnnotations = getCreatedAnnotations({
      newAnnotations: task.annotations as
        | AnnotationDocument
        | null
        | undefined
        | any, //TODO: fix type once schema defined for annotations
    });
    for (const annotation of updatedAnnotations) {
      if (
        annotation?.customData?.name &&
        annotation.customData.status === 'ACTIONED' &&
        annotation.customData.type === 'SIGNATURE'
      ) {
        try {
          const signedActivityRecord = {
            id: randomUUID(),
            compositeId: `${task.entityId}#${task.id}`,
            message: 'TASK_USER_SIGNED',
            userId: annotation.customData.signerId,
            entityId: task.entityId,
            type: ActivityType.TASK,
            createdAt,
            updatedAt: createdAt,
            metadata: {
              name: annotation?.customData?.name, //TODO: will this be set?
              __typename: 'ActivityMetadata',
            },
            __typename: 'Activity',
          };
          await createRecord(TABLE_ACTIVITY ?? '', signedActivityRecord);
        } catch (err) {
          console.log('ERROR create signed activity: ', err);
        }
      }
    }
  }

  // signature requested
  if (
    task.type === TaskType.SIGN_ONLY &&
    //task.entityIdBy !== task.toId &&
    task.status !== TaskStatus.DRAFT
  ) {
    try {
      await sendSignatureEmail(task, 'signature');
    } catch (err) {
      console.log('ERROR send signature email: ', err);
    }
  }

  // payment requested
  else if (
    task.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT &&
    task.entityIdBy !== task.toId &&
    task.status !== TaskStatus.DRAFT
  ) {
    try {
      await sendInvoiceEmail(task, 'invoice');
      console.log('Success send invoice email');
    } catch (err) {
      console.error('ERROR send invoice email: ', err);
    }

    try {
      await sendInvoiceSms(task);
      console.log('Success send sms');
    } catch (err) {
      console.log('ERROR send sms: ', err);
    }
  }

  if (task.amount) {
    await generateInvoiceAndQuote(task);
  }
};
