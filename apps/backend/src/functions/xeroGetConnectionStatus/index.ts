const {
  AUTH_USERPOOLID,
  TABLE_USER,
  TABLE_XERO_TOKEN,
  XERO_CLIENT_ID,
  XERO_CLIENT_SECRET,
} = process.env;
import { getRecord } from 'dependency-layer/dynamoDB';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { sub } = ctx.identity as AppSyncIdentityCognito;

  try {
    const xeroToken = await getRecord(TABLE_XERO_TOKEN ?? '', { id: sub });
    if (xeroToken && xeroToken.xeroTokenSet) {
      console.log('User connected to Xero');
      return {
        isConnected: true,
      };
    } else {
      console.log('User not connected to Xero');
      return {
        isConnected: false,
      };
    }
  } catch (err: any) {
    console.error('ERROR get xero token: ', err);
    throw new Error(err.message);
  }
};
