const {
  AUTH_USERPOOLID,
  TABLE_ENTITY,
  TABLE_ENTITY_USER,
  FUNCTION_CREATEUSER,
} = process.env;
import { EntityUser, EntityUserRole } from 'dependency-layer/API';
import { toTitleCase } from 'dependency-layer/code';
import { createRecord, getRecord } from 'dependency-layer/dynamoDB';
import { validateEntityUser } from 'dependency-layer/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';
const lambda = new LambdaClient({ apiVersion: '2015-03-31' });
import { createCognitoUser, getCognitoUser } from 'dependency-layer/cognito';

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { entityId, firstName, lastName, email, role } = ctx.arguments.input;

  if (role === EntityUserRole.ACCOUNTANT) {
    // check if user exists via email and is an accountant
  }

  // get team
  let entityUser;
  try {
    entityUser = await getRecord(TABLE_ENTITY_USER ?? '', {
      entityId,
      userId: sub,
    });
  } catch (err: any) {
    console.log('ERROR get entity user: ', err);
    throw new Error(err.message);
  }

  //TODO: add roles that can create entity users
  validateEntityUser(entityUser);

  let entity;
  try {
    entity = await getRecord(TABLE_ENTITY ?? '', { id: entityId });
  } catch (err: any) {
    console.log('ERROR get entity: ', err);
    throw new Error(err.message);
  }

  // check existing cognito user
  let cognitoUser;
  try {
    cognitoUser = await getCognitoUser(AUTH_USERPOOLID ?? '', email);
    console.log('Existing cognito user: ', cognitoUser);
  } catch (err: any) {
    if (err?.message?.includes('UserNotFoundException')) {
      console.log('cognito user doesnt exist');
    } else {
      console.log('ERROR get cognito user: ', err);
    }
  }

  // create cognito if not
  if (!cognitoUser) {
    const cognitoParams = {
      firstName,
      lastName,
      email,
    };

    try {
      const { User } = await createCognitoUser(
        AUTH_USERPOOLID ?? '',
        cognitoParams
      );
      cognitoUser = User;
      console.log('New cognito user: ', cognitoUser);
    } catch (err: any) {
      console.log('ERROR create cognito user: ', err);
      throw new Error(err.message);
    }

    const userAttributes = {
      sub: cognitoUser?.Username,
      email,
      given_name: firstName,
      family_name: lastName,
    };

    const params = {
      FunctionName: FUNCTION_CREATEUSER,
      InvocationType: InvocationType.RequestResponse, // | RequestResponse | DryRun - event = not wait for response
      Payload: Buffer.from(
        JSON.stringify({
          userPoolId: AUTH_USERPOOLID,
          userAttributes,
          userName: cognitoUser?.Username,
        })
      ),
    };

    try {
      const command = new InvokeCommand(params);
      await lambda.send(command);
    } catch (err: any) {
      console.log('ERROR invoke create user function: ', err);
      throw new Error(err.message);
    }
  }

  // create entity user
  const createdAt = new Date().toISOString();
  const entityUserParams: EntityUser = {
    id: randomUUID(),
    entityId,
    userId: cognitoUser?.Username ?? '',
    firstName: toTitleCase(firstName),
    lastName: toTitleCase(lastName),
    role,
    entitySearchName: entity?.name.toLowerCase() ?? '',
    searchName: `${firstName} ${lastName}`.toLowerCase() ?? '',
    createdBy: sub,
    createdAt,
    updatedAt: createdAt,
    __typename: 'EntityUser',
  };

  try {
    await createRecord(TABLE_ENTITY_USER ?? '', entityUserParams);
  } catch (err: any) {
    console.log('ERROR create entity user: ', err);
    throw new Error(err.message);
  }

  return entityUserParams;
};
