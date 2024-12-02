import { validateIsEntityUser } from 'dependency-layer/entity';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import {
  updateRecord,
  createRecord,
  getRecord,
} from 'dependency-layer/dynamoDB';
import { XeroSyncStatus } from 'dependency-layer/API';
import {
  getScopes,
  initXeroClient,
  getRedirectUri,
  initializeXeroClientWithTokenSet,
} from 'dependency-layer/xero';
import { XeroClient } from 'xero-node';
const {
  AUTH_USERPOOLID,
  XERO_CLIENT_ID,
  XERO_CLIENT_SECRET,
  TABLE_XERO_TOKEN,
  XERO_REDIRECT_URI,
} = process.env;

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log(`EVENT: ${JSON.stringify(ctx)}`);
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { url, xeroEnv } = ctx.arguments.input;

  let xero: XeroClient;
  let tokenSet;
  const scopes = getScopes('ACCOUNTING');
  const redirectUri = xeroEnv ? getRedirectUri(xeroEnv) : XERO_REDIRECT_URI;

  try {
    xero = initXeroClient({
      scopes: scopes.split(' '),
      grantType: 'authorization_code',
      redirectUris: [redirectUri ?? ''],
    });
    console.log('Success init xero: ', xero);
  } catch (err: any) {
    console.error('ERROR init xero: ', err);
    throw new Error(err.message);
  }

  try {
    xero = await xero.initialize();
    console.log('Success initialize xero: ', xero);
  } catch (err: any) {
    console.error('ERROR initialize xero: ', err);
    throw new Error(err.message);
  }

  try {
    tokenSet = await xero.apiCallback(url);
    console.log('tokenSet: ', tokenSet);
  } catch (err: any) {
    console.error('ERROR get token set: ', err);
    throw new Error(err.message);
  }

  try {
    await xero.updateTenants(false);
    console.log('xero tenants: ', xero.tenants);
  } catch (err: any) {
    console.error('ERROR update tenants: ', err);
    throw new Error(err.message);
  }

  if (tokenSet?.access_token && xero.tenants?.length > 0) {
    console.log('User connected to Xero successfully');

    let existingXeroToken;
    try {
      existingXeroToken = await getRecord(TABLE_XERO_TOKEN ?? '', {
        id: sub,
      });
      console.log('Success getting existing token: ', existingXeroToken);
    } catch (err: any) {
      console.error('ERROR getting existing token: ', err);
      throw new Error(err.message);
    }

    if (existingXeroToken) {
      try {
        const updateXeroTokenParams = { xeroTokenSet: tokenSet };
        const xeroToken = await updateRecord(
          TABLE_XERO_TOKEN ?? '',
          { id: sub },
          updateXeroTokenParams
        );
        console.log('Success update Xero tokenset : ', xeroToken);
      } catch (err: any) {
        console.error('ERROR update tokenSet: ', err);
        throw new Error(err.message);
      }
    } else {
      try {
        const createXeroTokenParams = { id: sub, xeroTokenSet: tokenSet };
        const xeroToken = await createRecord(
          TABLE_XERO_TOKEN ?? '',
          createXeroTokenParams
        );
        console.log('Success saved Xero tokenset : ', xeroToken);
      } catch (err: any) {
        console.error('ERROR save tokenSet: ', err);
        throw new Error(err.message);
      }
    }
  } else {
    console.log('User failed to connect to Xero');
    return false;
  }

  return true;
};
