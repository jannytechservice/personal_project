import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '..', '.env') });

import { setEnvVar } from './setEnvVar';

const {
  ENV,
  FRANKIEONE_API_KEY,
  FRANKIEONE_API_DOMAIN,
  FRANKIEONE_CUSTOMER_ID,
  FRANKIEONE_SMARTUI_DOMAIN,
  APPLE_BUNDLE_ID,
  GOOGLE_BUNDLE_ID,
  //GOOGLE_PLACES_API_KEY,
  MIXPANEL_TOKEN,
  GLEAP_API_TOKEN,
  APPLE_CONNECT_KEY,
  APPLE_CONNECT_KEY_ID,
  APPLE_CONNECT_ISSUER_ID,
  AWS_ACCOUNT,
  XERO_CLIENT_ID,
  XERO_CLIENT_SECRET,
  XERO_WEBHOOK_KEY,
  ABR_GUID,
  ZAI_DOMAIN,
  ZAI_TOKEN_DOMAIN,
  ZAI_WEBHOOK_DOMAIN,
  ZAI_CLIENT_ID,
  ZAI_CLIENT_SCOPE,
} = process.env;

const appPrefix = setEnvVar('ADM');
const env = setEnvVar(ENV);
const isProd = env === 'prod';
const account = setEnvVar(AWS_ACCOUNT);
const apiId = `${appPrefix}${env}ApiId`;
const apiName = `${appPrefix}${env}GraphqlAPI`;
const appName = setEnvVar('Admiin');
const domain = setEnvVar('admiin.com');
const companyName = setEnvVar('Admiin');
const createUserFuncName = `${appPrefix}${env}AuthStack-createUserFunc`;
const frankieOneApiKey = setEnvVar(FRANKIEONE_API_KEY);
const frankieOneApiDomain = setEnvVar(FRANKIEONE_API_DOMAIN);
const frankieOneCustomerId = setEnvVar(FRANKIEONE_CUSTOMER_ID);
const frankieOneSmartUiDomain = setEnvVar(FRANKIEONE_SMARTUI_DOMAIN);
const fromEmail = setEnvVar('hello@admiin.com');
const replyToEmail = setEnvVar('hello@admiin.com');
const appleBundleId = setEnvVar(APPLE_BUNDLE_ID);
const googleBundleId = setEnvVar(GOOGLE_BUNDLE_ID);
const gleapApiToken = setEnvVar(GLEAP_API_TOKEN);
const hostedZoneId = setEnvVar('Z04416773PYDOIMA6UQ73');
const mixpanelToken = setEnvVar(MIXPANEL_TOKEN);
const appleConnectKey = setEnvVar(APPLE_CONNECT_KEY);
const appleConnectKeyId = setEnvVar(APPLE_CONNECT_KEY_ID);
const appleConnectIssuerId = setEnvVar(APPLE_CONNECT_ISSUER_ID);
const region = setEnvVar('us-east-1');
const transactionalEmailDomain = setEnvVar('admiin.com');
const xeroClientId = setEnvVar(XERO_CLIENT_ID);
const xeroClientSecret = setEnvVar(XERO_CLIENT_SECRET);
const xeroWebhookKey = setEnvVar(XERO_WEBHOOK_KEY);
const xeroRedirectUri = isProd
  ? `https://app.${domain}/xero-redirect`
  : `https://app-${env}.${domain}/xero-redirect`;
const abrGuid = setEnvVar(ABR_GUID);
const restApiName = `${appPrefix}${env}RESTAPI`;
const apiDomainName = isProd ? `api.${domain}` : `api-${env}.${domain}`;
const webDomainName = isProd ? `app.${domain}` : `app-${env}.${domain}`;
const ocrEmailDomain = isProd ? `docs.${domain}` : `docs-${env}.${domain}`;
const backofficeDomainName = isProd
  ? `backoffice.${domain}`
  : `backoffice-${env}.${domain}`;
