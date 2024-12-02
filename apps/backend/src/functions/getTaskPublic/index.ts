const { TABLE_CONTACT, TABLE_ENTITY, TABLE_HASH, TABLE_TASK } = process.env;
import { AppSyncResolverHandler } from 'aws-lambda';
import {
  Contact,
  Entity,
  FromToType,
  GetTaskPublicQueryVariables,
} from 'dependency-layer/API';
import { BEHash } from 'dependency-layer/be.types';
import { getRecord } from 'dependency-layer/dynamoDB';
import { Annotation } from 'dependency-layer/task';
import { DateTime } from 'luxon';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { token } = ctx.arguments as GetTaskPublicQueryVariables;
  console.log('token', token);

  //let taskGuest: Partial<TaskGuest> = {
  let taskGuest: any = {
    from: '',
    to: '',
  };

  let hashData: BEHash | null = null;
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

  const { taskId, entityId } = hashData.data;

  let task;
  try {
    task = await getRecord(TABLE_TASK ?? '', { id: taskId, entityId });
    console.log('task: ', task);
    taskGuest = {
      ...taskGuest,
      ...task,
    };
  } catch (err: any) {
    console.log('ERROR get task: ', err);
    throw new Error(err.message);
  }

  if (!task) {
    throw new Error('No task');
  }

  let entityFrom: Entity | null = null;
  let entityTo: Entity | null = null;
  let contactFrom: Contact | null = null;
  let contactTo: Contact | null = null;
  if (task.fromId && task.fromType === FromToType.ENTITY) {
    try {
      entityFrom = await getRecord(TABLE_ENTITY ?? '', { id: task.fromId });
      taskGuest.from = entityFrom;
      console.log('entityFrom: ', entityFrom);
    } catch (err: any) {
      console.log('ERROR get entity from: ', err);
      throw new Error(err.message);
    }
  }

  if (task.fromId && task.fromType === FromToType.CONTACT) {
    try {
      contactFrom = await getRecord(TABLE_CONTACT ?? '', {
        id: task.fromId,
      });
      taskGuest.from = contactFrom;
      console.log('contactFrom: ', contactFrom);
    } catch (err: any) {
      console.log('ERROR get contact from: ', err);
      throw new Error(err.message);
    }
  }

  if (task.toId && task.toType === FromToType.ENTITY) {
    try {
      entityTo = await getRecord(TABLE_ENTITY ?? '', { id: task.toId });
      taskGuest.to = entityTo;
      console.log('entityTo: ', entityTo);
    } catch (err: any) {
      console.log('ERROR get entity to: ', err);
      throw new Error(err.message);
    }
  }

  if (task.toId && task.toType === FromToType.CONTACT) {
    try {
      contactTo = await getRecord(TABLE_CONTACT ?? '', {
        id: task.toId,
      });
      taskGuest.to = contactTo;
      console.log('contactTo: ', contactTo);
    } catch (err: any) {
      console.log('ERROR get contact to: ', err);
      throw new Error(err.message);
    }
  }

  const taskAnnotations =
    task?.annotations?.annotations ?? ([] as Annotation[]);
  console.log('taskAnnotations: ', taskAnnotations);
  if (taskAnnotations) {
    const { signerId } = hashData.data;
    if (!signerId) {
      throw new Error('NO_SIGNER');
    }

    // filter annotations based if signers or actioned
    const displayAnnotations = taskAnnotations.filter(
      (annotation: Annotation) =>
        annotation?.customData?.signerId === signerId ||
        annotation?.customData?.status === 'ACTIONED'
    );

    // map annotation to flag if user's
    const mappedUserAnnotations = displayAnnotations.map(
      (annotation: Annotation) =>
        annotation?.customData?.signerId === signerId
          ? {
              ...annotation,
              isSignersAnnotation: true,
            }
          : annotation
    );

    console.log('mappedUserAnnotations: ', mappedUserAnnotations);

    const namedAnnotation = taskAnnotations.find(
      (annotation: Annotation) =>
        annotation?.customData?.signerId === signerId &&
        annotation?.customData?.type === 'SIGNATURE' &&
        annotation?.customData?.name
    );

    console.log('namedAnnotation: ', namedAnnotation);
    const name = namedAnnotation?.customData?.name;

    const isFinalSigner = taskAnnotations.every(
      (annotation: Annotation) =>
        annotation?.customData?.status !== 'PENDING' ||
        annotation?.customData?.signerId === signerId
    );

    taskGuest = {
      ...taskGuest,
      annotations: {
        ...taskGuest.annotations,
        annotations: mappedUserAnnotations,
      },
      to: {
        id: signerId,
        name: name ?? '',
      },
      isFinalSigner,
    };
  }

  return taskGuest;
};
