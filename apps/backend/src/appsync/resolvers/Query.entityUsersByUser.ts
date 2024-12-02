import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBQueryRequest,
  util,
} from '@aws-appsync/utils';
import { dynamodbQueryRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBQueryRequest {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { filter, nextToken, limit } = ctx.args;

  return dynamodbQueryRequest({
    key: 'userId',
    value: sub,
    filter,
    index: 'entityUsersByUser',
    limit,
    nextToken,
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
