import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBGetItemRequest,
  util,
} from '@aws-appsync/utils';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBGetItemRequest {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { entityIdBy } = ctx.args;

  return dynamoDBGetItemRequest({
    userId: sub,
    entityId: entityIdBy,
  });
}

export function response(ctx: Context) {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { error, result } = ctx;

  if (!result?.userId || result?.userId !== sub) {
    util.unauthorized();
  }

  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return ctx.result;
}