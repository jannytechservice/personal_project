//import { Auth } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { vi } from 'vitest';

beforeAll(async () => {
  Amplify.configure({
    API: {
      GraphQL: {
        endpoint:
          'https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
        region: 'us-east-1',
        // Set the default auth mode to "userPool"
        defaultAuthMode: 'userPool',
      },
    },
    REST: {
      AppRestAPI: {
        endpoint: 'https://5b2zevx2sj.execute-api.us-east-1.amazonaws.com/new',
        region: 'us-east-1',
      },
    },
    Auth: {
      Cognito: {
        identityPoolId: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        userPoolId: 'us-east-1_xxxxxxxxx',
        userPoolClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
        mfa: {
          status: 'optional',
          totpEnabled: true,
        },
        passwordFormat: {
          minLength: 8,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialCharacters: true,
        },
      },
    },
    Geo: {
      LocationService: {
        region: 'us-east-1',
        searchIndices: {
          items: ['xxxxxx-xxxxx-xxx'],
          default: 'xxxxxx-xxxxx-xxx',
        },
      },
    },
    Storage: {
      S3: {
        bucket: 'xxxxxx-xxxxx-xxx',
        region: 'us-east-1',
      },
    },
    //aws_appsync_region: 'us-east-1',
    //aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    //aws_cloud_logic_custom: [
    //  {
    //    name: 'AppRestAPI',
    //    endpoint: 'https://5b2zevx2sj.execute-api.us-east-1.amazonaws.com/new',
    //    region: 'us-east-1',
    //  },
    //],
    //aws_cognito_identity_pool_id:
    //  'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    //aws_cognito_region: 'us-east-1',
    //aws_user_pools_id: 'us-east-1_xxxxxxxxx',
    //aws_user_pools_web_client_id: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    //oauth: {},
    //aws_cognito_username_attributes: ['EMAIL', 'PHONE_NUMBER'],
    //aws_cognito_social_providers: [],
    //aws_cognito_signup_attributes: [],
    //aws_cognito_mfa_configuration: 'OPTIONAL',
    //aws_cognito_mfa_types: ['SMS', 'OTP'],
    //aws_cognito_password_protection_settings: {
    //  passwordPolicyMinLength: 8,
    //  passwordPolicyCharacters: [
    //    'REQUIRES_LOWERCASE',
    //    'REQUIRES_UPPERCASE',
    //    'REQUIRES_NUMBERS',
    //    'REQUIRES_SYMBOLS',
    //  ],
    //},
    //aws_cognito_verification_mechanisms: ['EMAIL'],
    //aws_user_files_s3_bucket: 'xxxxxx-xxxxx-xxx',
    //aws_user_files_s3_bucket_region: 'us-east-1',
  });
});

//vi.spyOn(Auth, 'currentAuthenticatedUser').mockImplementation(async () => ({
//  attributes: {
//    sub: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
//  },
//}));

vi.mock('aws-amplify/auth', () => ({
  fetchAuthSession: vi.fn(),
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));