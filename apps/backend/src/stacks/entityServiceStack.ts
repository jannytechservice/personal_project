import { Duration, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import {
  IRestApi,
  LambdaIntegration,
  AuthorizationType as RESTAuthorizationType,
} from 'aws-cdk-lib/aws-apigateway';
import {
  DynamoDbDataSource,
  IGraphqlApi,
  NoneDataSource,
} from 'aws-cdk-lib/aws-appsync';
import { IDomain } from 'aws-cdk-lib/aws-opensearchservice';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { JsPipelineResolverConstruct } from '../constructs/jsPipelineResolverConstruct';
import { JsResolverConstruct } from '../constructs/jsResolverConstruct';
import { LambdaAppSyncOperationConstruct } from '../constructs/lambdaAppSyncOperationConstruct';
import { getLambdaDefaultProps } from '../helpers';
import {
  abrGuid,
  account,
  createUserFuncName,
  env,
  frankieOneApiDomain,
  frankieOneApiKey,
  frankieOneCustomerId,
  frankieOneSmartUiDomain,
  region,
  zaiClientId,
  zaiClientScope,
  zaiDomain,
  zaiTokenDomain,
  mediaUrl,
  webDomainName,
  fromEmail,
  ocrEmailDomain,
} from '../helpers/constants';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';

interface EntityServiceStackProps extends NestedStackProps {
  appSyncApi: IGraphqlApi;
  entityTable: ITable;
  userTable: ITable;
  referralTable: ITable;
  entityBeneficialOwnerTable: ITable;
  entityBeneficialOwnerDS: DynamoDbDataSource;
  entityUserDS: DynamoDbDataSource;
  beneficialOwnerTable: ITable;
  beneficialOwnerTableDS: DynamoDbDataSource;
  graphqlUrl: string;
  noDS: NoneDataSource;
  autoCompleteResultsTable: ITable;
  zaiSecrets: ISecret;
  entityDS: DynamoDbDataSource;
  contactsDS: DynamoDbDataSource;
  paymentMethodTableDS: DynamoDbDataSource;
  userPool: IUserPool;
  entityUserTable: ITable;
  userDS: DynamoDbDataSource;
  restApi: IRestApi;
  openSearchDomain: IDomain;
}

export class EntityServiceStack extends NestedStack {
  constructor(scope: Construct, id: string, props: EntityServiceStackProps) {
    super(scope, id, props);

    // BENEFICIAL OWNER
    // beneficial owner stream
    const beneficialOwnerStreamFunc = new NodejsFunction(
      this,
      'BeneficialOwnerStreamFunction',
      {
        ...getLambdaDefaultProps(this, 'streamBeneficialOwner'),
        timeout: Duration.minutes(15),
        environment: {
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_BENEFICIAL_OWNER:
            props.entityBeneficialOwnerTable.tableName,
          TABLE_BENEFICIAL_OWNER: props.beneficialOwnerTable.tableName,
          ENV: env,
          API_GRAPHQLAPIENDPOINT: props.graphqlUrl,
        },
      }
    );

    beneficialOwnerStreamFunc.addEventSource(
      new DynamoEventSource(props.beneficialOwnerTable, {
        startingPosition: StartingPosition.TRIM_HORIZON,
      })
    );

    props.entityTable.grantReadWriteData(beneficialOwnerStreamFunc);
    props.entityBeneficialOwnerTable.grantReadWriteData(
      beneficialOwnerStreamFunc
    );
    props.beneficialOwnerTable.grantReadWriteData(beneficialOwnerStreamFunc);
    beneficialOwnerStreamFunc.role?.attachInlinePolicy(
      new Policy(this, 'AppSyncInvokeBeneficialOwnerStreamPolicy', {
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

    // beneficial owner subscription
    new JsPipelineResolverConstruct(this, 'OnUpdateBeneficialOwnerResolver', {
      api: props.appSyncApi,
      dataSources: [
        props.entityUserDS,
        props.entityBeneficialOwnerDS,
        props.noDS,
      ],
      typeName: 'Subscription',
      fieldName: 'onUpdateBeneficialOwner',
      pathName: 'Subscription.onUpdateBeneficialOwner',
    });

    // update beneficial owner mutation
    new JsResolverConstruct(this, 'UpdateBeneficialOwnerResolver', {
      api: props.appSyncApi,
      dataSource: props.beneficialOwnerTableDS,
      typeName: 'Mutation',
      fieldName: 'updateBeneficialOwner',
      pathName: 'Mutation.updateBeneficialOwner',
    });

    // ENTITY
    // entity stream
    const entityStream = new NodejsFunction(this, 'EntityStreamFunction', {
      ...getLambdaDefaultProps(this, 'streamEntity'),
      timeout: Duration.minutes(15),
      environment: {
        TABLE_ENTITY_BENEFICIAL_OWNER:
          props.entityBeneficialOwnerTable.tableName,
        TABLE_AUTOCOMPLETE_RESULT: props.autoCompleteResultsTable.tableName,
        TABLE_BENEFICIAL_OWNER: props.beneficialOwnerTable.tableName,
        TABLE_ENTITY: props.entityTable.tableName,
        ZAI_DOMAIN: zaiDomain,
        ZAI_TOKEN_DOMAIN: zaiTokenDomain,
        ZAI_CLIENT_ID: zaiClientId,
        ZAI_CLIENT_SCOPE: zaiClientScope,
        ENV: env,
        ABR_GUID: abrGuid,
        FRANKIEONE_API_KEY: frankieOneApiKey,
        FRANKIEONE_API_DOMAIN: frankieOneApiDomain,
        FRANKIEONE_CUSTOMER_ID: frankieOneCustomerId,
        OPENSEARCH_DOMAIN_ENDPOINT: props.openSearchDomain.domainEndpoint,
        OCR_EMAIL_DOMAIN: ocrEmailDomain,
      },
    });
    entityStream.addEventSource(
      new DynamoEventSource(props.entityTable, {
        startingPosition: StartingPosition.TRIM_HORIZON,
      })
    );
    props.entityBeneficialOwnerTable.grantReadWriteData(entityStream);
    props.beneficialOwnerTable.grantReadWriteData(entityStream);
    props.entityTable.grantReadWriteData(entityStream);
    props.autoCompleteResultsTable.grantReadWriteData(entityStream);
    props.zaiSecrets.grantRead(entityStream);

    props.openSearchDomain.grantWrite(entityStream);
    props.openSearchDomain.grantIndexReadWrite('entity', entityStream);
    props.openSearchDomain.grantIndexReadWrite(
      'autocomplete-result',
      entityStream
    );
    entityStream.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['es:ESHttpPost'],
        resources: [`${props.openSearchDomain.domainArn}/*`],
      })
    );

    entityStream.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:Query'],
        resources: [
          `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.entityTable.tableName}/index/entityByOcrEmail`,
        ],
      })
    );

    // regenerate entity ocr email
    const regenerateEntityOcrEmailFunc = new LambdaAppSyncOperationConstruct(
      this,
      'RegenerateEntityOcrEmailResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'regenerateEntityOcrEmail',
        environmentVars: {
          ENV: env,
          AUTH_USERPOOLID: props.userPool.userPoolId,
          TABLE_ENTITY: props.entityTable.tableName,
          OCR_EMAIL_DOMAIN: ocrEmailDomain,
        },
      }
    );

    props.entityTable.grantReadWriteData(regenerateEntityOcrEmailFunc.lambda);

    regenerateEntityOcrEmailFunc.lambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:Query'],
        resources: [
          `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.entityTable.tableName}/index/entityByOcrEmail`,
        ],
      })
    );

    //get entity
    new JsPipelineResolverConstruct(this, 'GetAutoCompleteResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityDS, props.contactsDS],
      typeName: 'Query',
      fieldName: 'getAutoComplete',
      pathName: 'Query.getAutoComplete',
    });

    //get entity
    new JsPipelineResolverConstruct(this, 'GetEntityResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.entityDS],
      typeName: 'Query',
      fieldName: 'getEntity',
      pathName: 'Query.getEntity',
    });

    new JsResolverConstruct(
      this,
      'EntityBeneficialOwnerBeneficialOwnerResolver',
      {
        api: props.appSyncApi,
        dataSource: props.beneficialOwnerTableDS,
        typeName: 'EntityBeneficialOwner',
        fieldName: 'beneficialOwner',
        pathName: 'EntityBeneficialOwner.beneficialOwner',
      }
    );

    new JsResolverConstruct(this, 'EntityEntityBeneficialOwnersResolver', {
      api: props.appSyncApi,
      dataSource: props.entityBeneficialOwnerDS,
      typeName: 'Entity',
      fieldName: 'entityBeneficialOwners',
      pathName: 'Entity.entityBeneficialOwners',
    });

    // Entity's entity users
    new JsResolverConstruct(this, 'EntityEntityUsersResolver', {
      api: props.appSyncApi,
      dataSource: props.entityUserDS,
      typeName: 'Entity',
      fieldName: 'entityUsers',
      pathName: 'Entity.entityUsers',
    });

    // Entity's payment methods
    new JsResolverConstruct(this, 'EntityPaymentMethodsResolver', {
      api: props.appSyncApi,
      dataSource: props.paymentMethodTableDS,
      typeName: 'Entity',
      fieldName: 'paymentMethods',
      pathName: 'Entity.paymentMethods',
    });

    // delete entity
    new JsResolverConstruct(this, 'DeleteEntityResolver', {
      api: props.appSyncApi,
      dataSource: props.entityDS,
      typeName: 'Mutation',
      fieldName: 'deleteEntity',
      pathName: 'Mutation.deleteEntity',
    });

    // create entity
    new JsPipelineResolverConstruct(this, 'CreateEntityResolver', {
      api: props.appSyncApi,
      dataSources: [
        props.userDS,
        props.entityDS,
        props.entityUserDS,
        props.userDS,
      ],
      typeName: 'Mutation',
      fieldName: 'createEntity',
      pathName: 'Mutation.createEntity',
    });

    // update entity
    new JsPipelineResolverConstruct(this, 'UpdateEntityResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.entityDS],
      typeName: 'Mutation',
      fieldName: 'updateEntity',
      pathName: 'Mutation.updateEntity',
    });

    new JsPipelineResolverConstruct(this, 'OnUpdateEntityResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.noDS],
      typeName: 'Subscription',
      fieldName: 'onUpdateEntity',
      pathName: 'Subscription.onUpdateEntity',
    });

    // abr lookup
    new LambdaAppSyncOperationConstruct(this, 'ABRLookupQuery', {
      api: props.appSyncApi,
      typeName: 'Query',
      fieldName: 'abrLookup', //TODO: rename to abrLookupByAbn
      environmentVars: {
        ABR_GUID: abrGuid,
      },
    });

    // abr lookup by name
    new LambdaAppSyncOperationConstruct(this, 'ABRLookupByNameQuery', {
      api: props.appSyncApi,
      typeName: 'Query',
      fieldName: 'abrLookupByName',
      environmentVars: {
        ABR_GUID: abrGuid,
      },
    });

    // ENTITY USERS
    // query entity users by user id
    new JsPipelineResolverConstruct(this, 'EntityUsersByEntityIdResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.entityUserDS],
      typeName: 'Query',
      fieldName: 'entityUsersByEntityId',
      pathName: 'Query.entityUsersByEntityId',
    });

    // query entity users by user id
    new JsResolverConstruct(this, 'EntityUsersByUserResolver', {
      api: props.appSyncApi,
      dataSource: props.entityUserDS,
      typeName: 'Query',
      fieldName: 'entityUsersByUser',
      pathName: 'Query.entityUsersByUser',
    });

    // Entity user's entity
    new JsResolverConstruct(this, 'EntityUserEntityResolver', {
      api: props.appSyncApi,
      dataSource: props.entityDS,
      typeName: 'EntityUser',
      fieldName: 'entity',
      pathName: 'EntityUser.entity',
    });

    const createEntityUserFunc = new LambdaAppSyncOperationConstruct(
      this,
      'CreateEntityUserResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createEntityUser',
        environmentVars: {
          ENV: env,
          MEDIA_URL: mediaUrl,
          FROM_EMAIL: fromEmail,
          WEB_DOMAIN: `https://${webDomainName}`,
          AUTH_USERPOOLID: props.userPool.userPoolId,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_USER: props.entityUserTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          FUNCTION_CREATEUSER: createUserFuncName,
          TEMPLATE_ARN: `arn:aws:mobiletargeting:${this.region}:${this.account}:templates`,
        },
      }
    );

    props.entityTable.grantReadData(createEntityUserFunc.lambda);
    props.entityUserTable.grantReadWriteData(createEntityUserFunc.lambda);
    props.userTable.grantReadWriteData(createEntityUserFunc.lambda);

    // update entity user status
    const acceptDenyEntityUserStatusFunc = new LambdaAppSyncOperationConstruct(
      this,
      'AcceptDenyEntityUserStatusResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'acceptDenyEntityUserStatus',
        environmentVars: {
          ENV: env,
          MEDIA_URL: mediaUrl,
          FROM_EMAIL: fromEmail,
          WEB_DOMAIN: `https://${webDomainName}`,
          AUTH_USERPOOLID: props.userPool.userPoolId,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_USER: props.userTable.tableName,
          TEMPLATE_ARN: `arn:aws:mobiletargeting:${this.region}:${this.account}:templates`,
        },
      }
    );

    props.entityTable.grantReadData(acceptDenyEntityUserStatusFunc.lambda);
    props.entityUserTable.grantReadWriteData(
      acceptDenyEntityUserStatusFunc.lambda
    );
    props.userTable.grantReadWriteData(acceptDenyEntityUserStatusFunc.lambda);

    // send referral invitation email
    const sendReferralInvitationEmailFunc = new LambdaAppSyncOperationConstruct(
      this,
      'sendReferralInvitationEmailResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'sendReferralInvitationEmail',
        environmentVars: {
          ENV: env,
          MEDIA_URL: mediaUrl,
          FROM_EMAIL: fromEmail,
          WEB_DOMAIN: `https://${webDomainName}`,
          AUTH_USERPOOLID: props.userPool.userPoolId,
          TABLE_USER: props.userTable.tableName,
          TABLE_REFERRAL: props.referralTable.tableName,
          TEMPLATE_ARN: `arn:aws:mobiletargeting:${this.region}:${this.account}:templates`,
        },
      }
    );

    props.userTable.grantReadData(sendReferralInvitationEmailFunc.lambda);

    // allow SES permission
    const sendEmailTaskStreamPolicy = new Policy(
      this,
      'SendEmailTaskStreamPolicy',
      {
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
              'ses:SendTemplatedEmail',
              'mobiletargeting:GetEmailTemplate',
              'ses:SendTemplatedEmail',
            ],
            resources: [
              `arn:aws:ses:${this.region}:${this.account}:identity/*`,
              `arn:aws:mobiletargeting:${this.region}:${this.account}:templates/*`,
              `arn:aws:ses:${this.region}:${this.account}:configuration-set/*`,
            ],
          }),
        ],
      }
    );

    const cognitoUserPoolPolicy = new Policy(
      this,
      'CognitoUserAdmiinPoolPolicy',
      {
        statements: [
          new PolicyStatement({
            actions: [
              'cognito-idp:AdminGetUser',
              'cognito-idp:AdminCreateUser',
              'cognito-idp:AdminUpdateUserAttributes',
            ],
            resources: [props.userPool.userPoolArn],
          }),
        ],
      }
    );

    // delete entity user
    new JsPipelineResolverConstruct(this, 'DeleteEntityUserResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.entityUserDS],
      typeName: 'Mutation',
      fieldName: 'deleteEntityUser',
      pathName: 'Mutation.deleteEntityUser',
    });

    // update entity user
    new JsPipelineResolverConstruct(this, 'UpdateEntityUserResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.entityUserDS],
      typeName: 'Mutation',
      fieldName: 'updateEntityUser',
      pathName: 'Mutation.updateEntityUser',
    });

    // allow SES permission
    createEntityUserFunc.lambda.role?.attachInlinePolicy(
      sendEmailTaskStreamPolicy
    );

    sendReferralInvitationEmailFunc.lambda.role?.attachInlinePolicy(
      sendEmailTaskStreamPolicy
    );

    // allow create cognito user permissions
    createEntityUserFunc.lambda.role?.attachInlinePolicy(cognitoUserPoolPolicy);

    // invoke create user permissions
    createEntityUserFunc.lambda.role?.attachInlinePolicy(
      new Policy(this, 'CreateEntityUserFuncInvokeCreateUserFunc', {
        statements: [
          new PolicyStatement({
            actions: ['lambda:InvokeFunction'],
            resources: [
              `arn:aws:lambda:${region}:${account}:function:${createUserFuncName}`,
            ],
          }),
        ],
      })
    );

    // FRANKIEONE
    // frankieone webhook handler function
    const frankieOneHandlerFunc = new NodejsFunction(
      this,
      'FrankieOneHandlerFunction', // TODO: rename FrankieOneWebhookHandlerFunction
      {
        ...getLambdaDefaultProps(this, 'frankieOneWebhookHandler'),
        timeout: Duration.minutes(15),
        environment: {
          TABLE_ENTITY_BENEFICIAL_OWNER:
            props.entityBeneficialOwnerTable.tableName,
          TABLE_BENEFICIAL_OWNER: props.beneficialOwnerTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          FRANKIEONE_API_KEY: frankieOneApiKey,
          FRANKIEONE_API_DOMAIN: frankieOneApiDomain,
          FRANKIEONE_CUSTOMER_ID: frankieOneCustomerId,
          API_GRAPHQLAPIENDPOINT: props.graphqlUrl,
        },
      }
    );

    props.entityBeneficialOwnerTable.grantReadWriteData(frankieOneHandlerFunc);
    props.beneficialOwnerTable.grantReadWriteData(frankieOneHandlerFunc);
    props.entityTable.grantReadWriteData(frankieOneHandlerFunc);
    frankieOneHandlerFunc.role?.attachInlinePolicy(
      new Policy(this, 'AppSyncInvokeFrankieOneHandlerPolicy', {
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

    // frankieone webhook listener function
    const frankieOneListenerFunc = new NodejsFunction(
      this,
      'FrankieOneWebhookListenerFunction',
      {
        ...getLambdaDefaultProps(this, 'frankieOneWebhookListener'),
        environment: {
          TABLE_BENEFICIAL_OWNER: props.beneficialOwnerTable.tableName,
          FUNCTION_FRANKIEONEWEBHOOKHANDLER: frankieOneHandlerFunc.functionName,
          FRANKIEONE_API_KEY: frankieOneApiKey,
          FRANKIEONE_API_DOMAIN: frankieOneApiDomain,
          FRANKIEONE_CUSTOMER_ID: frankieOneCustomerId,
        },
      }
    );

    props.beneficialOwnerTable.grantReadWriteData(frankieOneListenerFunc);
    frankieOneHandlerFunc.grantInvoke(frankieOneListenerFunc);
    const frankieOneIntegration = new LambdaIntegration(frankieOneListenerFunc);

    const frankieOneWebhookEndpoint =
      props.restApi.root.addResource('webhook-frankieone'); //TODO: obfuscation of webhook endpoint
    const frankieOneWebhookProxy =
      frankieOneWebhookEndpoint.addResource('{proxy+}');

    frankieOneWebhookProxy.addMethod('POST', frankieOneIntegration, {
      authorizationType: RESTAuthorizationType.NONE,
    });

    // getBusinessLookup
    new LambdaAppSyncOperationConstruct(this, 'GetBusinessLookup', {
      api: props.appSyncApi,
      typeName: 'Query',
      fieldName: 'getBusinessLookup',
      environmentVars: {
        FRANKIEONE_API_KEY: frankieOneApiKey,
        FRANKIEONE_API_DOMAIN: frankieOneApiDomain,
        FRANKIEONE_CUSTOMER_ID: frankieOneCustomerId,
        FRANKIEONE_SMARTUI_DOMAIN: frankieOneSmartUiDomain,
      },
    });

    // lookup entity ownership
    const lookupEntityOwnership = new LambdaAppSyncOperationConstruct(
      this,
      'LookupEntityOwnership',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'lookupEntityOwnership',
        environmentVars: {
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          FRANKIEONE_API_KEY: frankieOneApiKey,
          FRANKIEONE_API_DOMAIN: frankieOneApiDomain,
          FRANKIEONE_CUSTOMER_ID: frankieOneCustomerId,
        },
      }
    );

    props.entityTable.grantReadWriteData(lookupEntityOwnership.lambda);
    props.entityUserTable.grantReadData(lookupEntityOwnership.lambda);

    // create frankieone smart ui session
    const createVerificationToken = new LambdaAppSyncOperationConstruct(
      this,
      'CreateFrankieOneSmartUiSession',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createVerificationToken',
        environmentVars: {
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_ENTITY_BENEFICIAL_OWNER:
            props.entityBeneficialOwnerTable.tableName,
          TABLE_BENEFICIAL_OWNER: props.beneficialOwnerTable.tableName,
          FRANKIEONE_API_KEY: frankieOneApiKey,
          FRANKIEONE_API_DOMAIN: frankieOneApiDomain,
          FRANKIEONE_CUSTOMER_ID: frankieOneCustomerId,
          FRANKIEONE_SMARTUI_DOMAIN: frankieOneSmartUiDomain,
        },
      }
    );

    props.beneficialOwnerTable.grantReadWriteData(
      createVerificationToken.lambda
    );
    props.entityBeneficialOwnerTable.grantReadWriteData(
      createVerificationToken.lambda
    );
    props.entityUserTable.grantReadWriteData(createVerificationToken.lambda);
  }
}
