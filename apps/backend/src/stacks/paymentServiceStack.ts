import { Duration, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { DynamoDbDataSource, IGraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Effect, IRole, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { JsResolverConstruct } from '../constructs/jsResolverConstruct';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaAppSyncOperationConstruct } from '../constructs/lambdaAppSyncOperationConstruct';
import { getLambdaDefaultProps } from '../helpers';
import { StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
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
  zaiWebhookDomain,
} from '../helpers/constants';
import {
  LambdaIntegration,
  AuthorizationType as RESTAuthorizationType,
  IRestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';

interface PaymentServiceStackProps extends NestedStackProps {
  appSyncApi: IGraphqlApi;
  contactsTable: ITable;
  entityTable: ITable;
  entityUserTable: ITable;
  incrementTable: ITable;
  payInPaymentsTable: ITable;
  paymentAccountTable: ITable;
  paymentDS: DynamoDbDataSource;
  paymentMethodTable: ITable;
  paymentMethodTableDS: DynamoDbDataSource;
  paymentTable: ITable;
  pinpointAppId: string;
  restApi: IRestApi;
  taskTable: ITable;
  transactionTable: ITable;
  unauthenticatedRole: IRole;
  userTable: ITable;
  zaiSecrets: ISecret;
  graphqlUrl: string;
  activityTable: ITable;
  referralTable: ITable;
}

export class PaymentServiceStack extends NestedStack {
  constructor(scope: Construct, id: string, props: PaymentServiceStackProps) {
    super(scope, id, props);

    // PAYMENTS
    // payments stream
    const paymentStreamFunc = new NodejsFunction(
      this,
      'PaymentStreamFunction',
      {
        ...getLambdaDefaultProps(this, 'streamPayment'),
        timeout: Duration.minutes(15),
        environment: {
          ANALYTICS_PINPOINT_ID: props.pinpointAppId,
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_USER: props.userTable.tableName,
          TABLE_REFERRAL: props.referralTable.tableName,
          TABLE_PAYMENT: props.paymentTable.tableName,
          TABLE_ACTIVITY: props.activityTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          WEB_DOMAIN: `https://${webDomainName}`, //TODO: combine email template vars into one object to destructure
          MEDIA_URL: mediaUrl,
          TEMPLATE_ARN: `arn:aws:mobiletargeting:${this.region}:${this.account}:templates`,
        },
      }
    );

    paymentStreamFunc.addEventSource(
      new DynamoEventSource(props.paymentTable, {
        startingPosition: StartingPosition.TRIM_HORIZON,
      })
    );

    paymentStreamFunc.role?.attachInlinePolicy(
      new Policy(this, 'SendEmailSmsPaymentStreamCronPolicy', {
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
              'ses:SendTemplatedEmail',
              'mobiletargeting:*',
              'ses:SendTemplatedEmail',
            ],
            resources: [
              `arn:aws:ses:${this.region}:${this.account}:identity/*`,
              `arn:aws:ses:${this.region}:${this.account}:configuration-set/*`,
              `arn:aws:mobiletargeting:${this.region}:${this.account}:templates/*`,
              `arn:aws:mobiletargeting:${this.region}:${this.account}:apps/${props.pinpointAppId}/*`,
            ],
          }),
        ],
      })
    );

    props.contactsTable.grantReadData(paymentStreamFunc);
    props.entityTable.grantReadData(paymentStreamFunc);
    props.paymentTable.grantReadData(paymentStreamFunc);
    props.taskTable.grantReadWriteData(paymentStreamFunc);
    props.userTable.grantReadWriteData(paymentStreamFunc);
    props.referralTable.grantReadWriteData(paymentStreamFunc);
    props.activityTable.grantReadWriteData(paymentStreamFunc);

    // payment cron run daily at 14:00 AEDT (3pm AEST)
    const paymentCronFunc = new NodejsFunction(this, 'PaymentCronFunction', {
      ...getLambdaDefaultProps(this, 'cronPayment'),
      timeout: Duration.minutes(15),
      environment: {
        TABLE_CONTACT: props.contactsTable.tableName,
        TABLE_ENTITY: props.entityTable.tableName,
        TABLE_PAYMENT: props.paymentTable.tableName,
        TABLE_TASK: props.taskTable.tableName,
        MIXPANEL_TOKEN: mixpanelToken,
        ENV: env,
        ZAI_DOMAIN: zaiDomain,
        ZAI_TOKEN_DOMAIN: zaiTokenDomain,
        ZAI_CLIENT_ID: zaiClientId,
        ZAI_CLIENT_SCOPE: zaiClientScope,
      },
    });
    props.contactsTable.grantReadData(paymentCronFunc);
    props.entityTable.grantReadData(paymentCronFunc);
    props.paymentTable.grantReadWriteData(paymentCronFunc);
    props.taskTable.grantReadWriteData(paymentCronFunc);
    props.zaiSecrets.grantRead(paymentCronFunc);

    // cron rule and target
    const paymentCronRule = new Rule(this, 'PaymentCron', {
      schedule: Schedule.cron({ hour: '5', minute: '0' }),
    });
    paymentCronRule.addTarget(new LambdaFunction(paymentCronFunc));

    // payment user confirmation cron run daily at 14:00 (3pm AEST)
    const paymentUserConfirmationCronFunc = new NodejsFunction(
      this,
      'PaymentUserConfirmationCronFunction',
      {
        ...getLambdaDefaultProps(this, 'cronPaymentUserConfirmation'),
        timeout: Duration.minutes(15),
        environment: {
          ENV: env,
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_PAYMENT: props.paymentTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          FROM_EMAIL: fromEmail,
          WEB_DOMAIN: `https://${webDomainName}`, //TODO: combine email template vars into one object to destructure
          MEDIA_URL: mediaUrl,
          TEMPLATE_ARN: `arn:aws:mobiletargeting:${this.region}:${this.account}:templates`,
        },
      }
    );

    props.contactsTable.grantReadData(paymentUserConfirmationCronFunc);
    props.entityTable.grantReadData(paymentUserConfirmationCronFunc);
    props.paymentTable.grantReadWriteData(paymentUserConfirmationCronFunc);
    props.taskTable.grantReadWriteData(paymentUserConfirmationCronFunc);

    paymentUserConfirmationCronFunc.role?.attachInlinePolicy(
      new Policy(this, 'SendEmailPaymentUserConfirmationCronPolicy', {
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
      })
    );

    // cron rule and target, run every hour
    const paymentUserConfirmationCronRule = new Rule(
      this,
      'PaymentUserConfirmationCron',
      {
        schedule: Schedule.cron({ hour: '5', minute: '0' }),
      }
    );
    paymentUserConfirmationCronRule.addTarget(
      new LambdaFunction(paymentUserConfirmationCronFunc)
    );

    // get payment guest
    new JsResolverConstruct(this, 'GetPaymentGuestResolver', {
      api: props.appSyncApi,
      dataSource: props.paymentDS,
      typeName: 'Query',
      fieldName: 'getPaymentGuest',
      pathName: 'Query.getPaymentGuest',
    });

    // confirm payments
    const confirmPayments = new LambdaAppSyncOperationConstruct(
      this,
      'ConfirmPaymentsResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'confirmPayments',
        environmentVars: {
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_PAYMENT: props.paymentTable.tableName,
        },
      }
    );

    props.entityUserTable.grantReadData(confirmPayments.lambda);
    props.paymentTable.grantReadWriteData(confirmPayments.lambda);

    // create payment
    const createPayment = new LambdaAppSyncOperationConstruct(
      this,
      'CreatePaymentResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createPayment',
        timeout: Duration.minutes(5),
        environmentVars: {
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          TABLE_PAYMENT: props.paymentTable.tableName,
          TABLE_PAYMENT_METHODS: props.paymentMethodTable.tableName,
          MIXPANEL_TOKEN: mixpanelToken,
          ENV: env,
          ZAI_DOMAIN: zaiDomain,
          ZAI_TOKEN_DOMAIN: zaiTokenDomain,
          ZAI_CLIENT_ID: zaiClientId,
          ZAI_CLIENT_SCOPE: zaiClientScope,
        },
      }
    );

    props.contactsTable.grantReadData(createPayment.lambda);
    props.entityTable.grantReadData(createPayment.lambda);
    props.entityUserTable.grantReadData(createPayment.lambda);
    props.taskTable.grantReadWriteData(createPayment.lambda);
    props.paymentTable.grantWriteData(createPayment.lambda);
    props.paymentMethodTable.grantReadData(createPayment.lambda);
    props.zaiSecrets.grantRead(createPayment.lambda);

    const createPaymentGuest = new LambdaAppSyncOperationConstruct(
      this,
      'CreatePaymentGuestResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createPaymentGuest',
        timeout: Duration.minutes(5),
        environmentVars: {
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          TABLE_PAYMENT: props.paymentTable.tableName,
          //TABLE_PAYMENT_METHODS: props.paymentMethodTable.tableName,
          MIXPANEL_TOKEN: mixpanelToken,
          ENV: env,
          ZAI_DOMAIN: zaiDomain,
          ZAI_TOKEN_DOMAIN: zaiTokenDomain,
          ZAI_CLIENT_ID: zaiClientId,
          ZAI_CLIENT_SCOPE: zaiClientScope,
        },
      }
    );

    props.contactsTable.grantReadData(createPaymentGuest.lambda);
    props.entityTable.grantReadData(createPaymentGuest.lambda);
    props.taskTable.grantReadWriteData(createPaymentGuest.lambda);
    props.paymentTable.grantWriteData(createPaymentGuest.lambda);
    //props.paymentMethodTable.grantReadData(createPaymentGuest.lambda);
    props.zaiSecrets.grantRead(createPaymentGuest.lambda);

    const createPaymentScheduledGuest = new LambdaAppSyncOperationConstruct(
      this,
      'CreatePaymentScheduledGuestResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createPaymentScheduledGuest',
        timeout: Duration.minutes(5),
        environmentVars: {
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          TABLE_PAYMENT: props.paymentTable.tableName,
          MIXPANEL_TOKEN: mixpanelToken,
          ENV: env,
          ZAI_DOMAIN: zaiDomain,
          ZAI_TOKEN_DOMAIN: zaiTokenDomain,
          ZAI_CLIENT_ID: zaiClientId,
          ZAI_CLIENT_SCOPE: zaiClientScope,
        },
      }
    );

    props.contactsTable.grantReadData(createPaymentScheduledGuest.lambda);
    props.entityTable.grantReadData(createPaymentScheduledGuest.lambda);
    props.taskTable.grantReadWriteData(createPaymentScheduledGuest.lambda);
    props.paymentTable.grantReadWriteData(createPaymentScheduledGuest.lambda);
    props.zaiSecrets.grantRead(createPaymentScheduledGuest.lambda);

    // retry payment
    const retryPayment = new LambdaAppSyncOperationConstruct(
      this,
      'RetryPaymentResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'retryPayment',
        timeout: Duration.minutes(5),
        environmentVars: {
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_PAYMENT: props.paymentTable.tableName,
          TABLE_PAYMENT_METHODS: props.paymentMethodTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          MIXPANEL_TOKEN: mixpanelToken,
          ENV: env,
          ZAI_DOMAIN: zaiDomain,
          ZAI_TOKEN_DOMAIN: zaiTokenDomain,
          ZAI_CLIENT_ID: zaiClientId,
          ZAI_CLIENT_SCOPE: zaiClientScope,
        },
      }
    );

    props.contactsTable.grantReadData(retryPayment.lambda);
    props.entityTable.grantReadData(retryPayment.lambda);
    props.entityUserTable.grantReadData(retryPayment.lambda);
    props.paymentTable.grantReadWriteData(retryPayment.lambda);
    props.paymentMethodTable.grantReadData(retryPayment.lambda);
    props.taskTable.grantReadWriteData(retryPayment.lambda);
    props.zaiSecrets.grantRead(retryPayment.lambda);

    // create task payment
    const createTaskPayment = new LambdaAppSyncOperationConstruct(
      this,
      'CreateTaskPaymentResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createTaskPayment',
        timeout: Duration.minutes(5),
        environmentVars: {
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          TABLE_PAYMENT: props.paymentTable.tableName,
          TABLE_PAYMENT_METHODS: props.paymentMethodTable.tableName,
          MIXPANEL_TOKEN: mixpanelToken,
          ENV: env,
          ZAI_DOMAIN: zaiDomain,
          ZAI_TOKEN_DOMAIN: zaiTokenDomain,
          ZAI_CLIENT_ID: zaiClientId,
          ZAI_CLIENT_SCOPE: zaiClientScope,
        },
      }
    );

    props.contactsTable.grantReadData(createTaskPayment.lambda);
    props.entityTable.grantReadData(createTaskPayment.lambda);
    props.entityUserTable.grantReadData(createTaskPayment.lambda);
    props.taskTable.grantReadWriteData(createTaskPayment.lambda);
    props.paymentTable.grantReadWriteData(createTaskPayment.lambda);
    props.paymentMethodTable.grantReadData(createTaskPayment.lambda);
    props.zaiSecrets.grantRead(createTaskPayment.lambda);

    new JsResolverConstruct(this, 'TaskPaymentsResolver', {
      api: props.appSyncApi,
      dataSource: props.paymentDS,
      typeName: 'Task',
      fieldName: 'payments',
      pathName: 'Task.payments',
    });

    // get entity payid details
    const getEntityPayId = new LambdaAppSyncOperationConstruct(
      this,
      'GetEntityPayIdResolver',
      {
        api: props.appSyncApi,
        typeName: 'Query',
        fieldName: 'getEntityPayId',
        environmentVars: {
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_PAYMENT: props.paymentTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          MIXPANEL_TOKEN: mixpanelToken,
          ENV: env,
          ZAI_DOMAIN: zaiDomain,
          ZAI_TOKEN_DOMAIN: zaiTokenDomain,
          ZAI_CLIENT_ID: zaiClientId,
          ZAI_CLIENT_SCOPE: zaiClientScope,
        },
      }
    );

    props.entityTable.grantReadData(getEntityPayId.lambda);
    props.entityUserTable.grantReadData(getEntityPayId.lambda);
    props.paymentTable.grantReadData(getEntityPayId.lambda);
    props.taskTable.grantReadData(getEntityPayId.lambda);
    props.zaiSecrets.grantRead(getEntityPayId.lambda);

    // create payment payid
    //const createPaymentPayId = new LambdaAppSyncOperationConstruct(
    //  this,
    //  'CreatePaymentPayIdResolver',
    //  {
    //    api,
    //    typeName: 'Mutation',
    //    fieldName: 'createPaymentPayId',
    //    environmentVars: {
    //      TABLE_CONTACT: props.contactsTable.tableName,
    //      TABLE_ENTITY: props.entityTable.tableName,
    //      TABLE_ENTITY_USER: props.entityUserTable.tableName,
    //      TABLE_PAY_IN_PAYMENTS: payInPaymentsTable.tableName,
    //      TABLE_PAYMENT: props.paymentTable.tableName,
    //      TABLE_PAYMENT_METHODS: props.paymentMethodTable.tableName,
    //      TABLE_TASK: props.taskTable.tableName,
    //      TABLE_USER: props.userTable.tableName,
    //      MIXPANEL_TOKEN: mixpanelToken,
    //      ENV,
    //      ZAI_DOMAIN: zaiDomain,
    //      ZAI_TOKEN_DOMAIN: zaiTokenDomain,
    //      ZAI_CLIENT_ID: zaiClientId,
    //      ZAI_CLIENT_SCOPE: zaiClientScope,
    //    },
    //  }
    //);
    //
    //props.contactsTable.grantReadData(createPaymentPayId.lambda);
    //props.entityTable.grantReadData(createPaymentPayId.lambda);
    //props.entityUserTable.grantReadData(createPaymentPayId.lambda);
    //payInPaymentsTable.grantReadWriteData(createPaymentPayId.lambda);
    //props.paymentTable.grantReadWriteData(createPaymentPayId.lambda);
    //props.paymentMethodTable.grantReadWriteData(createPaymentPayId.lambda);
    //props.taskTable.grantReadWriteData(createPaymentPayId.lambda);
    //props.userTable.grantReadData(createPaymentPayId.lambda);
    //zaiSecrets.grantRead(createPaymentPayId.lambda);

    //const cancelPaymentPayId = new LambdaAppSyncOperationConstruct(
    //  this,
    //  'CancelPaymentPayIdResolver',
    //  {
    //    api,
    //    typeName: 'Mutation',
    //    fieldName: 'cancelPaymentPayId',
    //    environmentVars: {
    //      TABLE_ENTITY_USER: props.entityUserTable.tableName,
    //      TABLE_PAYMENT: props.paymentTable.tableName,
    //      TABLE_TASK: props.taskTable.tableName,
    //      MIXPANEL_TOKEN: mixpanelToken,
    //    },
    //  }
    //);
    //props.entityUserTable.grantReadData(cancelPaymentPayId.lambda);
    //props.paymentTable.grantReadWriteData(cancelPaymentPayId.lambda);
    //props.taskTable.grantReadWriteData(cancelPaymentPayId.lambda);
    //zaiSecrets.grantRead(cancelPaymentPayId.lambda);

    // update paymentMethod
    new JsResolverConstruct(this, 'UpdatePaymentMethodResolver', {
      api: props.appSyncApi,
      dataSource: props.paymentMethodTableDS,
      typeName: 'Mutation',
      fieldName: 'updatePaymentMethod',
      pathName: 'Mutation.updatePaymentMethod',
    });

    // create payment method
    const createPaymentMethod = new LambdaAppSyncOperationConstruct(
      this,
      'CreatePaymentMethodResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createPaymentMethod',
        timeout: Duration.minutes(5),
        environmentVars: {
          MIXPANEL_TOKEN: mixpanelToken,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_PAYMENT_METHODS: props.paymentMethodTable.tableName,
          ENV: env,
          ZAI_TOKEN_DOMAIN: zaiTokenDomain,
          ZAI_CLIENT_ID: zaiClientId,
          ZAI_DOMAIN: zaiDomain,
          ZAI_CLIENT_SCOPE: zaiClientScope,
        },
      }
    );

    props.entityTable.grantReadWriteData(createPaymentMethod.lambda);
    props.entityUserTable.grantReadData(createPaymentMethod.lambda);
    props.paymentMethodTable.grantWriteData(createPaymentMethod.lambda);
    props.zaiSecrets.grantRead(createPaymentMethod.lambda);

    // PAY TO AGREEMENTS
    // pay to agreement stream
    //const payToAgreementStreamFunc = new NodejsFunction(
    //  this,
    //  'PayToAgreementStreamFunction',
    //  {
    //    ...getLambdaDefaultProps(this, 'streamPayToAgreement'),
    //    environment: {
    //      TABLE_PAYMENT: props.paymentTable.tableName,
    //      TABLE_PAYTO_AGREEMENT: paytoAgreementsTable.tableName,
    //      TABLE_PAYMENT_METHODS: props.paymentMethodTable.tableName,
    //      TABLE_TASK: props.taskTable.tableName,
    //      ENV,
    //      ZAI_DOMAIN: zaiDomain,
    //      ZAI_WEBHOOK_DOMAIN: zaiWebhookDomain,
    //      ZAI_TOKEN_DOMAIN: zaiTokenDomain,
    //      ZAI_CLIENT_ID: zaiClientId,
    //      ZAI_CLIENT_SCOPE: zaiClientScope,
    //    },
    //  }
    //);
    //
    //payToAgreementStreamFunc.addEventSource(
    //  new DynamoEventSource(paytoAgreementsTable, {
    //    startingPosition: StartingPosition.TRIM_HORIZON,
    //  })
    //);
    //
    //props.paymentTable.grantReadWriteData(payToAgreementStreamFunc);
    //props.paymentMethodTable.grantReadWriteData(payToAgreementStreamFunc);
    //paytoAgreementsTable.grantReadWriteData(payToAgreementStreamFunc);
    //props.taskTable.grantReadWriteData(payToAgreementStreamFunc);
    //zaiSecrets.grantRead(payToAgreementStreamFunc);

    // ZAI
    // zai webhook handler function
    const zaiWebhookHandlerFunc = new NodejsFunction(
      this,
      'ZaiWebhookHandlerFunction',
      {
        ...getLambdaDefaultProps(this, 'zaiWebhookHandler'),
        timeout: Duration.minutes(15),
        environment: {
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_INCREMENT: props.incrementTable.tableName,
          TABLE_PAY_IN_PAYMENTS: props.payInPaymentsTable.tableName,
          //TABLE_PAYTO_AGREEMENT: props.paytoAgreementsTable.tableName,
          TABLE_PAYMENT_ACCOUNT: props.paymentAccountTable.tableName,
          TABLE_PAYMENT: props.paymentTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          TABLE_TRANSACTION: props.transactionTable.tableName,
          TABLE_USER: props.userTable.tableName,
          TABLE_ACTIVITY: props.activityTable.tableName,
          TABLE_REFERRAL: props.referralTable.tableName,
          ENV: env,
          ZAI_DOMAIN: zaiDomain,
          ZAI_TOKEN_DOMAIN: zaiTokenDomain,
          ZAI_CLIENT_ID: zaiClientId,
          ZAI_CLIENT_SCOPE: zaiClientScope,
          API_GRAPHQLAPIENDPOINT: props.graphqlUrl,
          FROM_EMAIL: fromEmail,
          WEB_DOMAIN: `https://${webDomainName}`, //TODO: combine email template vars into one object to destructure
          MEDIA_URL: mediaUrl,
          TEMPLATE_ARN: `arn:aws:mobiletargeting:${this.region}:${this.account}:templates`,
        },
      }
    );
    props.contactsTable.grantReadData(zaiWebhookHandlerFunc);
    props.entityTable.grantReadWriteData(zaiWebhookHandlerFunc);
    props.entityUserTable.grantReadWriteData(zaiWebhookHandlerFunc);
    props.incrementTable.grantReadWriteData(zaiWebhookHandlerFunc);
    props.payInPaymentsTable.grantReadWriteData(zaiWebhookHandlerFunc);
    //props.paytoAgreementsTable.grantReadWriteData(zaiWebhookHandlerFunc);
    props.paymentAccountTable.grantReadWriteData(zaiWebhookHandlerFunc);
    props.paymentTable.grantReadWriteData(zaiWebhookHandlerFunc);
    props.taskTable.grantReadWriteData(zaiWebhookHandlerFunc);
    props.transactionTable.grantReadWriteData(zaiWebhookHandlerFunc);
    props.userTable.grantReadData(zaiWebhookHandlerFunc);
    props.zaiSecrets.grantRead(zaiWebhookHandlerFunc);
    zaiWebhookHandlerFunc.role?.attachInlinePolicy(
      new Policy(this, 'AppSyncInvokeZaiWebhookHandlerPolicy', {
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

    zaiWebhookHandlerFunc.role?.attachInlinePolicy(
      new Policy(this, 'SendEmailZaiWebhookHandelrCronPolicy', {
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
      })
    );

    // zai webhook listener function
    const zaiWebhookListenerFunc = new NodejsFunction(
      this,
      'ZaiWebhookListenerFunction',
      {
        ...getLambdaDefaultProps(this, 'zaiWebhookListener'),
        timeout: Duration.minutes(15),
        environment: {
          FUNCTION_ZAIWEBHOOKHANDLER: zaiWebhookHandlerFunc.functionName,
          ENV: env,
          ZAI_WEBHOOK_DOMAIN: zaiWebhookDomain,
          ZAI_TOKEN_DOMAIN: zaiTokenDomain,
          ZAI_CLIENT_ID: zaiClientId,
          ZAI_CLIENT_SCOPE: zaiClientScope,
        },
      }
    );

    const zaiIntegration = new LambdaIntegration(zaiWebhookListenerFunc);
    const zaiWebhookEndpoint = props.restApi.root.addResource('webhook-zai'); //TODO: obfuscation of webhook endpoint
    zaiWebhookEndpoint.addMethod('POST', zaiIntegration, {
      authorizationType: RESTAuthorizationType.NONE,
    });

    // create zai payment method token
    const createZaiPaymentMethod = new LambdaAppSyncOperationConstruct(
      this,
      'CreatePaymentMethodTokenMutation',
      {
        api: props.appSyncApi,
        fieldName: 'createPaymentMethodToken',
        typeName: 'Mutation',
        timeout: Duration.minutes(5),
        environmentVars: {
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          TABLE_USER: props.userTable.tableName,
          ZAI_DOMAIN: zaiDomain,
          ZAI_TOKEN_DOMAIN: zaiTokenDomain,
          ZAI_CLIENT_ID: zaiClientId,
          ZAI_CLIENT_SCOPE: zaiClientScope,
          ENV: env,
        },
      }
    );
    props.contactsTable.grantReadData(createZaiPaymentMethod.lambda);
    props.entityTable.grantReadData(createZaiPaymentMethod.lambda);
    props.entityUserTable.grantReadData(createZaiPaymentMethod.lambda);
    props.taskTable.grantReadData(createZaiPaymentMethod.lambda);
    props.userTable.grantReadData(createZaiPaymentMethod.lambda);
    props.zaiSecrets.grantRead(createZaiPaymentMethod.lambda);

    // validate Pay To agreement
    //const validatePayToAgreement = new LambdaAppSyncOperationConstruct(
    //  this,
    //  'ZaiValidatePayToAgreementMutation',
    //  {
    //    api,
    //    fieldName: 'validatePayToAgreement',
    //    typeName: 'Mutation',
    //    environmentVars: {
    //      TABLE_ENTITY: props.entityTable.tableName,
    //      TABLE_ENTITY_USER: props.entityUserTable.tableName,
    //      TABLE_TASK: props.taskTable.tableName,
    //      TABLE_PAYTO_AGREEMENT: paytoAgreementsTable.tableName,
    //      ZAI_DOMAIN: zaiDomain,
    //      ZAI_WEBHOOK_DOMAIN: zaiWebhookDomain,
    //      ZAI_TOKEN_DOMAIN: zaiTokenDomain,
    //      ZAI_CLIENT_ID: zaiClientId,
    //      ZAI_CLIENT_SCOPE: zaiClientScope,
    //      ENV: env,
    //    },
    //  }
    //);
    //
    //props.entityTable.grantReadData(validatePayToAgreement.lambda);
    //props.entityUserTable.grantReadData(validatePayToAgreement.lambda);
    //props.taskTable.grantReadWriteData(validatePayToAgreement.lambda);
    //paytoAgreementsTable.grantReadWriteData(validatePayToAgreement.lambda);
    //zaiSecrets.grantRead(validatePayToAgreement.lambda);

    // get PayTo agreement
    //const getPayToAgreement = new LambdaAppSyncOperationConstruct(
    //  this,
    //  'GetUpdatePayToAgreementMutation',
    //  {
    //    api,
    //    fieldName: 'getUpdatePayToAgreement',
    //    typeName: 'Mutation',
    //    environmentVars: {
    //      TABLE_ENTITY: props.entityTable.tableName,
    //      TABLE_ENTITY_USER: props.entityUserTable.tableName,
    //      TABLE_PAYTO_AGREEMENT: paytoAgreementsTable.tableName,
    //      ZAI_DOMAIN: zaiDomain,
    //      ZAI_WEBHOOK_DOMAIN: zaiWebhookDomain,
    //      ZAI_TOKEN_DOMAIN: zaiTokenDomain,
    //      ZAI_CLIENT_ID: zaiClientId,
    //      ZAI_CLIENT_SCOPE: zaiClientScope,
    //      ENV: env,
    //    },
    //  }
    //);
    //
    //props.entityTable.grantReadData(getPayToAgreement.lambda);
    //props.entityUserTable.grantReadData(getPayToAgreement.lambda);
    //paytoAgreementsTable.grantReadWriteData(getPayToAgreement.lambda);
    //zaiSecrets.grantRead(getPayToAgreement.lambda);

    // create PayTo agreement
    //const createPayToAgreement = new LambdaAppSyncOperationConstruct(
    //  this,
    //  'CreatePayToAgreementMutation',
    //  {
    //    api,
    //    fieldName: 'createPayToAgreement',
    //    typeName: 'Mutation',
    //    environmentVars: {
    //      TABLE_CONTACT: props.contactsTable.tableName,
    //      TABLE_ENTITY: props.entityTable.tableName,
    //      TABLE_ENTITY_USER: props.entityUserTable.tableName,
    //      TABLE_PAYMENT: props.paymentTable.tableName,
    //      TABLE_PAYTO_AGREEMENT: paytoAgreementsTable.tableName,
    //      TABLE_TASK: props.taskTable.tableName,
    //      ZAI_DOMAIN: zaiDomain,
    //      ZAI_WEBHOOK_DOMAIN: zaiWebhookDomain,
    //      ZAI_TOKEN_DOMAIN: zaiTokenDomain,
    //      ZAI_CLIENT_ID: zaiClientId,
    //      ZAI_CLIENT_SCOPE: zaiClientScope,
    //      ENV: env,
    //    },
    //  }
    //);

    //props.contactsTable.grantReadData(createPayToAgreement.lambda);
    //props.entityTable.grantReadData(createPayToAgreement.lambda);
    //props.entityUserTable.grantReadData(createPayToAgreement.lambda);
    //props.paymentTable.grantReadWriteData(createPayToAgreement.lambda);
    //paytoAgreementsTable.grantReadWriteData(createPayToAgreement.lambda);
    //props.taskTable.grantReadWriteData(createPayToAgreement.lambda);
    //zaiSecrets.grantRead(createPayToAgreement.lambda);

    // get failed pay to payment
    //const getPayToFailedPayment = new LambdaAppSyncOperationConstruct(
    //  this,
    //  'GetPayToFailedPaymentQuery',
    //  {
    //    api,
    //    fieldName: 'getPayToFailedPayment',
    //    typeName: 'Query',
    //    environmentVars: {
    //      ZAI_DOMAIN: zaiDomain,
    //      ZAI_WEBHOOK_DOMAIN: zaiWebhookDomain,
    //      ZAI_TOKEN_DOMAIN: zaiTokenDomain,
    //      ZAI_CLIENT_ID: zaiClientId,
    //      ZAI_CLIENT_SCOPE: zaiClientScope,
    //      ENV: env,
    //    },
    //  }
    //);

    //zaiSecrets.grantRead(getPayToFailedPayment.lambda);

    // initiate pay to payment
    //const initiatePayToPayment = new LambdaAppSyncOperationConstruct(
    //  this,
    //  'InitiatePayToPaymentMutation',
    //  {
    //    api,
    //    fieldName: 'initiatePayToPayment',
    //    typeName: 'Mutation',
    //    environmentVars: {
    //      TABLE_ENTITY_USER: props.entityUserTable.tableName,
    //      TABLE_PAYMENT: props.paymentTable.tableName,
    //      TABLE_PAYTO_AGREEMENT: paytoAgreementsTable.tableName,
    //      ZAI_DOMAIN: zaiDomain,
    //      ZAI_WEBHOOK_DOMAIN: zaiWebhookDomain,
    //      ZAI_TOKEN_DOMAIN: zaiTokenDomain,
    //      ZAI_CLIENT_ID: zaiClientId,
    //      ZAI_CLIENT_SCOPE: zaiClientScope,
    //      ENV: env,
    //    },
    //  }
    //);
    //
    //zaiSecrets.grantRead(initiatePayToPayment.lambda);
  }
}
