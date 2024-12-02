import { AuthOptions, createAuthLink } from 'aws-appsync-auth-link';
import {
  ApolloClient,
  ApolloLink,
  gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import {
  isLoggedInVar,
  isHideToDoVar,
  subInVar,
  selectedEntityIdInVar,
} from '@admiin-com/ds-graphql';
import { typeDefs } from '@admiin-com/ds-graphql';
import { fetchAuthSession } from 'aws-amplify/auth';

const fetchCredentials = async () => {
  const session = await fetchAuthSession();
  if (session && session.credentials) {
    return session.credentials;
  }
  return null;
};

/**
 * Configure AppSync client
 */

const httpLink = ({ graphQLAPIURL }: { graphQLAPIURL: string }) =>
  new HttpLink({
    uri: graphQLAPIURL,
  });

interface AppSyncClientProps {
  authType?: 'AMAZON_COGNITO_USER_POOLS' | 'API_KEY' | 'IAM';
  graphQLAPIKey?: string;
  graphQLAPIURL: string;
}

export const configureAppSyncClient = ({
  authType = 'AMAZON_COGNITO_USER_POOLS',
  graphQLAPIKey,
  graphQLAPIURL,
}: AppSyncClientProps) => {
  const url = graphQLAPIURL; // TODO: duplicated url?
  const region = 'us-east-1';

  let auth: AuthOptions;
  // public auth
  if (authType === 'API_KEY') {
    auth = {
      type: 'API_KEY',
      apiKey: graphQLAPIKey ?? '', // required when using api key to call api
      //credentials: async () => credentials, // Required when using IAM-based auth.
    };
  }
  // iam auth
  else if (authType === 'IAM') {
    auth = {
      type: 'AWS_IAM',
      credentials: fetchCredentials,
      //jwtToken: async () =>
      //  (await Auth.currentSession()).getIdToken().getJwtToken(),
      //credentials: async () => credentials, // Required when using IAM-based auth.
    };
  }

  // cognito auth
  else {
    auth = {
      type: 'AMAZON_COGNITO_USER_POOLS',
      jwtToken: async () =>
        (await fetchAuthSession()).tokens?.idToken?.toString() ?? '',
      //credentials: async () => credentials, // Required when using IAM-based auth.
    };
  }

  const link = ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
              locations
            )}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: `, networkError);
    }),
    createAuthLink({ url, region, auth }),
    createSubscriptionHandshakeLink(
      { url, region, auth },
      httpLink({ graphQLAPIURL })
    ),
    //createHttpLink({
    //  uri: awsmobile.aws_appsync_graphqlEndpoint,
    //}),
  ]);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            isLoggedIn: {
              read() {
                return isLoggedInVar();
              },
            },
            sub: {
              read() {
                return subInVar();
              },
            },
            selectedEntityId: {
              read() {
                return selectedEntityIdInVar();
              },
            },
            tasksByEntityFrom: {
              keyArgs: ['entityId', 'status', 'sortDirection', 'filter'],
              merge: true,
            },
            tasksByEntityTo: {
              keyArgs: ['entityId', 'status', 'sortDirection', 'filter'],
              merge: true,
            },

            listUserConversations: {
              merge: true,
            },
            messagesByConversation: {
              merge: true,
            },
            hideToDo: {
              read() {
                return isHideToDoVar();
              },
            },
          },
        },
        User: {
          fields: {
            profileImg: {
              merge: true,
            },
          },
        },
        Entity: {
          fields: {
            logo: {
              merge(existing, incoming) {
                return { ...existing, ...incoming };
              },
            },
          },
        },
        //ModelUserConversationConnection: {
        //  merge: true,
        //},
        //listUserConversations: {
        //  merge: true,
        //},
        //UserConversation: {
        //  merge: true,
        //},
      },
    }),
    connectToDevTools: true, //TODO: disable for production
    typeDefs: gql(typeDefs),
    //disableOffline: true,
  });

  return client;
};