const restApiDomainName = isProd
  ? `restapi.${domain}`
  : `restapi-${env}.${domain}`;
const zaiDomain = setEnvVar(ZAI_DOMAIN);
const zaiTokenDomain = setEnvVar(ZAI_TOKEN_DOMAIN);
const zaiWebhookDomain = setEnvVar(ZAI_WEBHOOK_DOMAIN);
const zaiClientId = setEnvVar(ZAI_CLIENT_ID);
const zaiClientScope = setEnvVar(ZAI_CLIENT_SCOPE);
const zaiEnv = isProd ? 'prod' : 'dev';
const frankieOneEnv = isProd ? 'prod' : 'dev';
const debugEmailAddress = 'dylan.app.test@gmail.com';

const mediaUrl = `https://${appPrefix.toLowerCase()}${
  env === 'prod' ? '' : env
}email-media.s3.amazonaws.com`;

let userPoolId = '';
let identityPoolId = '';
//TODO: move to SSM?
if (env === 'dev') {
  userPoolId = 'us-east-1_jRywt62gN';
  identityPoolId = 'us-east-1:e436bb35-c1cc-4863-b818-e398ec1492f2';
} else if (env === 'prod') {
  userPoolId = 'us-east-1_MBFRZdcw9';
  identityPoolId = 'us-east-1:7c4eb789-3dab-4968-bc4f-81ace3e8fcf8';
} else if (env === 'devtwo') {
  userPoolId = 'us-east-1_J3aS9ga1o';
  identityPoolId = 'us-east-1:0f0abcfd-26a2-475d-a955-52d1a2f79df0';
} else {
  userPoolId = 'us-east-1_xxxxxxxxx';
  identityPoolId = 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
}

const frankieOneWhiteListIps_demo = [
  '52.62.31.108',
  '149.167.70.106',
  '123.103.207.82',
];

const frankieOneHiwteListIps_prod = [
  '13.236.159.198',
  '13.237.83.115',
  '16.50.141.56',
];

const zaiWhiteListIps_PreLive = [
  '54.183.18.207',
  '54.183.142.227',
  '13.237.240.238',
  '54.66.162.247',
  '52.63.199.160',
];

const zaiWhiteListIps_Prod = [
  '54.183.18.207',
  '54.183.142.227',
  '3.24.122.159',
  '54.79.20.55',
  '52.62.134.160',
];

const ZaiWebhookIPs = isProd ? zaiWhiteListIps_Prod : zaiWhiteListIps_PreLive;

const frankieOneWhiteListIps = isProd
  ? frankieOneHiwteListIps_prod
  : frankieOneWhiteListIps_demo;

export {
  abrGuid,
  account,
  apiId,
  apiName,
  apiDomainName,
  appleBundleId,
  appleConnectKey,
  appleConnectKeyId,
  appleConnectIssuerId,
  appName,
  appPrefix,
  backofficeDomainName,
  companyName,
  createUserFuncName,
  debugEmailAddress,
  domain,
  env,
  frankieOneEnv,
  frankieOneApiKey,
  frankieOneApiDomain,
  frankieOneSmartUiDomain,
  frankieOneCustomerId,
  frankieOneWhiteListIps,
  fromEmail,
  googleBundleId,
  hostedZoneId,
  identityPoolId,
  isProd,
  replyToEmail,
  mediaUrl,
  mixpanelToken,
  gleapApiToken,
  ocrEmailDomain,
  restApiName,
  restApiDomainName,
  region,
  transactionalEmailDomain,
  userPoolId,
  webDomainName,
  xeroClientId,
  xeroClientSecret,
  xeroWebhookKey,
  xeroRedirectUri,
  zaiDomain,
  zaiEnv,
  zaiTokenDomain,
  zaiWebhookDomain,
  zaiClientId,
  zaiClientScope,
  ZaiWebhookIPs,
};
