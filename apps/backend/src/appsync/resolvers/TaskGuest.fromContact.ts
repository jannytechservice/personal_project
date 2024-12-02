import {
  Context,
  DynamoDBGetItemRequest,
  runtime,
  util,
} from '@aws-appsync/utils';
import { FromToType } from '../API';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

// gets contact from, if fromType is a contact and not an entity
export function request(ctx: Context): DynamoDBGetItemRequest {
  const { fromId, fromType } = ctx.source;

  if (!fromId || fromType !== FromToType.CONTACT) {
    runtime.earlyReturn();
  }

  return dynamoDBGetItemRequest({
    id: fromId,
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return result;
}
