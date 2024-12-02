const { TABLE_HASH, TABLE_TASK } = process.env;
import { Task, TaskSignatureStatus } from 'dependency-layer/API';
import { BETask } from 'dependency-layer/be.types';
import { getRecord, updateRecord } from 'dependency-layer/dynamoDB';
import {
  Annotation,
  AnnotationDocument,
  getTaskPaymentStatus,
  getTaskSearchStatus,
  getTaskSignatureStatus,
  getTaskStatus,
} from 'dependency-layer/task';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { DateTime } from 'luxon';

export const handler: AppSyncResolverHandler<
  //UpdateTaskPublicMutationVariables,
  any,
  any
> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { token } = input as { token: string; annotations: AnnotationDocument }; // UpdateTaskPublicInput;
  console.log('token', token);

  const parsedUpdateAnnotations: AnnotationDocument =
    typeof input.annotations === 'string'
      ? JSON.parse(input.annotations)
      : input.annotations;

  // validation to prevent ts errors
  if (!input) {
    throw new Error('No input provided');
  }

  if (!sourceIp || sourceIp?.length === 0) {
    throw new Error('NO_IP_ADDRESS');
  }

  const ip = sourceIp[0];
  console.log('ip: ', ip);

  let hashData;
  try {
    hashData = await getRecord(TABLE_HASH ?? '', { id: token });
  } catch (err: any) {
    throw new Error(err.message);
  }

  console.log('hashData: ', hashData);

  // error if no data
  if (!hashData?.data) {
    throw new Error('NO_DATA');
  }

  const expiresAt = DateTime.fromISO(hashData.expiresAt);
  if (expiresAt < DateTime.now()) {
    throw new Error('TOKEN_EXPIRED');
  }

  const { taskId, entityId, signerId } = hashData.data;

  //

  // get and validate existing task
  let existingTask: BETask | null = null;
  try {
    existingTask = await getRecord(TABLE_TASK ?? '', {
      id: taskId,
      entityId,
    });
    console.log('existingTask: ', JSON.stringify(existingTask));
  } catch (err: any) {
    console.log('ERROR get task: ', err);
    throw new Error(err.message);
  }

  if (!existingTask) {
    throw new Error('NO_TASK');
  }

  // verify that the signerId of filtered annotations are those of the task's annotations
  const userUpdatingAnnotations = parsedUpdateAnnotations?.annotations?.filter(
    (annotation: Annotation) => annotation.customData.signerId === signerId
  );
  console.log(
    'userUpdatingAnnotations: ',
    JSON.stringify(userUpdatingAnnotations)
  );
  //TODO: review this logic - more secure to only allow user to update their annotation
  const isValid = userUpdatingAnnotations.every(
    (updatedAnnotations: Annotation) =>
      existingTask?.annotations?.annotations?.some(
        (taskAnnotation: Annotation) =>
          taskAnnotation.customData.id === updatedAnnotations.customData.id &&
          taskAnnotation.customData.signerId === signerId
      )
  );

  if (!isValid) {
    throw new Error('UNAUTHORISED_ANNOTATION_UPDATE');
  }

  // map the user's annotations with the task's existing annotations
  const updatedAnnotations = existingTask?.annotations?.annotations?.map(
    (taskAnnotation: Annotation) => {
      const userAnnotation = userUpdatingAnnotations.find(
        (filteredAnnotation: Annotation) =>
          filteredAnnotation.customData.id === taskAnnotation.customData.id
      );
      return userAnnotation ?? taskAnnotation;
    }
  );

  console.log(
    'Combined annotations with updated annotations: ',
    JSON.stringify(updatedAnnotations)
  );

  //TODO: validate change to annotations

  const paymentStatus = getTaskPaymentStatus({
    type: existingTask.type,
    existingStatus: existingTask.paymentStatus,
    settlementStatus: existingTask.settlementStatus,
  });
  const signatureStatus = getTaskSignatureStatus({
    type: existingTask.type,
    annotations: input.annotations ?? existingTask.annotations,
  });
  const taskStatus = getTaskStatus({
    status: existingTask.status,
    signatureStatus,
    paymentStatus,
  });
  const searchStatus = getTaskSearchStatus({
    status: taskStatus,
    signatureStatus,
    paymentStatus,
  });

  const updateParams: Partial<Task> = {
    paymentStatus,
    signatureStatus,
    status: taskStatus,
    fromSearchStatus: `${existingTask.fromId}#${searchStatus}`, // allows search results for outbox
    updatedAt: new Date().toISOString(),
  };

  if (
    signatureStatus === TaskSignatureStatus.SIGNED &&
    existingTask.signatureStatus !== TaskSignatureStatus.SIGNED &&
    input.document
  ) {
    updateParams.documents = [input.document];
  }

  if (existingTask.toId) {
    updateParams.toSearchStatus = `${existingTask.toId}#${searchStatus}`; // allows search results for inbox
  }

  const combinedAnnotations = {
    ...(existingTask?.annotations ?? {}),
    annotations: updatedAnnotations,
    attachments: {
      ...(existingTask?.annotations ?? {}).attachments,
      ...(parsedUpdateAnnotations.attachments ?? {}),
    },
  };

  console.log('combinedAnnotations: ', JSON.stringify(combinedAnnotations));

  if (combinedAnnotations) {
    updateParams.annotations = combinedAnnotations;
  }

  let updatedTask;
  try {
    updatedTask = await updateRecord(
      TABLE_TASK ?? '',
      {
        id: taskId,
        entityId,
      },
      updateParams
    );
    console.log('updatedTask: ', updatedTask);
  } catch (err: any) {
    console.log('ERROR update task: ', err);
    throw new Error(err.message);
  }

  const namedAnnotation = combinedAnnotations?.annotations?.find(
    (annotation: Annotation) =>
      annotation?.customData?.signerId === signerId &&
      annotation?.customData?.type === 'SIGNATURE' &&
      annotation?.customData?.name
  );

  console.log('namedAnnotation: ', namedAnnotation);
  const name = namedAnnotation?.customData?.name ?? '';

  return {
    ...updatedTask,
    to: {
      id: signerId,
      name: name ?? '',
    },
  };
};
