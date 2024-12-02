import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBGetItemRequest,
  util,
} from '@aws-appsync/utils';
import { EntityUserRole } from '../API';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBGetItemRequest {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const {
    input: { entityId },
  } = ctx.args;

  return dynamoDBGetItemRequest({
    userId: sub,
    entityId,
  });
}

export function response(ctx: Context) {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const {
    input: { userId },
  } = ctx.args;
  const { error, result } = ctx;

  // if no entity user, not authorised
  if (!result) {
    util.unauthorized();
  }

  // don't allow owner to delete themselves, check based on role and userid / sub
  if (result.role === EntityUserRole.OWNER && userId === sub) {
    util.unauthorized();
  }

  // only owner can delete other entity users
  if (result.role !== EntityUserRole.OWNER && userId !== sub) {
    util.unauthorized();
  }

  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return ctx.result;
}
