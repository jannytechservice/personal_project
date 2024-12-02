import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import {
  CreateTaskMutationVariables,
  InvoiceStatus,
  S3Upload,
  S3UploadInput,
  S3UploadType,
  Task,
  TaskCategory,
  TaskDirection,
  TaskType,
} from 'dependency-layer/API';
import {
  createRecord,
  getRecord,
  updateRecord,
} from 'dependency-layer/dynamoDB';
import {
  Annotation,
  getFiveDigitCode,
  getTaskPaymentStatus,
  getTaskSearchStatus,
  getTaskSignatureStatus,
  getTaskStatus,
} from 'dependency-layer/task';
import {
  validateEntityUser,
  validateNewTask,
  validateTaskToFrom,
} from 'dependency-layer/zai';

const {
  TABLE_CONTACT,
  TABLE_ENTITY,
  TABLE_ENTITY_USER,
  TABLE_TASK,
  TABLE_TASK_NUM_INCREMENT,
} = process.env;

export const handler: AppSyncResolverHandler<
  CreateTaskMutationVariables,
  any
> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { claims, sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments as CreateTaskMutationVariables;
  console.log('claims.phone: ', claims.phone_number);
  console.log('sourceIp: ', sourceIp);

  // validation to prevent ts errors
  if (!input) {
    throw new Error('No input provided');
  }
  if (!TABLE_ENTITY || !TABLE_CONTACT || !TABLE_ENTITY_USER || !TABLE_TASK) {
    throw new Error('TABLES_NOT_FOUND');
  }
  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }

  console.log(
    'input.annotations: ',
    JSON.stringify(input.annotations),
    typeof input.annotations
  );

  const ip = sourceIp[0];
  console.log('ip: ', ip);
  let documents: S3Upload[] = [];
  let entityId;
  let contactId;

  // GET ENTITY USER of task that's being created, for authorisation check
  if (input.direction === TaskDirection.SENDING) {
    entityId = input.fromId;
    contactId = input.type !== TaskType.SIGN_ONLY ? input.toId : null;
  } else if (input.direction === TaskDirection.RECEIVING) {
    entityId = input.toId;
    contactId = input.fromId;
  }

  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      userId: sub,
      entityId,
    });
    console.log('entityUser: ', entityUser);
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  // Task validation
  validateEntityUser(entityUser);
  validateNewTask(input);
  const { entityFrom } = await validateTaskToFrom(input);

  // Task statuses
  const annotations =
    typeof input.annotations === 'string'
      ? JSON.parse(input.annotations)
      : input.annotations;
  const annotationsWithUUID: Annotation[] = annotations?.annotations?.map(
    (annotation: Annotation) => {
      return {
        ...annotation,
        customData: {
          ...annotation.customData,
          id: randomUUID(),
        },
      };
    }
  );

  console.log('annotationsWithUUID: ', annotationsWithUUID);

  const signatureStatus = getTaskSignatureStatus({
    type: input.type,
    annotations: {
      ...annotations,
      annotations: annotationsWithUUID,
    },
  });
  const paymentStatus = getTaskPaymentStatus({
    type: input.type,
    settlementStatus: input.settlementStatus,
  });
  const taskStatus = getTaskStatus({
    status: input.status,
    signatureStatus,
    paymentStatus,
  });
  const searchStatus = getTaskSearchStatus({
    status: taskStatus,
    signatureStatus,
    paymentStatus,
  });

  // Task documents
  if (input.documents) {
    documents = input.documents
      .filter((doc): doc is S3UploadInput => doc !== null)
      .map(({ level, key, identityId }) => {
        return {
          level,
          key,
          identityId,
          type: S3UploadType.PDF,
          __typename: 'S3Upload',
        };
      });
  }

  let taskNumIncrement;
  try {
    taskNumIncrement = await getRecord(TABLE_TASK_NUM_INCREMENT ?? '', {
      id: entityUser.entityId,
    });
    console.log('SUccess get task num increment: ', taskNumIncrement);
  } catch (err: any) {
    console.log('ERROR get task num increment: ', err);
    throw new Error(err.message);
  }

  const createdAt = new Date().toISOString();
  let taskNumber = '';
  //TODO - add more invoice status in the future
  if (input.invoiceStatus === InvoiceStatus.INVOICE) {
    if (!taskNumIncrement) {
      taskNumber = 'IV' + getFiveDigitCode(1);
      const params = {
        id: entityUser.entityId,
        invoice: 1,
        quote: 0,
        createdAt,
        updatedAt: createdAt,
        __typename: 'TaskNumIncrement',
      };
      try {
        const rlt = await createRecord(TABLE_TASK_NUM_INCREMENT ?? '', params);
        console.log('SUccess create task num increment: ', rlt);
      } catch (err: any) {
        console.error('ERROR create task num increment: ', err);
        throw new Error(err.message);
      }
    } else {
      taskNumber =
        'IV' + getFiveDigitCode(Number(taskNumIncrement.invoice) + 1);
      const params = {
        invoice: Number(taskNumIncrement.invoice) + 1,
        updatedAt: createdAt,
      };
      try {
        const rlt = await updateRecord(
          TABLE_TASK_NUM_INCREMENT ?? '',
          { id: taskNumIncrement.id },
          params
        );
        console.log('SUccess update task num increment: ', rlt);
      } catch (err: any) {
        console.error('ERROR update task num increment: ', err);
        throw new Error(err.message);
      }
    }
  } else if (input.invoiceStatus === InvoiceStatus.QUOTE) {
    if (!taskNumIncrement) {
      taskNumber = 'QT' + getFiveDigitCode(1);
      const params = {
        id: entityUser.entityId,
        invoice: 0,
        quote: 1,
        createdAt,
        updatedAt: createdAt,
        __typename: 'TaskNumIncrement',
      };
      try {
        const rlt = await createRecord(TABLE_TASK_NUM_INCREMENT ?? '', params);
        console.log('SUccess create task num increment: ', rlt);
      } catch (err: any) {
        console.error('ERROR create task num increment: ', err);
        throw new Error(err.message);
      }
    } else {
      taskNumber = 'QT' + getFiveDigitCode(Number(taskNumIncrement.quote) + 1);
      const params = {
        quote: Number(taskNumIncrement.quote) + 1,
        updatedAt: createdAt,
      };
      try {
        const rlt = await updateRecord(
          TABLE_TASK_NUM_INCREMENT ?? '',
          { id: taskNumIncrement.id },
          params
        );
        console.log('SUccess update task num increment: ', rlt);
      } catch (err: any) {
        console.error('ERROR update task num increment: ', err);
        throw new Error(err.message);
      }
    }
  }

  const createParams: Partial<Task> = {
    ...input,
    annotations: annotationsWithUUID
      ? {
          ...annotations,
          annotations: annotationsWithUUID,
        }
      : null,
    id: randomUUID(),
    taskNumber,
    documents,
    contactId,
    entityId: entityUser.entityId, //
    entityIdBy: entityUser.entityId, // TODO? what if created by accountant
    status: taskStatus,
    category:
      entityFrom?.subCategory === 'TAX' ? TaskCategory.TAX : TaskCategory.OTHER,
    signatureStatus,
    paymentStatus,
    entityByIdContactId: `${entityUser.entityId}#${
      entityUser.entityId === input.toId ? input.fromId : input.toId
    }`, //TODO: review logic, this is for searching bills created by an entity for contact, etc.
    fromSearchStatus: `${input.fromId}#${searchStatus}`, // allows search results for outbox
    createdBy: sub,
    createdAt,
    updatedAt: createdAt,
    __typename: 'Task',
  };

  if (input.toId) {
    createParams.toSearchStatus = `${input.toId}#${searchStatus}`;
  }

  // search name
  if (input.reference) {
    createParams.searchName = input.reference.toLowerCase();
  }

  try {
    await createRecord(TABLE_TASK ?? '', createParams);
  } catch (err: any) {
    console.log('ERROR create task: ', err);
    throw new Error(err.message);
  }

  return createParams;
};
