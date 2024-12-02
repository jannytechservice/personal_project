import { Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { CreateTemplateServiceMutationVariables } from '../API';
import { dynamodbPutRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBPutItemRequest {
  const { input } = ctx.arguments as CreateTemplateServiceMutationVariables;

  const createdAt = util.time.nowISO8601();
  const key = { templateId: input.templateId, serviceId: input.serviceId };
  const data = {
    ...input,
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
