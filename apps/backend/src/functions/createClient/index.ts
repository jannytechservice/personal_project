const {
  AUTH_USERPOOLID,
  FUNCTION_CREATEUSER,
  TABLE_ENTITY_USER,
  TABLE_ENTITY,
  REGION,
} = process.env;
import {
  CreateClientInput,
  Entity,
  EntityClientsStatus,
  EntityUserRole,
  OnboardingStatus,
  VerificationStatus,
} from 'dependency-layer/API';
import { toTitleCase } from 'dependency-layer/code';
import {
  CognitoUserProps,
  createCognitoUser,
  getCognitoUser,
} from 'dependency-layer/cognito';
import { createRecord, getRecord } from 'dependency-layer/dynamoDB';
import { generateEntityEmail } from 'dependency-layer/entity';
import { validateEntityUser } from 'dependency-layer/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import {
  InvocationType,
  InvokeCommand,
  LambdaClient,
} from '@aws-sdk/client-lambda';
import { AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';

const lambda = new LambdaClient({ apiVersion: '2015-03-31', region: REGION });

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log('EVENT RECEIVED: ', JSON.stringify(ctx));
  const {
    sub,
    claims: {
      given_name: accountantFirstName,
      family_name: accountantFamilyName,
    },
  } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { client, entity, entityId } = input as CreateClientInput;
  const createdAt = new Date().toISOString();

  const firstName = toTitleCase(client.firstName);
  const lastName = toTitleCase(client.lastName);

  console.log('input: ', input);
  console.log('sub: ', sub);

  const [entityUser, accountantEntity] = await Promise.all([
    getRecord(TABLE_ENTITY_USER ?? '', { userId: sub, entityId }),
    getRecord(TABLE_ENTITY ?? '', { id: entityId }),
  ]);

  console.log('entityUser: ', entityUser);
  console.log('entity: ', entity);

  validateEntityUser(entityUser);

  if (accountantEntity?.clientsStatus !== EntityClientsStatus.ENABLED) {
    throw new Error('CLIENTS_NOT_ENABLED');
  }

  // check existing cognito user
  let cognitoUser;
  try {
    cognitoUser = await getCognitoUser(AUTH_USERPOOLID ?? '', client.email);
    console.log('Existing cognito user: ', cognitoUser);
  } catch (err: any) {
    if (err.code !== 'UserNotFoundException') {
      //TODO: not working? potentialy __type === UserNotFoundException
      console.log('err get cognito user: ', err);
      //throw new Error(err.message);
    }
  }

  // create cognito if not
  if (!cognitoUser) {
    const cognitoParams: CognitoUserProps = {
      firstName,
      lastName,
      email: client.email,
      phone: client.phone, //TODO: see what happens for new user when ?
    };

    const metadata = {
      entityName: entity?.name ?? '',
      invitedBy: `${accountantFirstName} ${accountantFamilyName}`,
    };

    try {
      const { User } = await createCognitoUser(
        AUTH_USERPOOLID ?? '',
        cognitoParams,
        metadata
      );
      cognitoUser = User;
      console.log('New cognito user: ', cognitoUser);
    } catch (err: any) {
      console.log('ERROR create cognito user: ', err);
      throw new Error(err.message);
    }

    const userAttributes = {
      sub: cognitoUser?.Username,
      email: client.email,
      given_name: firstName,
      family_name: lastName,
      phone_number: client.phone,
    };

    const params = {
      FunctionName: FUNCTION_CREATEUSER,
      InvocationType: InvocationType.RequestResponse, // | RequestResponse | DryRun - event = not wait for response
      Payload: Buffer.from(
        JSON.stringify({
          userPoolId: AUTH_USERPOOLID,
          userAttributes,
          userName: cognitoUser?.Username,
          onboardingStatus: OnboardingStatus.COMPLETED,
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

  if (!cognitoUser?.Username) {
    throw new Error('UNABLE_CREATION_CLIENT_USER');
  }

  const requests = [];

  if (entity && Object.entries(entity).length > 0) {
    const newEntityId = randomUUID();
    // create company entity
    const companyEntity: Entity = {
      id: newEntityId,
      type: entity.type,
      owner: sub,
      address: {
        ...(entity.address ? entity.address : {}),
        __typename: 'Address',
      },
      paymentMethodId: null,
      name: toTitleCase(entity.name),
      searchName: entity.name.toLowerCase() ?? '',
      contact: {
        firstName,
        lastName,
        email: client.email,
        phone: client.phone,
        __typename: 'EntityContact',
      },
      ubosCreated: null,
      verificationStatus: VerificationStatus.UNCHECKED,
      clientsStatus: EntityClientsStatus.DISABLED,
      createdAt,
      updatedAt: createdAt,
      createdBy: sub,
      ocrEmail: generateEntityEmail(input.name ?? ''),
      __typename: 'Entity',
    };

    if (entity.taxNumber) {
      companyEntity.taxNumber = entity.taxNumber;
    }

    requests.push(createRecord(TABLE_ENTITY ?? '', companyEntity));

    // create entity user
    // add accountant entity user

    // create accountant entity user for new entity
    const entityUserParams = {
      id: randomUUID(),
      entityId: newEntityId,
      userId: sub,
      firstName: accountantFirstName,
      lastName: accountantFamilyName,
      role: EntityUserRole.ACCOUNTANT,
      entitySearchName: companyEntity?.name.toLowerCase() ?? '',
      searchName:
        `${accountantFirstName} ${accountantFamilyName}`.toLowerCase() ?? '',
      verificationStatus: VerificationStatus.UNCHECKED,
      invitedEntityId: entityId,
      createdBy: sub,
      createdAt,
      updatedAt: createdAt,
    };

    requests.unshift(createRecord(TABLE_ENTITY_USER ?? '', entityUserParams));

    // new user - create as owner entity user
    const ownerEntityUserParams = {
      id: randomUUID(),
      entityId: newEntityId,
      userId: cognitoUser?.Username,
      firstName,
      lastName,
      role: EntityUserRole.OWNER,
      entitySearchName: companyEntity?.name.toLowerCase() ?? '',
      searchName: `${firstName} ${lastName}`.toLowerCase() ?? '',
      createdBy: sub,
      createdAt,
      updatedAt: createdAt,
    };

    requests.push(createRecord(TABLE_ENTITY_USER ?? '', ownerEntityUserParams));
  }

  try {
    const response = await Promise.all(requests);
    console.log('RESPONSE: ', response);
    return response[0];
  } catch (err: any) {
    console.log('ERROR create entity user: ', err);
    throw new Error(err.message);
  }
};
