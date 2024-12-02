import { Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { CreateServiceMutationVariables, ServiceStatus } from '../API';
import { dynamodbPutRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBPutItemRequest {
  const { input } = ctx.arguments as CreateServiceMutationVariables;

  const key = { id: util.autoId() };
  const createdAt = util.time.nowISO8601();
  const data = {
    ...input,
    searchName: input?.description?.toLowerCase(),
    status: ServiceStatus.ACTIVE,
    createdAt,
    updatedAt: createdAt,
  };
  const condition = { id: { attributeExists: false } };
  return dynamodbPutRequest({ key, data, condition });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return ctx.result;
}
