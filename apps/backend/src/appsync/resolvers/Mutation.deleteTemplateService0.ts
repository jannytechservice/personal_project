import { Context, util, DynamoDBGetItemRequest } from '@aws-appsync/utils';
import { DeleteTemplateServiceMutationVariables } from '../API';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBGetItemRequest {
  const {
    input: { templateId },
  } = ctx.args as DeleteTemplateServiceMutationVariables;
  return dynamoDBGetItemRequest({ id: templateId });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return result;
}
