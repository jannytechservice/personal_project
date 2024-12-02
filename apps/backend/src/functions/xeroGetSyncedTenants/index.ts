import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { initializeXeroClientWithTokenSet } from 'dependency-layer/xero';
import { validateIsEntityUser } from 'dependency-layer/entity';
import { getRecord, updateRecord } from 'dependency-layer/dynamoDB';
import { XeroClient } from 'xero-node';
const {
  AUTH_USERPOOLID,
  XERO_CLIENT_ID,
  XERO_CLIENT_SECRET,
  TABLE_XERO_TOKEN,
} = process.env;

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  console.log('sub: ', sub);

  // get xeroTokenSet
  let xeroTokenSet;
  try {
    const xeroToken = await getRecord(TABLE_XERO_TOKEN ?? '', { id: sub });
    xeroTokenSet = xeroToken.xeroTokenSet;
    console.log('Success getting tokenSet: ', xeroTokenSet);
  } catch (err: any) {
    console.error('Error getting tokenSet: ', err);
    throw new Error(err.message);
  }

  if (!xeroTokenSet) {
    console.log('No xero token set for user');
    return [];
  }

  //initialize xero client
  let xero: XeroClient;
  try {
    xero = await initializeXeroClientWithTokenSet(xeroTokenSet);
    console.log('Success initialize xero: ', xero);
  } catch (err: any) {
    console.error('ERROR initialize xero: ', err);
    throw new Error(err.message);
  }

  //read token set
  const newXeroTokenSet = xero.readTokenSet();
  //update token set if changed
  if (newXeroTokenSet?.expires_at !== xeroTokenSet.expires_at) {
    try {
      const updateTokenParams = { xeroTokenSet: newXeroTokenSet };
      const xeroToken = await updateRecord(
        TABLE_XERO_TOKEN ?? '',
        { id: sub },
        updateTokenParams
      );
      console.log('Success update xero token table: ', xeroToken);
    } catch (err: any) {
      console.error('ERROR update xero token table: ', err);
      throw new Error(err.message);
    }
  }

  if (newXeroTokenSet?.access_token && xero.tenants?.length > 0) {
    return xero.tenants;
  } else {
    console.log('User failed to connect to Xero');
    return [];
  }
};
