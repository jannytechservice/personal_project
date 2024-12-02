import { Context, DynamoDBQueryRequest, util } from '@aws-appsync/utils';

export function request(ctx: Context): DynamoDBQueryRequest {
  const { entityId, status, nextToken } = ctx.args;

  return {
    operation: 'Query',
    index: 'documentAnalysisByEntityStatus',
    query: {
      expression: 'entityId = :entityId and #status = :status',
      expressionNames: {
        '#status': 'status',
        '#entityId': 'entityId',
      },
      expressionValues: {
        ':entityId': util.dynamodb.toDynamoDB(entityId),
        ':status': util.dynamodb.toDynamoDB(status),
      },
    },
    nextToken,
    scanIndexForward: true, // Adjust for sort direction if needed
    select: 'ALL_ATTRIBUTES',
  };
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  const { items = [], nextToken } = result;
  return { items, nextToken };
}
