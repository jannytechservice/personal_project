import { Context, DynamoDBQueryRequest, util } from '@aws-appsync/utils';
import { dynamodbQueryRequest } from '../helpers/dynamodb';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
export function request(ctx: Context): DynamoDBQueryRequest {
  const {
    args: { limit, nextToken, sortDirection, filter },
  } = ctx;
  const { sub } = ctx.identity as AppSyncIdentityCognito;

  return dynamodbQueryRequest({
    key: 'compositeId',
    value: `${sub}#REWARD`,
    filter,
    limit,
    nextToken,
    sortDirection,
  });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  const { items = [], nextToken } = result;
  return { items, nextToken };
}
