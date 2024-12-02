import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { beforeAll } from 'vitest';

beforeAll(async () => {
  Amplify.configure(
    {
      Analytics: {
        Pinpoint: {
          appId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          region: 'us-east-1',
        },
      },
      API: {
        GraphQL: {
          endpoint:
            'https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
          region: 'us-east-1',
          // Set the default auth mode to "userPool"
          defaultAuthMode: 'userPool',
        },
        REST: {
          'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/new': {
            endpoint: 'backendExports.restApiGatewayEndpoint', //cdkOutput?.ADMAppSyncAPIStack?.RestApiGatewayEndpointF48811B0,
            region: 'us-east-1', //cdkOutput?.ADMAppSyncAPIStack?.Region,
          },
        },
      },
      Auth: {
        Cognito: {
          identityPoolId: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // REQUIRED - Amazon Cognito Identity Pool ID
          // region: backendExports.region, // REQUIRED - Amazon Cognito Region
          userPoolId: 'us-east-1_xxxxxxxxx', // OPTIONAL - Amazon Cognito User Pool ID
          userPoolClientId: 'us-east-1_xxxxxxxxx', // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
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
          region: 'us-east-1', // Region where your Place Index is created
          searchIndices: {
            items: ['xxxxxxxxxEsriPlaceIndexName'], // Replace with your Place Index name
            default: 'xxxxxxxxxEsriPlaceIndexName', // Set the default Place Index
          },
        },
      },
      Storage: {
        S3: {
          bucket: 'xxxxxx-xxxxx-xxx',
          region: 'us-east-1',
        },
      },
    },
    {
      API: {
        REST: {
          headers: async () => {
            return {
              Authorization: `${(
                await fetchAuthSession()
              ).tokens?.idToken?.toString()}`,
            };
          },
        },
      },
    }
  );
});
