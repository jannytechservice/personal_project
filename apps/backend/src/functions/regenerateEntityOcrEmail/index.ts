const { TABLE_ENTITY } = process.env;
import { Entity } from 'dependency-layer/API';
import {
  getRecord,
  queryRecords,
  updateRecord,
} from 'dependency-layer/dynamoDB';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { validateEntityUser } from 'dependency-layer/zai';
import { generateEntityEmail } from 'dependency-layer/entity';

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { entityId } = ctx.arguments.input;

  //// get entity
  //let entity;
  //try {
  //  entity = await getRecord(TABLE_ENTITY ?? '', {
  //    id: entityId,
  //  });
  //} catch (err: any) {
  //  console.log('ERROR get entity: ', err);
  //  throw new Error(err.message);
  //}

  const [entityUser, entity] = await Promise.all([
    getRecord(TABLE_ENTITY_USER ?? '', { userId: sub, entityId }),
    getRecord(TABLE_ENTITY ?? '', { id: entityId }),
  ]);

  validateEntityUser(entityUser);

  // regenerate unique ocr email
  let ocrEmail;
  let isUnique = false;
  let updateEntityParams: Partial<Entity> = {};

  while (!isUnique) {
    ocrEmail = generateEntityEmail(entity.name ?? '');
    try {
      const entityWithOcrEmail = await queryRecords({
        tableName: TABLE_ENTITY ?? '',
        keys: {
          ocrEmail: ocrEmail,
        },
        indexName: 'entityByOcrEmail',
        limit: 1,
      });
      isUnique = entityWithOcrEmail.length === 0;
    } catch (err: any) {
      console.log('ERROR queryRecords: ', err);
      throw new Error(err.message);
    }
  }

  updateEntityParams = {
    ...updateEntityParams,
    ocrEmail,
  };

  try {
    const updatedEntity = await updateRecord(
      TABLE_ENTITY ?? '',
      { id: entityId },
      updateEntityParams
    );
    return updatedEntity;
  } catch (err: any) {
    console.log('ERROR updateEntity: ', err);
    throw new Error(err.message);
  }
};
