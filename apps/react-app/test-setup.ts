import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { vi } from 'vitest';
import 'vitest-canvas-mock';

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

//aws_project_region: 'us-east-1',
//aws_appsync_graphqlEndpoint:
//  'https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
//aws_appsync_region: 'us-east-1',
//aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
//aws_cloud_logic_custom: [
//  {
//    name: 'AppRestAPI',
//    endpoint: 'https://5b2zevx2sj.execute-api.us-east-1.amazonaws.com/new',
//    region: 'us-east-1',
//  },
//],
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

//vi.spyOn(Auth, 'currentAuthenticatedUser').mockImplementation(async () => ({
//  attributes: {
//    sub: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
//  },
//}));
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// mock for aws amplify auth
vi.mock('aws-amplify/auth', async () => {
  const actual: any = await vi.importActual('aws-amplify/auth'); // Import the actual module
  return {
    ...actual, // Spread all actual exports
    fetchAuthSession: vi.fn().mockImplementation(() =>
      Promise.resolve({
        tokens: {
          idToken: 'idToken',
        },
      })
    ),
    fetchUserAttributes: vi.fn().mockImplementation(() =>
      Promise.resolve({
        attributes: {
          sub: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
        },
      })
    ),
    fetchMFAPreference: vi.fn().mockImplementation(() =>
      Promise.resolve({
        mfa: 'SMS',
      })
    ),
  };
});

vi.mock('react-hook-form', async () => {
  const actual: any = await vi.importActual('react-hook-form'); // Import the actual module
  // Create a mock Controller component
  return {
    ...actual, // Spread all actual exports
    useFormContext: () => ({
      ...actual.useFormContext(),
      control: {
        ...actual.useForm().control,
        register: vi.fn(),
        unregister: vi.fn(),
        getValues: vi.fn(),
      },
      getValues: vi.fn(),
      handleSubmit: vi.fn(),
      trigger: vi.fn(),
      formState: { errors: {} },
      setValue: vi.fn(),
      watch: vi.fn(),
    }),
    useWatch: () => undefined,
    Controller: actual.Controller, // Use the mocked Controller
  };
});

vi.mock('react-i18next', async () => ({
  ...((await vi.importActual('react-i18next')) as any),
  useTranslation: () => ({
    t: vi.fn((key) => key),
    i18n: {
      language: 'en-us',
      changeLanguage: vi.fn(),
    },
  }),
}));

// mock pspdfkit
vi.mock('pspdfkit', () => ({
  load: vi.fn().mockImplementation(() =>
    Promise.resolve({
      create: vi.fn(),
      createAttachment: vi.fn(),
      addEventListener: vi.fn(),
      viewState: {
        set: vi.fn(),
      },
      setViewState: vi.fn(),
      transformContentClientToPageSpace: vi.fn(),
      // other instance methods...
    })
  ),
  unload: vi.fn(),
  defaultToolbarItems: [{ type: 'annotate' }, { type: 'pan' }],
  ViewState: vi.fn(),
  Annotations: {
    WidgetAnnotation: vi.fn(),
    InkAnnotation: vi.fn(),
    ImageAnnotation: vi.fn(),
    toSerializableObject: vi.fn(),
  },
  Geometry: {
    Rect: vi.fn(),
    DrawingPoint: vi.fn(),
  },
  Immutable: {
    List: vi.fn(),
  },
  generateInstantId: vi.fn(),
  FormFields: {
    SignatureFormField: vi.fn(),
  },
  InteractionMode: {
    FORM_CREATOR: 'FORM_CREATOR',
  },
  ElectronicSignatureCreationMode: {
    DRAW: 'DRAW',
    IMAGE: 'IMAGE',
    TYPE: 'TYPE',
  },
}));

// Mock React Konva for Typing signature

vi.mock('react-konva', () => ({}));

afterEach(() => {
  vi.restoreAllMocks();
});
