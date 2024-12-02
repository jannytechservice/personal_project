import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  BatchWriteCommand,
  BatchGetCommand,
  QueryCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import {
  getRecord,
  scanAllRecords,
  updateRecord,
  deleteRecord,
  batchPut,
  batchGet,
  queryRecords,
  createRecord,
} from '../../layers/dependencyLayer/opt/dynamoDB';
import { afterEach, describe, expect, it } from 'vitest';

const ddbMock = mockClient(DynamoDBDocumentClient);

afterEach(() => {
  ddbMock.reset();
});

describe('dynamoDB.ts', () => {
  it('createRecord creates a record successfully', async () => {
    ddbMock
      .on(PutCommand, {
        TableName: 'testTable',
        Item: { id: '1', name: 'test' },
      })
      .resolves({});

    const result = await createRecord('testTable', { id: '1', name: 'test' });
    expect(result).toEqual({ id: '1', name: 'test' });
  });

  it('getRecord retrieves a record successfully', async () => {
    ddbMock
      .on(GetCommand, {
        TableName: 'testTable',
        Key: { id: '1' },
      })
      .resolves({ Item: { id: '1', name: 'test' } });

    const result = await getRecord('testTable', { id: '1' });
    expect(result).toEqual({ id: '1', name: 'test' });
  });

  it('scanAllRecords retrieves all records successfully', async () => {
    ddbMock
      .on(ScanCommand, {
        TableName: 'testTable',
      })
      .resolves({
        Items: [
          { id: '1', name: 'test' },
          { id: '2', name: 'test2' },
        ],
      });

    const result = await scanAllRecords('testTable');
    expect(result).toEqual([
      { id: '1', name: 'test' },
      { id: '2', name: 'test2' },
    ]);
  });

  it('updateRecord updates a record successfully', async () => {
    ddbMock
      .on(UpdateCommand, {
        TableName: 'testTable',
        Key: { id: '1' },
        UpdateExpression: 'SET #name = :name',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { ':name': 'updatedTest' },
        ReturnValues: 'ALL_NEW',
      })
      .resolves({ Attributes: { id: '1', name: 'updatedTest' } });

    const result = await updateRecord(
      'testTable',
      { id: '1' },
      { name: 'updatedTest' }
    );
    expect(result).toEqual({ id: '1', name: 'updatedTest' });
  });

  it('deleteRecord deletes a record successfully', async () => {
    ddbMock
      .on(DeleteCommand, {
        TableName: 'testTable',
        Key: { id: '1' },
        ReturnValues: 'ALL_OLD',
      })
      .resolves({ Attributes: { id: '1', name: 'test' } });

    const result = await deleteRecord('testTable', { id: '1' });
    expect(result).toEqual({ id: '1', name: 'test' });
  });

  it('batchPut puts multiple items successfully', async () => {
    ddbMock
      .on(BatchWriteCommand, {
        RequestItems: {
          testTable: [
            { PutRequest: { Item: { id: '1', name: 'test' } } },
            { PutRequest: { Item: { id: '2', name: 'test2' } } },
          ],
        },
      })
      .resolves({});

    const result = await batchPut({
      tableName: 'testTable',
      items: [
        { id: '1', name: 'test' },
        { id: '2', name: 'test2' },
      ],
    });
    expect(result).toBeUndefined();
  });

  it('batchGet gets multiple items successfully', async () => {
    ddbMock
      .on(BatchGetCommand, {
        RequestItems: {
          testTable: { Keys: [{ id: '1' }, { id: '2' }] },
        },
      })
      .resolves({
        Responses: {
          testTable: [
            { id: '1', name: 'test' },
            { id: '2', name: 'test2' },
          ],
        },
      });

    const result = await batchGet({
      tableName: 'testTable',
      keys: [{ id: '1' }, { id: '2' }],
    });
    expect(result).toEqual([
      { id: '1', name: 'test' },
      { id: '2', name: 'test2' },
    ]);
  });

  it('queryRecords queries records successfully', async () => {
    ddbMock
      .on(QueryCommand, {
        TableName: 'testTable',
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: { '#id': 'id' },
        ExpressionAttributeValues: { ':id': '1' },
      })
      .resolves({
        Items: [
          { id: '1', name: 'test' },
          { id: '2', name: 'test2' },
        ],
      });

    const result = await queryRecords({
      tableName: 'testTable',
      keys: { id: '1' },
    });
    expect(result).toEqual([
      { id: '1', name: 'test' },
      { id: '2', name: 'test2' },
    ]);
  });

  it('queryRecords with NE filter queries records successfully', async () => {
    ddbMock
      .on(QueryCommand, {
        TableName: 'testTable',
        KeyConditionExpression: '#entityId = :entityId',
        FilterExpression: '#role <> :role',
        ExpressionAttributeNames: { '#entityId': 'entityId', '#role': 'role' },
        ExpressionAttributeValues: {
          ':entityId': 'task.toId',
          ':role': 'ACCOUNTANT',
        },
      })
      .resolves({
        Items: [{ entityId: 'task.toId', role: 'MANAGER' }],
        Count: 1,
        ScannedCount: 1,
        LastEvaluatedKey: undefined,
      });

    const result = await queryRecords({
      tableName: 'testTable',
      keys: { entityId: 'task.toId' },
      filter: { role: { ne: 'ACCOUNTANT' } },
    });
    expect(result).toEqual([{ entityId: 'task.toId', role: 'MANAGER' }]);
  });

  it('queryRecords with EQ filter queries records successfully', async () => {
    ddbMock
      .on(QueryCommand, {
        TableName: 'testTable',
        KeyConditionExpression: '#entityId = :entityId',
        FilterExpression: '#role = :role',
        ExpressionAttributeNames: { '#entityId': 'entityId', '#role': 'role' },
        ExpressionAttributeValues: {
          ':entityId': 'task.toId',
          ':role': 'ACCOUNTANT',
        },
      })
      .resolves({
        Items: [{ entityId: 'task.toId', role: 'ACCOUNTANT' }],
        Count: 1,
        ScannedCount: 1,
        LastEvaluatedKey: undefined,
      });

    const result = await queryRecords({
      tableName: 'testTable',
      keys: { entityId: 'task.toId' },
      filter: { role: { eq: 'ACCOUNTANT' } },
    });
    expect(result).toEqual([{ entityId: 'task.toId', role: 'ACCOUNTANT' }]);
  });

  it('queryRecords with LT filter queries records successfully', async () => {
    ddbMock
      .on(QueryCommand, {
        TableName: 'testTable',
        KeyConditionExpression: '#entityId = :entityId',
        FilterExpression: '#age < :age',
        ExpressionAttributeNames: { '#entityId': 'entityId', '#age': 'age' },
        ExpressionAttributeValues: { ':entityId': 'task.toId', ':age': 30 },
      })
      .resolves({
        Items: [{ entityId: 'task.toId', age: 25 }],
        Count: 1,
        ScannedCount: 1,
        LastEvaluatedKey: undefined,
      });

    const result = await queryRecords({
      tableName: 'testTable',
      keys: { entityId: 'task.toId' },
      filter: { age: { lt: 30 } },
    });
    expect(result).toEqual([{ entityId: 'task.toId', age: 25 }]);
  });

  it('queryRecords with LE filter queries records successfully', async () => {
    ddbMock
      .on(QueryCommand, {
        TableName: 'testTable',
        KeyConditionExpression: '#entityId = :entityId',
        FilterExpression: '#age <= :age',
        ExpressionAttributeNames: { '#entityId': 'entityId', '#age': 'age' },
        ExpressionAttributeValues: { ':entityId': 'task.toId', ':age': 30 },
      })
      .resolves({
        Items: [{ entityId: 'task.toId', age: 30 }],
        Count: 1,
        ScannedCount: 1,
        LastEvaluatedKey: undefined,
      });

    const result = await queryRecords({
      tableName: 'testTable',
      keys: { entityId: 'task.toId' },
      filter: { age: { le: 30 } },
    });
    expect(result).toEqual([{ entityId: 'task.toId', age: 30 }]);
  });

  it('queryRecords with GT filter queries records successfully', async () => {
    ddbMock
      .on(QueryCommand, {
        TableName: 'testTable',
        KeyConditionExpression: '#entityId = :entityId',
        FilterExpression: '#age > :age',
        ExpressionAttributeNames: { '#entityId': 'entityId', '#age': 'age' },
        ExpressionAttributeValues: { ':entityId': 'task.toId', ':age': 30 },
      })
      .resolves({
        Items: [{ entityId: 'task.toId', age: 35 }],
        Count: 1,
        ScannedCount: 1,
        LastEvaluatedKey: undefined,
      });

    const result = await queryRecords({
      tableName: 'testTable',
      keys: { entityId: 'task.toId' },
      filter: { age: { gt: 30 } },
    });
    expect(result).toEqual([{ entityId: 'task.toId', age: 35 }]);
  });

  it('queryRecords with GE filter queries records successfully', async () => {
    ddbMock
      .on(QueryCommand, {
        TableName: 'testTable',
        KeyConditionExpression: '#entityId = :entityId',
        FilterExpression: '#age >= :age',
        ExpressionAttributeNames: { '#entityId': 'entityId', '#age': 'age' },
        ExpressionAttributeValues: { ':entityId': 'task.toId', ':age': 30 },
      })
      .resolves({
        Items: [{ entityId: 'task.toId', age: 30 }],
        Count: 1,
        ScannedCount: 1,
        LastEvaluatedKey: undefined,
      });

    const result = await queryRecords({
      tableName: 'testTable',
      keys: { entityId: 'task.toId' },
      filter: { age: { ge: 30 } },
    });
    expect(result).toEqual([{ entityId: 'task.toId', age: 30 }]);
  });
});
