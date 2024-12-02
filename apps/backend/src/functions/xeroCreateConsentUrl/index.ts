const { XERO_CLIENT_ID, XERO_CLIENT_SECRET, TABLE_USER, XERO_REDIRECT_URI } =
  process.env;
import {
  getScopes,
  initXeroClient,
  getRedirectUri,
} from 'dependency-layer/xero';
import { AppSyncResolverHandler } from 'aws-lambda';

let xero;
export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { input } = ctx.arguments;
  console.log('input: ', input);
  const { scopeSet, xeroEnv } = input;
  const scopes = getScopes(scopeSet);
  const redirectUri = xeroEnv ? getRedirectUri(xeroEnv) : XERO_REDIRECT_URI;

  try {
    xero = initXeroClient({
      scopes: scopes.split(' '),
      redirectUris: [redirectUri ?? ''],
    });
  } catch (err: any) {
    console.log('ERROR init xero: ', err);
    throw new Error(err.message);
  }

  try {
    await xero.initialize();
  } catch (err: any) {
    console.log('ERROR initialize xero: ', err);
    throw new Error(err.message);
  }

  try {
    const url = await xero.buildConsentUrl();
    console.log('url: ', url);
    return url;
  } catch (err: any) {
    console.log('ERROR create xero consent url: ', err);
    throw new Error(err.message);
  }
};
