import { Context, DynamoDBUpdateItemRequest, util } from '@aws-appsync/utils';
import { UpdateServiceMutationVariables } from '../API';
import { dynamodbUpdateRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBUpdateItemRequest {
  const {
    input: { id, ...input },
  } = ctx.args as UpdateServiceMutationVariables;
  const key = { id };
  const condition = {
    id: { attributeExists: true },
  };

  const data: any = {
    ...input,
    updatedAt: util.time.nowISO8601(),
  };

  if (input.description) {
    data.searchName = input.description.toLowerCase();
  }

  return dynamodbUpdateRequest({ key, data, condition });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return result;
}
