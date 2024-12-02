const {
  AUTH_USERPOOLID,
  TABLE_ENTITY,
  TABLE_ENTITY_USER,
  FUNCTION_CREATEUSER,
  FROM_EMAIL,
  WEB_DOMAIN,
} = process.env;
import {
  EntityUser,
  EntityUserRole,
  EntityUserStatus,
  OnboardingStatus,
} from 'dependency-layer/API';
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
import { sendEmail } from 'dependency-layer/pinpoint';

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { sub, claims } = ctx.identity as AppSyncIdentityCognito;
  const { entityId, firstName, lastName, email, role, ...other } =
    ctx.arguments.input;

  // get entity user to check it the sub is already a user of the entity
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

  validateEntityUser(entityUser);

  // // get invitee data
  // let invitee;
  // try {
  //   invitee = await getRecord(TABLE_USER ?? '', { id: sub });
  //   console.log('invitee: ', invitee);
  // } catch (err: any) {
  //   console.log('ERROR get invitee: ', err);
  //   throw new Error(err.message);
  // }

  // get entity
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

  const createdAt = new Date().toISOString();

  if (!cognitoUser) {
    const cognitoParams = {
      firstName,
      lastName,
      email,
    };

    const metadata = {
      entityName: entity?.name ?? '',
      invitedBy: `${claims['given_name']} ${claims['family_name']}`,
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

    const entityUserParams: EntityUser = {
      ...other,
      id: randomUUID(),
      entityId,
      userId: cognitoUser?.Username ?? '',
      invitedEmail: email,
      firstName: toTitleCase(firstName),
      lastName: toTitleCase(lastName),
      role,
      entitySearchName: entity?.name.toLowerCase() ?? '',
      searchName: `${firstName} ${lastName}`.toLowerCase() ?? '',
      createdBy: sub,
      createdAt,
      updatedAt: createdAt,
      status: EntityUserStatus.PENDING,
      __typename: 'EntityUser',
    };

    try {
      await createRecord(TABLE_ENTITY_USER ?? '', entityUserParams);
    } catch (err: any) {
      console.log('ERROR create entityUser: ', err);
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
      InvocationType: InvocationType.RequestResponse,
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

    return entityUserParams;
  } else {
    // create entity user
    const entityUserParams: EntityUser = {
      id: randomUUID(),
      entityId,
      userId: cognitoUser.Username ?? '',
      invitedEmail: email,
      firstName: toTitleCase(firstName),
      lastName: toTitleCase(lastName),
      role,
      entitySearchName: entity?.name.toLowerCase() ?? '',
      searchName: `${firstName} ${lastName}`.toLowerCase() ?? '',
      createdBy: sub,
      createdAt,
      updatedAt: createdAt,
      status: EntityUserStatus.PENDING,
      __typename: 'EntityUser',
    };

    console.log('entityUserParams', entityUserParams);

    //email template
    const templateData = {
      entityName: entity?.name ?? '',
      url: `${WEB_DOMAIN}/sign-in`,
      template: {
        title: `${claims['given_name']} ${claims['family_name']} has invited you to manage ${entity.name} with Admiin`,
        preheader: `${claims['given_name']} ${claims['family_name']} has invited you to manage ${entity.name} with Admiin`,
      },
    };
    const emailParams = {
      //senderAddress: `<${claims['given_name']} ${claims['family_name']} via Admiin> ${FROM_EMAIL}` ?? '',
      senderAddress: FROM_EMAIL ?? '',
      toAddresses: [email],
      templateName: 'entity-invitation',
      templateData,
    };

    const cognitoUserFirmId = cognitoUser.UserAttributes?.find(
      (attr) => attr.Name === 'custom:firmId'
    )?.Value;

    if (role === EntityUserRole.ACCOUNTANT && cognitoUserFirmId) {
      throw new Error('User already registered to another firm');
    } else {
      try {
        await createRecord(TABLE_ENTITY_USER ?? '', entityUserParams);
      } catch (err: any) {
        console.log('ERROR create entity user: ', err);
        throw new Error(err.message);
      }
    }

    try {
      await sendEmail(emailParams);
    } catch (err: any) {
      console.log('ERROR send email: ', err);
      throw new Error(err.message);
    }

    return entityUserParams;
  }
};
