import { Amplify } from 'aws-amplify';
import { configureAppSyncClient } from '../../helpers/appsync';
import React, { useCallback, useEffect, useState } from 'react';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { fetchAuthSession } from 'aws-amplify/auth';

export interface ApolloClientProviderProps {
  children: React.ReactNode;
}

export interface BackendExports {
  identityPoolId: string;
  userPoolId: string;
  userPoolClientId: string;
  graphQLAPIURL: string;
  graphQLAPIKey: string;
  mediaBucketName: string;
  region: string;
  restApiName: string;
  restApiGatewayEndpoint: string;
  placeIndexName: string;
  pinpointAppId: string;
  verificationUrl: string;
}

interface ClientContextType {
  clientType: ClientType;
  setClientType: (clientType: ClientType) => void;
  refreshClient: () => void;
  output: BackendExports;
}

const ClientContext = React.createContext<ClientContextType | undefined>(
  undefined
);

interface configureAppSyncClientProps {
  graphQLAPIURL: string;
  graphQLAPIKey?: string;
}

const userPoolClient = ({ graphQLAPIURL }: configureAppSyncClientProps) =>
  configureAppSyncClient({
    authType: 'AMAZON_COGNITO_USER_POOLS',
    graphQLAPIURL,
  });
const iamClient = ({ graphQLAPIURL }: configureAppSyncClientProps) =>
  configureAppSyncClient({
    authType: 'IAM',
    graphQLAPIURL,
  });
const apiKeyClient = ({
  graphQLAPIURL,
  graphQLAPIKey,
}: configureAppSyncClientProps) =>
  configureAppSyncClient({
    authType: 'API_KEY',
    graphQLAPIURL,
    graphQLAPIKey,
  });
type ClientType = 'userPool' | 'iam' | 'api';

export function ApolloClientProvider({ children }: ApolloClientProviderProps) {
  const [clientType, setClientType] = React.useState<ClientType>('userPool');
  const [output, setOutput] = useState({} as BackendExports);
  const [isLoaded, setIsLoaded] = useState(false);
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    fetch('/backendExports.json')
      .then((response) => response.json())
      .then((backendExports: BackendExports) => {
        console.log('backendExports: ', backendExports);

        Amplify.configure(
          {
            //aws_project_region: backendExports.region,
            //aws_appsync_graphqlEndpoint: backendExports.graphQLAPIURL,
            //aws_appsync_region: backendExports.region,
            //aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
            //aws_cloud_logic_custom: [
            //  {
            //    name: 'AppRestAPI',
            //    endpoint: 'https://5b2zevx2sj.execute-api.us-east-1.amazonaws.com/new',
            //    region: backendExports.region,
            //  },
            //],
            //aws_cognito_identity_pool_id: cdkOutput.ADMAuthStack.IdentityPoolId,
            //aws_cognito_region: backendExports.region,
            //aws_user_pools_id: backendExports.userPoolId,
            //aws_user_pools_web_client_id: backendExports.userPoolClientId,
            //oauth: {
            //  domain: 'auth-dev.apptractive.com.au',
            //  scope: [
            //    'email',
            //    'openid',
            //    'profile',
            //    'aws.cognito.signin.user.admin'
            //  ],
            //  redirectSignIn: 'http://localhost:4200/xero-redirect',
            //  redirectSignOut: '',
            //  responseType: 'code'
            //},
            //federationTarget: "COGNITO_USER_POOLS",
            Analytics: {
              Pinpoint: {
                appId: backendExports.pinpointAppId,
                region: backendExports.region,
              },
            },
            API: {
              GraphQL: {
                endpoint: backendExports.graphQLAPIURL,
                region: backendExports.region,
                // Set the default auth mode to "userPool"
                defaultAuthMode: 'userPool',
              },
              REST: {
                [backendExports.restApiName]: {
                  endpoint: backendExports.restApiGatewayEndpoint, //cdkOutput?.ADMAppSyncAPIStack?.RestApiGatewayEndpointF48811B0,
                  region: backendExports.region, //cdkOutput?.ADMAppSyncAPIStack?.Region,
                },
              },
            },
            Auth: {
              Cognito: {
                identityPoolId: backendExports.identityPoolId, // REQUIRED - Amazon Cognito Identity Pool ID
                // region: backendExports.region, // REQUIRED - Amazon Cognito Region
                userPoolId: backendExports.userPoolId, // OPTIONAL - Amazon Cognito User Pool ID
                userPoolClientId: backendExports.userPoolClientId, // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
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
                allowGuestAccess: true,
              },
            },
            Geo: {
              LocationService: {
                region: backendExports.region, // Region where your Place Index is created
                searchIndices: {
                  items: [backendExports.placeIndexName], // Replace with your Place Index name
                  default: backendExports.placeIndexName, // Set the default Place Index
                },
              },
            },
            Storage: {
              S3: {
                bucket: backendExports.mediaBucketName,
                region: backendExports.region,
              },
            },
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

              //endpoints: [
              //  {
              //    name: backendExports.restApiName,
              //    endpoint: backendExports.restApiGatewayEndpoint, //cdkOutput?.ADMAppSyncAPIStack?.RestApiGatewayEndpointF48811B0,
              //    custom_header: async () => {
              //      return {
              //        Authorization: `${(await Auth.currentSession())
              //          .getIdToken()
              //          .getJwtToken()}`,
              //      };
              //    },
              //  },
              //],
            },
          }
        ); // configure aws backend
        setOutput(backendExports);
        setIsLoaded(true);
        refreshClient();
      })
      .catch((e) => console.log(e)); //TODO: handle error?
  }, []);

  const createApolloClient = (
    clientType: ClientType,
    output: BackendExports
  ) => {
    if (clientType === 'userPool') {
      return userPoolClient({ graphQLAPIURL: output.graphQLAPIURL });
    } else if (clientType === 'iam') {
      return iamClient({ graphQLAPIURL: output.graphQLAPIURL });
    } else if (output.graphQLAPIKey) {
      return apiKeyClient({
        graphQLAPIURL: output.graphQLAPIURL,
        graphQLAPIKey: output.graphQLAPIKey,
      });
    }
  };

  const refreshClient = useCallback(() => {
    if (output?.graphQLAPIURL && !client) {
      const newClient = createApolloClient(clientType, output);
      if (newClient) {
        setClient(newClient);
      }
    }
  }, [clientType, client, output]);

  useEffect(() => {
    refreshClient();
  }, [clientType, output]);

  return (
    isLoaded &&
    client && (
      <ClientContext.Provider
        value={{ clientType, setClientType, refreshClient, output }}
      >
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </ClientContext.Provider>
    )
  );
}

export const useClientContext = () => {
  const context = React.useContext(ClientContext);
  // if (!context) {
  //   throw new Error('useClient must be used within a ClientProvider');
  // }
  return (
    context ?? {
      clientType: 'userPool',
      setClientType: () => {
        console.log('setClientType');
      },
      refreshClient: () => {
        console.log('refreshClient');
      },
      output: {} as BackendExports,
    }
  );
};
export default ApolloClientProvider;
