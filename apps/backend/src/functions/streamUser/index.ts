const {
  TABLE_ENTITY,
  TABLE_USER,
  TABLE_ENTITY_USER,
  AUTH_USERPOOLID,
  GLEAP_API_TOKEN,
} = process.env;
import GleapAdmin from 'gleap-admin';
import {
  Entity,
  EntityType,
  EntityUser,
  EntityUserRole,
  User,
  VerificationStatus,
} from 'dependency-layer/API';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import {
  createRecord,
  updateRecord,
  queryRecords,
} from 'dependency-layer/dynamoDB';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { generateEntityEmail } from 'dependency-layer/entity';
import { generate5DigitNumber } from 'dependency-layer/code';
import { updateCustomAttributes } from 'dependency-layer/cognito';

export const handler: DynamoDBStreamHandler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  for (let i = 0; i < event.Records.length; i++) {
    const data = event.Records[i];

    // UPDATE RECORD TRIGGERED
    if (
      data.eventName === 'MODIFY' &&
      data?.dynamodb?.NewImage &&
      data?.dynamodb?.OldImage
    ) {
      const newUser = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      ) as User;
      const oldUser = unmarshall(
        data.dynamodb.OldImage as { [key: string]: AttributeValue }
      ) as User;
      console.log('newUser: ', newUser);
      console.log('oldUser: ', oldUser);

      if (
        !oldUser.firstName &&
        newUser.firstName &&
        !oldUser.lastName &&
        newUser.lastName
      ) {
        try {
          // update gleap user
          GleapAdmin.initialize(GLEAP_API_TOKEN ?? '');
          const gleapUserParams = {
            name: `${newUser.firstName} ${newUser.lastName}` ?? '',
            email: newUser.email ?? '',
            value: 1,
            phone: newUser.phone ?? '',
          };
          const isUpdateSuccess = await GleapAdmin.identify(
            newUser.id,
            gleapUserParams
          );
          console.log('Gleap user update success: ', isUpdateSuccess);
        } catch (err: any) {
          console.log('ERROR gleap update user: ', err);
          throw new Error(err.message);
        }
      }

      if (!oldUser.firmId && newUser.firmId) {
        // update custom attribute
        try {
          const cognitoParams = [
            {
              Name: 'custom:firmId',
              Value: newUser.firmId,
            },
          ];

          await updateCustomAttributes(
            AUTH_USERPOOLID ?? '',
            newUser.id,
            cognitoParams
          );
        } catch (err: any) {
          console.log('ERROR update custom attribute', err);
          throw new Error(err.message);
        }
      }
    }
  }
};
