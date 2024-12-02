const { TABLE_USER, FROM_EMAIL, WEB_DOMAIN } = process.env;

import { getRecord } from 'dependency-layer/dynamoDB';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { sendEmail } from 'dependency-layer/pinpoint';

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { email } = ctx.arguments.input;

  let user;
  try {
    user = await getRecord(TABLE_USER ?? '', {
      id: sub,
    });
  } catch (err: any) {
    console.log('ERROR get user: ', err);
    throw new Error(err.message);
  }

  console.log('email: ', email);

  //email template
  const templateData = {
    name: `${user.firstName} ${user.lastName}`,
    url: `${WEB_DOMAIN}/sign-up?referralCode=${user.referralCode}`,
    template: {
      title: `You have been referred to Admiin`,
      preheader: `You have been referred to Admiin`,
    },
  };

  const emailParams = {
    senderAddress: FROM_EMAIL ?? '',
    toAddresses: email,
    templateName: 'referral-invitation',
    templateData,
  };

  try {
    await sendEmail(emailParams);
  } catch (err: any) {
    console.log('ERROR send email: ', err);
    throw new Error(err.message);
  }

  return true;
};
