const { TABLE_ENTITY, TABLE_CONTACT, TABLE_ENTITY_USER, TABLE_TASK } =
  process.env;
import {
  S3UploadInput,
  S3UploadType,
  Task,
  UpdateTaskInput,
  UpdateTaskMutationVariables,
  UpdateTaskStatus,
} from 'dependency-layer/API';
import { getRecord, updateRecord } from 'dependency-layer/dynamoDB';
import {
  validateEntityUser,
  validateExistingTask,
  validateNewTask,
  validateTaskToFrom,
} from 'dependency-layer/zai';
import {
  getTaskSearchStatus,
  getTaskPaymentStatus,
  getTaskSignatureStatus,
  getTaskStatus,
} from 'dependency-layer/task';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

export const handler: AppSyncResolverHandler<
  UpdateTaskMutationVariables,
  any
> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { id, entityId, ...restInput } = input as UpdateTaskInput;

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

  const ip = sourceIp[0];
  console.log('ip: ', ip);

  // GET ENTITY USER of task that's being created, for authorisation check
  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      userId: sub,
      entityId: entityId,
    });
    console.log('entityUser: ', entityUser);
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  validateEntityUser(entityUser);

  // get and validate existing task
  let existingTask;
  try {
    existingTask = await getRecord(TABLE_TASK ?? '', {
      id,
      entityId,
    });
    console.log('existingTask: ', existingTask);
  } catch (err: any) {
    console.log('ERROR get task: ', err);
    throw new Error(err.message);
  }

  validateExistingTask(input, existingTask);

  // Task statuses
  const paymentStatus = getTaskPaymentStatus({
    updatedPaymentStatus: input.paymentStatus ?? undefined,
    type: input.type ?? existingTask.type,
    existingStatus: existingTask.status,
    settlementStatus: input.settlementStatus ?? existingTask.settlementStatus,
  });
  const signatureStatus = getTaskSignatureStatus({
    type: input.type ?? existingTask.type,
    annotations: input.annotations ?? existingTask.annotations,
  });
  const taskStatus = getTaskStatus({
    status: input.status ?? existingTask.status,
    signatureStatus,
    paymentStatus,
  });
  const searchStatus = getTaskSearchStatus({
    status: taskStatus,
    signatureStatus,
    paymentStatus,
  });

  const updateParams: Partial<Task> = {
    ...restInput,
    paymentStatus,
    signatureStatus,
    annotations: input.annotations ?? existingTask.annotations ?? '',
    status: taskStatus,
    fromSearchStatus: `${existingTask.fromId}#${searchStatus}`, // allows search results for outbox
    updatedAt: new Date().toISOString(),
  };

  if (input.toId) {
    updateParams.toSearchStatus = `${existingTask.toId}#${searchStatus}`; // allows search results for inbox
  }

  // Task documents
  if (input.documents) {
    updateParams.documents = input.documents.map(
      ({ level, key, identityId }: S3UploadInput) => {
        return {
          level,
          key,
          identityId,
          type: S3UploadType.PDF,
          __typename: 'S3Upload',
        };
      }
    );
  }

  // task changing from Draft to Incomplete (now sending out to recipient)
  if (input.status === UpdateTaskStatus.INCOMPLETE) {
    validateNewTask(input);
    await validateTaskToFrom({
      ...existingTask,
      ...input,
    });
  }

  let updatedTask;
  try {
    updatedTask = await updateRecord(
      TABLE_TASK ?? '',
      {
        id,
        entityId,
      },
      updateParams
    );
    console.log('updatedTask: ', updatedTask);
  } catch (err: any) {
    console.log('ERROR update task: ', err);
    throw new Error(err.message);
  }

  return updatedTask;
};
