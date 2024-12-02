import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBGetItemRequest,
  util,
} from '@aws-appsync/utils';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

// creates the entity record
export function request(ctx: Context): DynamoDBGetItemRequest {
  const { sub } = ctx.identity as AppSyncIdentityCognito;

  return dynamoDBGetItemRequest({
    id: sub,
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  const { claims } = ctx.identity as AppSyncIdentityCognito;
  if (
    (claims?.['custom:firmId'] || result.firmId) &&
    ctx.arguments.input.isFirm
  ) {
    return util.appendError(
      'CAN_NOT_CREATE_ANOTHER_FIRM',
      'Unauthorized',
      result
    );
  }
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return ctx.result;
}
