import { Context, util, DynamoDBDeleteItemRequest } from '@aws-appsync/utils';
import { EntityUserRole } from '../API';
import { dynamodbDeleteRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBDeleteItemRequest {
  const {
    input: { entityId, userId },
  } = ctx.args;

  const key = {
    entityId,
    userId,
  };

  const condition = {
    role: { ne: EntityUserRole.OWNER },
  };

  return dynamodbDeleteRequest({ key, condition });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return ctx.result;
}
