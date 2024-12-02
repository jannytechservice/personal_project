const { TABLE_ENTITY, TABLE_USER, TABLE_ENTITY_USER } = process.env;
import {
  EntityUserRole,
  EntityUserStatus,
  EntityClientsStatus,
} from 'dependency-layer/API';
import { getRecord, updateRecord } from 'dependency-layer/dynamoDB';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { validateEntityUser } from 'dependency-layer/zai';

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { status, entityId, userId } = ctx.arguments.input;

  // get entity user to check it the sub is already a user of the entity
  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      entityId,
      userId,
    });
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  validateEntityUser(entityUser);

  // get entity
  let entity;
  try {
    entity = await getRecord(TABLE_ENTITY ?? '', {
      id: entityId,
    });
  } catch (err: any) {
    console.log('ERROR get entity: ', err);
    throw new Error(err.message);
  }

  // check the role of user and if accountant, create firmid on the user table and Cognito
  if (
    entityUser.role === EntityUserRole.ACCOUNTANT &&
    status === EntityUserStatus.ACCEPTED &&
    entity.clientsStatus === EntityClientsStatus.ENABLED
  ) {
    try {
      await updateRecord(
        TABLE_USER ?? '',
        {
          id: userId,
        },
        {
          firmId: entityId,
          updatedAt: new Date().toISOString(),
        }
      );
      const updatedEntityUser = await updateRecord(
        TABLE_ENTITY_USER ?? '',
        {
          entityId,
          userId,
        },
        {
          updatedAt: new Date().toISOString(),
          status: status,
        }
      );
      return updatedEntityUser;
    } catch (err: any) {
      console.log('ERROR update entity user: ', err);
      throw new Error(err.message);
    }
  } else {
    try {
      const updatedEntityUser = await updateRecord(
        TABLE_ENTITY_USER ?? '',
        {
          entityId,
          userId,
        },
        {
          updatedAt: new Date().toISOString(),
          status: status,
        }
      );
      return updatedEntityUser;
    } catch (err: any) {
      console.log('ERROR update entity user: ', err);
      throw new Error(err.message);
    }
  }
};
