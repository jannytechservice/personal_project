import { Context, util, DynamoDBGetItemRequest } from '@aws-appsync/utils';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBGetItemRequest {
  const {
    input: { id },
  } = ctx.args;
  return dynamoDBGetItemRequest({ id });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return result;
}
