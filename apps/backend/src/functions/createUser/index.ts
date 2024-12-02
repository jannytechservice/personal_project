import GleapAdmin from 'gleap-admin';
import { createRecord, queryRecords } from 'dependency-layer/dynamoDB';
import { USER_GROUPS, adminAddUserToGroup } from 'dependency-layer/cognito';
import { OnboardingStatus } from 'dependency-layer/API';

const { TABLE_USER, MIXPANEL_TOKEN, TABLE_REFERRAL, GLEAP_API_TOKEN } =
  process.env;

import * as mixpanelPackage from 'mixpanel';

const mixpanel = mixpanelPackage.init(MIXPANEL_TOKEN ?? '');

import * as util from 'util';
import { randomUUID } from 'crypto';
import { loyaltyPoints } from 'dependency-layer/user';

const trackAsync = util.promisify(mixpanel.track);

export type CreateUserEvent = {
  userPoolId: string; // userPoolId past to function to prevent circular dependency with Auth
  userAttributes: any;
  userName: string;
  onboardingStatus?: OnboardingStatus;
};

export const handler = async (event: CreateUserEvent) => {
  console.log('event received:', event);
  const { userPoolId, userAttributes, userName, onboardingStatus } = event; // https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html

  if (!userPoolId) {
    throw new Error('userPoolId not provided');
  }

  const createdAt = new Date().toISOString();
  let userParams: any = {
    id: userAttributes.sub,
    email: userAttributes.email || null,
    phone: userAttributes.phone_number || null,
    userType: userAttributes['custom:userType'] || null,
    identityId: userAttributes['custom:identityId'] || null,
    firstName: userAttributes.given_name || null,
    lastName: userAttributes.family_name || null,
    locale: userAttributes.locale || null,
    blocked: [],
    blockedBy: [],
    interests: [],
    onboardingStatus: onboardingStatus ?? OnboardingStatus.PROFILE,
    owner: userAttributes.sub,
    profileImg: null,
    reportReasons: [],
    notificationPreferences: {
      email: true,
      push: true,
      sms: true,
    },
    createdAt,
    updatedAt: createdAt,
    pointsTotal: 0,
    pointsBalance: 0,
    statusPoint: 0,
    nextLoyaltyStatusPoint: loyaltyPoints.BRONZE,
    loyaltyStatus: 'BRONZE',
  };

  try {
    // initialize gleap user
    GleapAdmin.initialize(GLEAP_API_TOKEN ?? '');
    const gleapUserParams = {
      name: '',
      email: userAttributes.email,
      value: 1,
      phone: userAttributes.phone_number,
    };
    const isSuccess = await GleapAdmin.identify(
      userAttributes.sub ?? '',
      gleapUserParams
    );
    console.log('Gleap identify success: ', isSuccess);
  } catch (err: any) {
    console.log('ERROR gleap identify', err);
    throw new Error(err.message);
  }

  if (userAttributes?.xeroUserId) {
    userParams = {
      ...userParams,
      xeroUserId: userAttributes.xeroUserId,
    };
  }

  if (userAttributes?.xeroDecodedIdToken) {
    userParams = {
      ...userParams,
      xeroDecodedIdToken: userAttributes.xeroDecodedIdToken,
    };
  }

  if (userAttributes?.xeroTokenSet) {
    userParams = {
      ...userParams,
      xeroTokenSet: userAttributes.xeroTokenSet,
    };
  }

  if (userAttributes?.xeroActiveTenant) {
    userParams = {
      ...userParams,
      xeroActiveTenant: userAttributes.xeroActiveTenant,
    };
  }

  if (userAttributes?.xeroSession) {
    userParams = {
      ...userParams,
      xeroSession: userAttributes.xeroSession,
    };
  }

  if (userAttributes['custom:referralCode']) {
    const referredBy = await queryRecords({
      tableName: TABLE_USER ?? '',
      keys: {
        referralCode: userAttributes['custom:referralCode'],
      },
      indexName: 'usersByReferralCode',
      limit: 1,
    });

    if (referredBy.length > 0) {
      userParams = {
        ...userParams,
        referredBy: referredBy[0].id,
      };
      await createRecord(TABLE_REFERRAL ?? '', {
        id: randomUUID(),
        userId: referredBy[0].id,
        referredId: userParams.id,
        firstName: userParams.firstName,
        lastName: userParams.lastName,
        taskPaidCount: 0,
        referredByCode: userAttributes['custom:referralCode'],
        referredCompleted: false,
        referredSignedStatus: true,
        createdAt: createdAt,
        updatedAt: createdAt,
      });
    }
  }

  try {
    console.log('create user props: ', userParams);
    await createRecord(TABLE_USER ?? '', userParams);
  } catch (err: any) {
    console.log('ERROR create user: ', err);
  }

  const addUserParams = {
    GroupName: USER_GROUPS.USERS,
    UserPoolId: userPoolId,
    Username: userName,
  };

  try {
    await adminAddUserToGroup(addUserParams);
  } catch (err: any) {
    console.log('error adding to group', err);
  }

  try {
    await mixpanel.people.set(userAttributes.sub, {
      $first_name: userAttributes.given_name || null,
      $last_name: userAttributes.family_name || null,
      $email: userAttributes.email,
      $phone: userAttributes.phone_number || null,
      $created: createdAt,
    });
  } catch (err: any) {
    console.log('ERROR mixpanel people set', err);
  }

  try {
    //@ts-ignore
    await trackAsync('Signup', {
      distinct_id: userAttributes.sub,
    });
  } catch (err: any) {
    console.log('ERROR mixpanel track Signup', err);
  }

  return userParams;
};
