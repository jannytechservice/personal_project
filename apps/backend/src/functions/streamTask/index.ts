import { Task } from 'dependency-layer/API';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { handleTaskModify } from './handleTaskModify';
import { handleTaskInsert } from './handleTaskInsert';

export const handler: DynamoDBStreamHandler = async (event) => {
  console.log('EVENT RECEIVED: ', JSON.stringify(event, null, 2));
  for (const data of event.Records) {
    if (data.eventName === 'INSERT' && data?.dynamodb?.NewImage) {
      const task = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      ) as Task;
      console.log('INSERT task: ', JSON.stringify(task));
      await handleTaskInsert(task);
    }

    if (
      data.eventName === 'MODIFY' &&
      data?.dynamodb?.NewImage &&
      data?.dynamodb?.OldImage
    ) {
      const newTask = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      ) as Task;
      const oldTask = unmarshall(
        data.dynamodb.OldImage as { [key: string]: AttributeValue }
      ) as Task;
      console.log('MODIFY newTask: ', JSON.stringify(newTask));
      console.log('MODIFY oldTask: ', JSON.stringify(oldTask));
      await handleTaskModify(newTask, oldTask);
    }
  }
};
