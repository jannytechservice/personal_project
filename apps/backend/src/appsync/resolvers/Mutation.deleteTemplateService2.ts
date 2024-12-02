import { Context, util, DynamoDBDeleteItemRequest } from '@aws-appsync/utils';
import { DeleteTemplateServiceMutationVariables } from '../API';
import { dynamodbDeleteRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBDeleteItemRequest {
  const {
    input: { templateId, serviceId },
  } = ctx.args as DeleteTemplateServiceMutationVariables;

  const key = {
    templateId,
    serviceId,
  };

  // TODO: improve condition
  const condition = {
    templateId: { eq: templateId },
    serviceId: { eq: serviceId },
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
