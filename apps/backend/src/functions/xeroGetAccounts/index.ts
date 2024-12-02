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
  XERO_REDIRECT_URI,
} = process.env;

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { entityId } = ctx.arguments.input;
  console.log('sub: ', sub);
  console.log('entityId: ', entityId);

  // get entity user
  try {
    const entityUser = await validateIsEntityUser({ entityId, userId: sub });
    console.log('Success validate entity user: ', entityUser);
  } catch (err: any) {
    console.error('ERROR validate entity user: ', err);
    throw new Error(err.message);
  }

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
    // GET all Accounts
    try {
      const res = await xero.accountingApi.getAccounts(
        xero.tenants[0].tenantId
      );
      const accounts = res.body.accounts;
      console.log('Success get all xero accounts: ', accounts);
      return accounts;
    } catch (err: any) {
      console.log('ERROR getAccounts: ', err);
      throw new Error(err.message);
    }
  } else {
    console.log('User failed to connect to Xero');
    return [];
  }
};
