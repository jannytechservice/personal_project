import {
  Context,
  DynamoDBGetItemRequest,
  runtime,
  util,
} from '@aws-appsync/utils';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBGetItemRequest {
  const { serviceId } = ctx.source;

  if (!serviceId) {
    runtime.earlyReturn();
  }

  return dynamoDBGetItemRequest({
    id: serviceId,
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return result;
}
