/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

const awsmobile = {
  aws_project_region: 'us-east-1',
  aws_appsync_graphqlEndpoint:
    'https://gym5vye3g5bbvh7l47mql7lbsm.appsync-api.us-east-1.amazonaws.com/graphql',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_cloud_logic_custom: [
    {
      name: 'AppRestAPI',
      endpoint: 'https://5b2zevx2sj.execute-api.us-east-1.amazonaws.com/new',
      region: 'us-east-1',
    },
  ],
  aws_cognito_identity_pool_id:
    'us-east-1:59d81b26-b604-4f14-ba0d-aa61dcf3c67f',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_aU2fDf2yk',
  aws_user_pools_web_client_id: '1vf89uve9ecqbu7ub2nftu81j5',
  oauth: {},
  aws_cognito_username_attributes: ['EMAIL', 'PHONE_NUMBER'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: [],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [
      'REQUIRES_LOWERCASE',
      'REQUIRES_UPPERCASE',
      'REQUIRES_NUMBERS',
      'REQUIRES_SYMBOLS',
    ],
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
  aws_user_files_s3_bucket: 'appstoragebucket100709-new',
  aws_user_files_s3_bucket_region: 'us-east-1',
};

export default awsmobile;