import { Duration, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { DynamoDbDataSource, IGraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import {
  Effect,
  Policy,
  PolicyStatement,
  Role,
  IRole,
} from 'aws-cdk-lib/aws-iam';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import {
  StartingPosition,
  LayerVersion,
  Code,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import {
  LambdaIntegration,
  AuthorizationType as RESTAuthorizationType,
  IRestApi,
} from 'aws-cdk-lib/aws-apigateway';
import {
  DynamoEventSource,
  SqsEventSource,
} from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { JsResolverConstruct } from '../constructs/jsResolverConstruct';
import { LambdaAppSyncOperationConstruct } from '../constructs/lambdaAppSyncOperationConstruct';
import { getLambdaDefaultProps, setResourceName } from '../helpers';
import {
  env,
  fromEmail,
  mediaUrl,
  mixpanelToken,
  webDomainName,
  zaiClientId,
  zaiClientScope,
  zaiDomain,
  zaiTokenDomain,
  xeroClientId,
  xeroClientSecret,
  xeroWebhookKey,
  xeroRedirectUri,
  gleapApiToken,
  region,
} from '../helpers/constants';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';

interface UserServiceStackProps extends NestedStackProps {
  appSyncApi: IGraphqlApi;
  authenticatedRole: IRole;
  autoCompleteResultsDS: DynamoDbDataSource;
  entityTable: ITable;
  entityUserTable: ITable;
  userPool: IUserPool;
  userTable: ITable;
  contactsTable: ITable;
  xeroTokenTable: ITable;
  taskTable: ITable;
  zaiSecrets: ISecret;
  userDS: DynamoDbDataSource;
  activityDS: DynamoDbDataSource;
  signatureDS: DynamoDbDataSource;
  referralDS: DynamoDbDataSource;
  referralTable: ITable;
  graphqlUrl: string;
  restApi: IRestApi;
}

export class UserServiceStack extends NestedStack {
  constructor(scope: Construct, id: string, props: UserServiceStackProps) {
    super(scope, id, props);

    // Step 1: Define the custom layer
    // const extLayer = new LayerVersion(this, 'ExtLayer', {
    //   code: Code.fromAsset(join(__dirname, '../layers/dependencyLayer/opt')),
    //   compatibleRuntimes: [Runtime.NODEJS_20_X, Runtime.NODEJS_18_X, Runtime.NODEJS_16_X],
    //   description: 'External modules for shared Lambda usage',
    // });

    const userStreamFunc = new NodejsFunction(this, 'UserStreamFunction', {
      ...getLambdaDefaultProps(this, 'streamUser'),
      timeout: Duration.minutes(15),
      environment: {
        TABLE_ENTITY: props.entityTable.tableName,
        TABLE_ENTITY_USER: props.entityUserTable.tableName,
        TABLE_USER: props.userTable.tableName,
        ZAI_DOMAIN: zaiDomain,
        ZAI_TOKEN_DOMAIN: zaiTokenDomain,
        ZAI_CLIENT_ID: zaiClientId,
        ZAI_CLIENT_SCOPE: zaiClientScope,
        AUTH_USERPOOLID: props.userPool.userPoolId,
        ENV: env,
        GLEAP_API_TOKEN: gleapApiToken,
      },
    });
    userStreamFunc.addEventSource(
      new DynamoEventSource(props.userTable, {
        startingPosition: StartingPosition.TRIM_HORIZON,
      })
    );
    props.entityTable.grantReadWriteData(userStreamFunc);
    props.entityUserTable.grantReadWriteData(userStreamFunc);
    props.userTable.grantReadWriteData(userStreamFunc);
    props.zaiSecrets.grantRead(userStreamFunc);

    userStreamFunc.role?.attachInlinePolicy(
      new Policy(this, 'UserStreamFuncUserPoolPolicy', {
        statements: [
          new PolicyStatement({
            actions: ['cognito-idp:AdminUpdateUserAttributes'],
            effect: Effect.ALLOW,
            resources: [props.userPool.userPoolArn],
          }),
        ],
      })
    );

    userStreamFunc.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:Query'],
        resources: [
          `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.entityTable.tableName}/index/usersByReferralCode`,
        ],
      })
    );

    // update user
    const updateUser = new LambdaAppSyncOperationConstruct(this, 'UpdateUser', {
      api: props.appSyncApi,
      typeName: 'Mutation',
      fieldName: 'updateUser',
      environmentVars: {
        AUTH_USERPOOLID: props.userPool.userPoolId,
        TABLE_USER: props.userTable.tableName,
        MIXPANEL_TOKEN: mixpanelToken,
        ENV: env,
        ZAI_DOMAIN: zaiDomain,
        ZAI_TOKEN_DOMAIN: zaiTokenDomain,
        ZAI_CLIENT_ID: zaiClientId,
        ZAI_CLIENT_SCOPE: zaiClientScope,
      },
    });
    props.userTable.grantWriteData(updateUser.lambda);
    props.zaiSecrets.grantRead(updateUser.lambda);

    updateUser.lambda.role?.attachInlinePolicy(
      new Policy(this, 'UpdateUserFuncUserPoolPolicy', {
        statements: [
          new PolicyStatement({
            actions: ['cognito-idp:AdminUpdateUserAttributes'],
            effect: Effect.ALLOW,
            resources: [props.userPool.userPoolArn],
          }),
        ],
      })
    );

    // xero create consent url function
    const xeroCreateConsentUrlFunc = new LambdaAppSyncOperationConstruct(
      this,
      'XeroCreateConsentUrlResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'xeroCreateConsentUrl',
        environmentVars: {
          ENV: env,
          XERO_CLIENT_ID: xeroClientId,
          XERO_CLIENT_SECRET: xeroClientSecret,
          XERO_WEBHOOK_KEY: xeroWebhookKey,
          XERO_REDIRECT_URI: xeroRedirectUri,
          TABLE_USER: props.userTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
        },
      }
    );

    // xero create tenant connect
    const xeroCreateTenantsConnectFunc = new LambdaAppSyncOperationConstruct(
      this,
      'XeroCreateTenantsConnectResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'xeroCreateTenantsConnect',
        environmentVars: {
          AUTH_USERPOOLID: props.userPool.userPoolId,
          ENV: env,
          XERO_CLIENT_ID: xeroClientId,
          XERO_CLIENT_SECRET: xeroClientSecret,
          TABLE_XERO_TOKEN: props.xeroTokenTable.tableName,
          XERO_REDIRECT_URI: xeroRedirectUri,
        },
      }
    );
    props.xeroTokenTable.grantReadWriteData(
      xeroCreateTenantsConnectFunc.lambda
    );

    // xero create contact sync
    const xeroContactSyncQueue = new Queue(this, 'XeroContactSyncQueue', {
      queueName: setResourceName('XeroContactSyncQueue'),
      visibilityTimeout: Duration.minutes(15),
    });
    const xeroCreateContactSyncFunc = new LambdaAppSyncOperationConstruct(
      this,
      'XeroCreateContactSyncResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'xeroCreateContactSync',
        environmentVars: {
          AUTH_USERPOOLID: props.userPool.userPoolId,
          SQS_QUEUE_URL: xeroContactSyncQueue.queueUrl,
          MIXPANEL_TOKEN: mixpanelToken,
          REGION: region,
          ENV: env,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
        },
      }
    );
    props.entityTable.grantReadWriteData(xeroCreateContactSyncFunc.lambda);
    props.entityUserTable.grantReadData(xeroCreateContactSyncFunc.lambda);
    xeroContactSyncQueue.grantSendMessages(xeroCreateContactSyncFunc.lambda);

    // xero process contact sync
    const xeroProcessContactSync = new NodejsFunction(
      this,
      'XeroProcessContactSyncFunc',
      {
        ...getLambdaDefaultProps(this, 'xeroProcessContactSync'),
        timeout: Duration.minutes(15),
        environment: {
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_USER: props.userTable.tableName,
          TABLE_XERO_TOKEN: props.xeroTokenTable.tableName,
          API_GRAPHQLAPIENDPOINT: props.graphqlUrl,
          SQS_QUEUE_URL: xeroContactSyncQueue.queueUrl,
          MIXPANEL_TOKEN: mixpanelToken,
          REGION: region,
          ENV: env,
          XERO_CLIENT_ID: xeroClientId,
          XERO_CLIENT_SECRET: xeroClientSecret,
          AUTH_USERPOOLID: props.userPool.userPoolId,
        },
      }
    );
    props.xeroTokenTable.grantReadWriteData(xeroProcessContactSync);
    props.userTable.grantReadWriteData(xeroProcessContactSync);
    props.contactsTable.grantReadWriteData(xeroProcessContactSync);
    props.entityTable.grantReadWriteData(xeroProcessContactSync);

    xeroProcessContactSync.role?.attachInlinePolicy(
      new Policy(this, 'AppSyncInvokeXeroProcessContactSyncPolicy', {
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['appsync:GraphQL'],
            resources: [
              `arn:aws:appsync:${this.region}:${this.account}:apis/${props.appSyncApi.apiId}/*`,
            ],
          }),
        ],
      })
    );
    xeroContactSyncQueue.grantConsumeMessages(xeroProcessContactSync);
    const xeroContactSyncEventSource = new SqsEventSource(
      xeroContactSyncQueue,
      {
        batchSize: 1,
      }
    );
    xeroProcessContactSync.addEventSource(xeroContactSyncEventSource);

    // xero get accounts function
    const xeroGetAccountsFunc = new LambdaAppSyncOperationConstruct(
      this,
      'XeroGetAccountsResolver',
      {
        api: props.appSyncApi,
        typeName: 'Query',
        fieldName: 'xeroGetAccounts',
        environmentVars: {
          ENV: env,
          XERO_CLIENT_ID: xeroClientId,
          XERO_CLIENT_SECRET: xeroClientSecret,
          TABLE_XERO_TOKEN: props.xeroTokenTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          AUTH_USERPOOLID: props.userPool.userPoolId,
          XERO_REDIRECT_URI: xeroRedirectUri,
        },
      }
    );
    props.xeroTokenTable.grantReadWriteData(xeroGetAccountsFunc.lambda);
    props.entityUserTable.grantReadData(xeroGetAccountsFunc.lambda);

    // xero get synced tenants function
    const xeroGetSyncedTenantsFunc = new LambdaAppSyncOperationConstruct(
      this,
      'XeroGetSyncedTenantsResolver',
      {
        api: props.appSyncApi,
        typeName: 'Query',
        fieldName: 'xeroGetSyncedTenants',
        environmentVars: {
          ENV: env,
          XERO_CLIENT_ID: xeroClientId,
          XERO_CLIENT_SECRET: xeroClientSecret,
          TABLE_XERO_TOKEN: props.xeroTokenTable.tableName,
          AUTH_USERPOOLID: props.userPool.userPoolId,
        },
      }
    );
    props.xeroTokenTable.grantReadWriteData(xeroGetSyncedTenantsFunc.lambda);

    // xero get connection status function
    const xeroGetConnectionStatusFunc = new LambdaAppSyncOperationConstruct(
      this,
      'XeroGetConnectionStatusResolver',
      {
        api: props.appSyncApi,
        typeName: 'Query',
        fieldName: 'xeroGetConnectionStatus',
        environmentVars: {
          ENV: env,
          XERO_CLIENT_ID: xeroClientId,
          XERO_CLIENT_SECRET: xeroClientSecret,
          TABLE_XERO_TOKEN: props.xeroTokenTable.tableName,
          TABLE_USER: props.userTable.tableName,
          AUTH_USERPOOLID: props.userPool.userPoolId,
        },
      }
    );
    props.xeroTokenTable.grantReadData(xeroGetConnectionStatusFunc.lambda);
    props.userTable.grantReadWriteData(xeroGetConnectionStatusFunc.lambda);

    // xero disconnect
    const xeroDisconnectFunc = new LambdaAppSyncOperationConstruct(
      this,
      'XeroDisconnectResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'xeroDisconnect',
        environmentVars: {
          ENV: env,
          AUTH_USERPOOLID: props.userPool.userPoolId,
          XERO_CLIENT_ID: xeroClientId,
          XERO_CLIENT_SECRET: xeroClientSecret,
          TABLE_USER: props.userTable.tableName,
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_XERO_TOKEN: props.xeroTokenTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
        },
      }
    );
    props.contactsTable.grantReadWriteData(xeroDisconnectFunc.lambda);
    props.entityUserTable.grantReadData(xeroDisconnectFunc.lambda);
    props.entityTable.grantReadWriteData(xeroDisconnectFunc.lambda);
    props.xeroTokenTable.grantReadWriteData(xeroDisconnectFunc.lambda);
    props.userTable.grantReadWriteData(xeroDisconnectFunc.lambda);
    xeroDisconnectFunc.lambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:Query'],
        resources: [
          `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.contactsTable.tableName}/index/contactsByEntity`,
        ],
      })
    );

    // xero webhook handler function
    const xeroWebhookHandlerFunc = new NodejsFunction(
      this,
      'XeroWebhookHandlerFunction',
      {
        ...getLambdaDefaultProps(this, 'xeroWebhookHandler'),
        environment: {
          ENV: env,
          API_GRAPHQLAPIENDPOINT: props.graphqlUrl,
          XERO_WEBHOOK_KEY: xeroWebhookKey,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_XERO_TOKEN: props.xeroTokenTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          XERO_CLIENT_ID: xeroClientId,
          XERO_CLIENT_SECRET: xeroClientSecret,
          AUTH_USERPOOLID: props.userPool.userPoolId,
        },
      }
    );
    xeroWebhookHandlerFunc.role?.attachInlinePolicy(
      new Policy(this, 'AppSyncInvokeXeroWebhookHandlerPolicy', {
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['appsync:GraphQL'],
            resources: [
              `arn:aws:appsync:${this.region}:${this.account}:apis/${props.appSyncApi.apiId}/*`,
            ],
          }),
        ],
      })
    );
    xeroWebhookHandlerFunc.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:Query'],
        resources: [
          `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.contactsTable.tableName}/index/contactsByXeroTenantId`,
          `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.taskTable.tableName}/index/tasksByXeroTenantId`,
        ],
      })
    );
    props.entityTable.grantReadWriteData(xeroWebhookHandlerFunc);
    props.contactsTable.grantReadWriteData(xeroWebhookHandlerFunc);
    props.xeroTokenTable.grantReadWriteData(xeroWebhookHandlerFunc);
    props.entityUserTable.grantReadData(xeroWebhookHandlerFunc);
    props.taskTable.grantReadWriteData(xeroWebhookHandlerFunc);

    // xero webhook listener function
    const xeroWebhookListenerFunc = new NodejsFunction(
      this,
      'XeroWebhookListenerFunction',
      {
        ...getLambdaDefaultProps(this, 'xeroWebhookListener'),
        environment: {
          FUNCTION_XEROWEBHOOKHANDLER: xeroWebhookHandlerFunc.functionName,
          ENV: env,
          XERO_WEBHOOK_KEY: xeroWebhookKey,
        },
      }
    );
    xeroWebhookListenerFunc.role?.attachInlinePolicy(
      new Policy(this, 'XeroWebhookListenerFuncInvokeHandlerPolicy', {
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['lambda:InvokeFunction'],
            resources: [xeroWebhookHandlerFunc.functionArn],
          }),
        ],
      })
    );
    const xeroIntegration = new LambdaIntegration(xeroWebhookListenerFunc);
    const xeroWebhookEndpoint = props.restApi.root.addResource('webhook-xero');
    xeroWebhookEndpoint.addMethod('POST', xeroIntegration, {
      authorizationType: RESTAuthorizationType.NONE,
    });

    // get user
    new JsResolverConstruct(this, 'GetUserResolver', {
      api: props.appSyncApi,
      dataSource: props.userDS,
      typeName: 'Query',
      fieldName: 'getUser',
      pathName: 'getUser',
    });

    new JsResolverConstruct(this, 'GetUserActivityResolver', {
      api: props.appSyncApi,
      dataSource: props.activityDS,
      typeName: 'Query',
      fieldName: 'getActivitiesByUser',
      pathName: 'Query.getActivitiesByUser',
    });

    new JsResolverConstruct(this, 'GetUserReferralsResolver', {
      api: props.appSyncApi,
      dataSource: props.referralDS,
      typeName: 'Query',
      fieldName: 'getReferralsByUser',
      pathName: 'Query.getReferralsByUser',
    });

    // list users
    new JsResolverConstruct(this, 'ListUsersResolver', {
      api: props.appSyncApi,
      dataSource: props.userDS,
      typeName: 'Query',
      fieldName: 'listUsers',
      pathName: 'Query.listUsers',
    });

    new JsResolverConstruct(this, 'CreateSignatureResolver', {
      api: props.appSyncApi,
      dataSource: props.signatureDS,
      typeName: 'Mutation',
      fieldName: 'createSignature',
      pathName: 'Mutation.createSignature',
    });

    // delete signature
    new JsResolverConstruct(this, 'DeleteSignatureResolver', {
      api: props.appSyncApi,
      dataSource: props.signatureDS,
      typeName: 'Mutation',
      fieldName: 'deleteSignature',
      pathName: 'Mutation.deleteSignature',
    });

    // user signatures
    new JsResolverConstruct(this, 'UserSignaturesResolver', {
      api: props.appSyncApi,
      dataSource: props.signatureDS,
      typeName: 'User',
      fieldName: 'signatures',
      pathName: 'User.signatures',
    });
  }
}
