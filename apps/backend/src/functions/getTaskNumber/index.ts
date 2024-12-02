import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { validateIsEntityUser } from 'dependency-layer/entity';
import { getRecord } from 'dependency-layer/dynamoDB';
const { TABLE_TASK_NUM_INCREMENT } = process.env;

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { entityId } = ctx.arguments;
  console.log('sub: ', sub);
  console.log('entityId: ', entityId);

  // get entity user
  try {
    const entityUser = await validateIsEntityUser({ entityId, userId: sub });
    console.log('Success validate entity user: ', entityUser);
  } catch (err: any) {
    console.error('ERROR validate entity user: ', err);
    throw new Error(err.message);
  }

  // get task number increment
  let taskNumIncrement;
  try {
    taskNumIncrement = await getRecord(TABLE_TASK_NUM_INCREMENT ?? '', {
      id: entityId,
    });
    console.log('Success getting task number increment: ', taskNumIncrement);
  } catch (err: any) {
    console.error('Error getting task number increment: ', err);
    throw new Error(err.message);
  }

  if (taskNumIncrement) return taskNumIncrement;
  else return { invoice: 0, quote: 0 };
};
