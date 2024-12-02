import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBUpdateItemRequest,
  util,
} from '@aws-appsync/utils';

import { dynamodbUpdateRequest } from '../helpers/dynamodb';
import { EntityClientsStatus } from '../API';

// creates the entity record
export function request(ctx: Context): DynamoDBUpdateItemRequest {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { id } = ctx.prev.result;

  const key = { id: sub };

  const data =
    ctx.stash.entity.clientsStatus === EntityClientsStatus.REVIEW ||
    ctx.stash.entity.clientsStatus === EntityClientsStatus.ENABLED
      ? { firmId: id, updatedAt: util.time.nowISO8601() }
      : { updatedAt: util.time.nowISO8601() };

  const condition = { id: { attributeExists: true } };

  return dynamodbUpdateRequest({ key, data, condition });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return ctx.stash.entity;
}
