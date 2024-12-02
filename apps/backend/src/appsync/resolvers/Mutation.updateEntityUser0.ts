import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBGetItemRequest,
  runtime,
  util,
} from '@aws-appsync/utils';
import { EntityUserRole } from '../API';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';
import { UpdateEntityUserInput } from 'dependency-layer/API';

export function request(ctx: Context): DynamoDBGetItemRequest {
  if (util.authType() === 'IAM Authorization') {
    runtime.earlyReturn();
  }

  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.args;
  const { entityId } = input as UpdateEntityUserInput;

  return dynamoDBGetItemRequest({
    userId: sub,
    entityId: entityId,
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;

  if (!result || result.role !== EntityUserRole.OWNER) {
    util.unauthorized();
  }

  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return result;
}
