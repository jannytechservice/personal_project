import { Duration, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import {
  DynamoDbDataSource,
  IGraphqlApi,
  NoneDataSource,
} from 'aws-cdk-lib/aws-appsync';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import {
  Effect,
  IRole,
  Policy,
  PolicyStatement,
  ServicePrincipal,
  Role,
} from 'aws-cdk-lib/aws-iam';
import { StartingPosition } from 'aws-cdk-lib/aws-lambda';
import {
  DynamoEventSource,
  SqsEventSource,
} from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { IDomain } from 'aws-cdk-lib/aws-opensearchservice';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Topic } from 'aws-cdk-lib/aws-sns';
import {
  LambdaSubscription,
  SqsSubscription,
} from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { JsPipelineResolverConstruct } from '../constructs/jsPipelineResolverConstruct';
import { JsResolverConstruct } from '../constructs/jsResolverConstruct';
import { LambdaAppSyncOperationConstruct } from '../constructs/lambdaAppSyncOperationConstruct';
import { getLambdaDefaultProps, setResourceName } from '../helpers';
import { CfnReceiptRule, CfnReceiptRuleSet } from 'aws-cdk-lib/aws-ses';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import {
  env,
  fromEmail,
  mediaUrl,
  ocrEmailDomain,
  webDomainName,
  region,
  mixpanelToken,
  xeroClientId,
  xeroClientSecret,
} from '../helpers/constants';

interface TaskServiceStackProps extends NestedStackProps {
  appSyncApi: IGraphqlApi;
  unauthenticatedRole: IRole;
  activityTable: ITable;
  contactsTable: ITable;
  documentAnalysisTable: ITable;
  entityTable: ITable;
  entityUserTable: ITable;
  hashTable: ITable;
  graphqlUrl: string;
  jobTable: ITable;
  notificationTable: ITable;
  serviceDS: DynamoDbDataSource;
  serviceTable: ITable;
  taskTable: ITable;
  xeroTokenTable: ITable;
  taskNumIncrementTable: ITable;
  templateDS: DynamoDbDataSource;
  templateTable: ITable;
  templateServiceDS: DynamoDbDataSource;
  userTable: ITable;
  s3mediaBucket: IBucket;
  s3OcrEmailBucket: IBucket;
  activityDS: DynamoDbDataSource;
  entityUserDS: DynamoDbDataSource;
  documentAnalysisDS: DynamoDbDataSource;
  taskDS: DynamoDbDataSource;
  entityDS: DynamoDbDataSource;
  contactsDS: DynamoDbDataSource;
  referralTable: ITable;
  openSearchDomain: IDomain;
  userPool: IUserPool;
  pinpointAppId: string;
  noDS: NoneDataSource;
}

export class TaskServiceStack extends NestedStack {
  constructor(scope: Construct, id: string, props: TaskServiceStackProps) {
    super(scope, id, props);

    // task stream
    const taskStreamFunc = new NodejsFunction(this, 'TaskStreamFunction', {
      ...getLambdaDefaultProps(this, 'streamTask'),
      environment: {
        ENV: env,
        FROM_EMAIL: fromEmail,
        REGION: this.region,
        XERO_CLIENT_ID: xeroClientId,
        XERO_CLIENT_SECRET: xeroClientSecret,
        PINPOINT_APP_ID: props.pinpointAppId,
        TABLE_ACTIVITY: props.activityTable.tableName,
        TABLE_CONTACT: props.contactsTable.tableName,
        TABLE_ENTITY: props.entityTable.tableName,
        TABLE_ENTITY_USER: props.entityUserTable.tableName,
        TABLE_HASH: props.hashTable.tableName,
        TABLE_USER: props.userTable.tableName,
        TABLE_XERO_TOKEN: props.xeroTokenTable.tableName,
        TABLE_REFERRAL: props.referralTable.tableName,
        WEB_DOMAIN: `https://${webDomainName}`, //TODO: combine email template vars into one object to destructure
        MEDIA_URL: mediaUrl,
        TEMPLATE_ARN: `arn:aws:mobiletargeting:${this.region}:${this.account}:templates`,
      },
    });

    taskStreamFunc.addEventSource(
      new DynamoEventSource(props.taskTable, {
        startingPosition: StartingPosition.TRIM_HORIZON,
      })
    );
    props.activityTable.grantReadWriteData(taskStreamFunc);
    props.entityTable.grantReadWriteData(taskStreamFunc);
    props.entityUserTable.grantReadWriteData(taskStreamFunc);
    props.hashTable.grantReadWriteData(taskStreamFunc);
    props.userTable.grantReadWriteData(taskStreamFunc);
    props.referralTable.grantReadWriteData(taskStreamFunc);
    props.xeroTokenTable.grantReadWriteData(taskStreamFunc);
    props.contactsTable.grantReadData(taskStreamFunc);

    taskStreamFunc.role?.attachInlinePolicy(
      new Policy(this, 'TaskStreamSendEmailPolicy', {
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
              'ses:SendTemplatedEmail',
              'mobiletargeting:GetEmailTemplate',
              'ses:SendTemplatedEmail',
              'mobiletargeting:*',
            ],
            resources: [
              `arn:aws:ses:${this.region}:${this.account}:identity/*`,
              `arn:aws:mobiletargeting:${this.region}:${this.account}:templates/*`,
              `arn:aws:ses:${this.region}:${this.account}:configuration-set/*`,
              `arn:aws:mobiletargeting:${this.region}:${this.account}:apps/${props.pinpointAppId}/*`,
            ],
          }),
        ],
      })
    );

    const taskReminderCronFunc = new NodejsFunction(
      this,
      'TaskReminderCronFunction',
      {
        ...getLambdaDefaultProps(this, 'cronTaskReminder'),
        environment: {
          ENV: env,
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_HASH: props.hashTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          TABLE_USER: props.userTable.tableName,
          FROM_EMAIL: fromEmail,
          WEB_DOMAIN: `https://${webDomainName}`, //TODO: combine email template vars into one object to destructure
          MEDIA_URL: mediaUrl,
          TEMPLATE_ARN: `arn:aws:mobiletargeting:${this.region}:${this.account}:templates`,
        },
      }
    );

    props.contactsTable.grantReadData(taskReminderCronFunc);
    props.entityTable.grantReadData(taskReminderCronFunc);
    props.entityUserTable.grantReadData(taskReminderCronFunc);
    props.hashTable.grantReadWriteData(taskReminderCronFunc);
    props.userTable.grantReadData(taskReminderCronFunc);
    props.taskTable.grantReadData(taskReminderCronFunc);

    taskReminderCronFunc.role?.attachInlinePolicy(
      new Policy(this, 'SendEmailTaskReminderConfirmationCronPolicy', {
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

    // cron rule and target
    const taskReminderCronRule = new Rule(this, 'TaskReminderCronRule', {
      schedule: Schedule.cron({ hour: '5', minute: '0' }),
    });
    taskReminderCronRule.addTarget(new LambdaFunction(taskReminderCronFunc));

    //xero invoice sync
    // xero create invoice sync
    const xeroInvoiceSyncQueue = new Queue(this, 'XeroInvoiceSyncQueue', {
      queueName: setResourceName('XeroInvoiceSyncQueue'),
      visibilityTimeout: Duration.minutes(15),
    });
    const xeroCreateInvoiceSyncFunc = new LambdaAppSyncOperationConstruct(
      this,
      'XeroCreateInvoiceSyncResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'xeroCreateInvoiceSync',
        environmentVars: {
          AUTH_USERPOOLID: props.userPool.userPoolId,
          SQS_QUEUE_URL: xeroInvoiceSyncQueue.queueUrl,
          MIXPANEL_TOKEN: mixpanelToken,
          REGION: region,
          ENV: env,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
        },
      }
    );
    props.entityTable.grantReadWriteData(xeroCreateInvoiceSyncFunc.lambda);
    props.entityUserTable.grantReadData(xeroCreateInvoiceSyncFunc.lambda);
    xeroInvoiceSyncQueue.grantSendMessages(xeroCreateInvoiceSyncFunc.lambda);

    // xero process invoice sync
    const xeroProcessInvoiceSync = new NodejsFunction(
      this,
      'XeroProcessInvoiceSyncFunc',
      {
        ...getLambdaDefaultProps(this, 'xeroProcessInvoiceSync'),
        timeout: Duration.minutes(15),
        environment: {
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_USER: props.userTable.tableName,
          TABLE_XERO_TOKEN: props.xeroTokenTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          API_GRAPHQLAPIENDPOINT: props.graphqlUrl,
          SQS_QUEUE_URL: xeroInvoiceSyncQueue.queueUrl,
          MIXPANEL_TOKEN: mixpanelToken,
          REGION: region,
          ENV: env,
          XERO_CLIENT_ID: xeroClientId,
          XERO_CLIENT_SECRET: xeroClientSecret,
          AUTH_USERPOOLID: props.userPool.userPoolId,
        },
      }
    );
    props.xeroTokenTable.grantReadWriteData(xeroProcessInvoiceSync);
    props.userTable.grantReadWriteData(xeroProcessInvoiceSync);
    props.entityTable.grantReadWriteData(xeroProcessInvoiceSync);
    props.taskTable.grantReadWriteData(xeroProcessInvoiceSync);

    xeroProcessInvoiceSync.role?.attachInlinePolicy(
      new Policy(this, 'AppSyncInvokeXeroProcessInvoiceSyncPolicy', {
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
    xeroInvoiceSyncQueue.grantConsumeMessages(xeroProcessInvoiceSync);
    const xeroInvoiceSyncEventSource = new SqsEventSource(
      xeroInvoiceSyncQueue,
      {
        batchSize: 1,
      }
    );
    xeroProcessInvoiceSync.addEventSource(xeroInvoiceSyncEventSource);

    // task activity
    new JsResolverConstruct(this, 'TaskActivityResolver', {
      api: props.appSyncApi,
      dataSource: props.activityDS,
      typeName: 'Task',
      fieldName: 'activity',
      pathName: 'Task.activity',
    });

    // get task
    new JsPipelineResolverConstruct(this, 'GetTaskResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.taskDS],
      typeName: 'Query',
      fieldName: 'getTask',
      pathName: 'Query.getTask',
    });

    //new JsPipelineResolverConstruct(this, 'GetTaskGuestResolver', {
    //  api: props.appSyncApi,
    //  dataSources: [props.taskDS],
    //  typeName: 'Query',
    //  fieldName: 'getTaskGuest',
    //  pathName: 'Query.getTaskGuest',
    //});

    // get task guest function resolver lambda
    const getTaskPublic = new LambdaAppSyncOperationConstruct(
      this,
      'GetTaskPublicFuncResolver',
      {
        api: props.appSyncApi,
        typeName: 'Query',
        fieldName: 'getTaskPublic',
        environmentVars: {
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_HASH: props.hashTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
        },
      }
    );

    props.contactsTable.grantReadData(getTaskPublic.lambda);
    props.entityTable.grantReadData(getTaskPublic.lambda);
    props.hashTable.grantReadData(getTaskPublic.lambda);
    props.taskTable.grantReadData(getTaskPublic.lambda);

    const createTask = new LambdaAppSyncOperationConstruct(
      this,
      'CreateTaskResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createTask',
        timeout: Duration.minutes(2),
        environmentVars: {
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          TABLE_TASK_NUM_INCREMENT: props.taskNumIncrementTable.tableName,
        },
      }
    );

    props.taskNumIncrementTable.grantReadWriteData(createTask.lambda);
    props.contactsTable.grantReadData(createTask.lambda);
    props.entityTable.grantReadData(createTask.lambda);
    props.entityUserTable.grantReadData(createTask.lambda);
    props.taskTable.grantWriteData(createTask.lambda);

    const getTaskNumberFunc = new LambdaAppSyncOperationConstruct(
      this,
      'GetTaskNumberResolver',
      {
        api: props.appSyncApi,
        typeName: 'Query',
        fieldName: 'getTaskNumber',
        environmentVars: {
          ENV: env,
          TABLE_TASK_NUM_INCREMENT: props.taskNumIncrementTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          AUTH_USERPOOLID: props.userPool.userPoolId,
        },
      }
    );
    props.taskNumIncrementTable.grantReadData(getTaskNumberFunc.lambda);
    props.entityUserTable.grantReadData(getTaskNumberFunc.lambda);

    // update task
    const updateTask = new LambdaAppSyncOperationConstruct(
      this,
      'UpdateTaskResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'updateTask',
        timeout: Duration.minutes(2),
        environmentVars: {
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
        },
      }
    );

    props.contactsTable.grantReadData(updateTask.lambda);
    props.entityTable.grantReadData(updateTask.lambda);
    props.entityUserTable.grantReadData(updateTask.lambda);
    props.taskTable.grantReadWriteData(updateTask.lambda);

    const updateTaskGuest = new LambdaAppSyncOperationConstruct(
      this,
      'UpdateTaskGuestResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'updateTaskGuest',
        environmentVars: {
          TABLE_TASK: props.taskTable.tableName,
        },
      }
    );

    props.taskTable.grantReadWriteData(updateTaskGuest.lambda);

    // update task public
    const updateTaskPublic = new LambdaAppSyncOperationConstruct(
      this,
      'UpdateTaskPublicResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'updateTaskPublic',
        environmentVars: {
          TABLE_HASH: props.hashTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
        },
      }
    );

    props.hashTable.grantReadData(updateTaskPublic.lambda);
    props.taskTable.grantReadWriteData(updateTaskPublic.lambda);

    // list tasks by entity from and search status
    new JsPipelineResolverConstruct(this, 'TasksByEntityFromResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.taskDS],
      typeName: 'Query',
      fieldName: 'tasksByEntityFrom',
      pathName: 'Query.tasksByEntityFrom',
    });

    // list tasks by entity to and search status
    new JsPipelineResolverConstruct(this, 'TasksByEntityToResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.taskDS],
      typeName: 'Query',
      fieldName: 'tasksByEntityTo',
      pathName: 'Query.tasksByEntityTo',
    });

    // list tasks by entity by
    new JsPipelineResolverConstruct(this, 'TasksByEntityByResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.taskDS],
      typeName: 'Query',
      fieldName: 'tasksByEntityBy',
      pathName: 'Query.tasksByEntityBy',
    });

    // tasksByEntityByIdContactId
    new JsPipelineResolverConstruct(
      this,
      'TasksByEntityByIdContactIdResolver',
      {
        api: props.appSyncApi,
        dataSources: [props.entityUserDS, props.taskDS],
        typeName: 'Query',
        fieldName: 'tasksByEntityByIdContactId',
        pathName: 'Query.tasksByEntityByIdContactId',
      }
    );

    // tasks by search name
    new JsPipelineResolverConstruct(this, 'TasksBySearchNameResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.taskDS],
      typeName: 'Query',
      fieldName: 'searchTasks',
      pathName: 'Query.tasksBySearchName',
    });

    // TASKS GUEST
    new JsResolverConstruct(this, 'TaskGuestFromEntityResolver', {
      api: props.appSyncApi,
      dataSource: props.entityDS,
      typeName: 'TaskGuest',
      fieldName: 'fromEntity',
      pathName: 'TaskGuest.fromEntity',
    });

    // from contact
    new JsResolverConstruct(this, 'TaskGuestFromContactResolver', {
      api: props.appSyncApi,
      dataSource: props.contactsDS,
      typeName: 'TaskGuest',
      fieldName: 'fromContact',
      pathName: 'TaskGuest.fromContact',
    });

    new JsResolverConstruct(this, 'TaskGuestToEntityResolver', {
      api: props.appSyncApi,
      dataSource: props.entityDS,
      typeName: 'TaskGuest',
      fieldName: 'toEntity',
      pathName: 'TaskGuest.toEntity',
    });

    new JsResolverConstruct(this, 'TaskGuestToContactResolver', {
      api: props.appSyncApi,
      dataSource: props.contactsDS,
      typeName: 'TaskGuest',
      fieldName: 'toContact',
      pathName: 'TaskGuest.toContact',
    });

    // TASK DOCUMENT URL
    // task presigned document url from lambda
    const createTaskDocumentUrl = new LambdaAppSyncOperationConstruct(
      this,
      'CreateTaskDocumentUrl',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createTaskDocumentUrl',
        environmentVars: {
          STORAGE_BUCKETNAME: props.s3mediaBucket.bucketName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
        },
      }
    );
    props.entityUserTable.grantReadData(createTaskDocumentUrl.lambda);
    props.taskTable.grantReadData(createTaskDocumentUrl.lambda);
    props.s3mediaBucket.grantReadWrite(createTaskDocumentUrl.lambda);

    // TASK DOCUMENT URL GUEST
    // task presigned document url from lambda
    const createTaskDocumentUrlGuest = new LambdaAppSyncOperationConstruct(
      this,
      'CreateTaskDocumentUrlGuest',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createTaskDocumentUrlGuest',
        environmentVars: {
          STORAGE_BUCKETNAME: props.s3mediaBucket.bucketName,
          TABLE_TASK: props.taskTable.tableName,
        },
      }
    );
    props.taskTable.grantReadWriteData(createTaskDocumentUrlGuest.lambda); // Review: Currently write required to update task viewed at
    props.s3mediaBucket.grantReadWrite(createTaskDocumentUrlGuest.lambda);

    // SERVICES
    // get service
    new JsResolverConstruct(this, 'GetServiceResolver', {
      api: props.appSyncApi,
      dataSource: props.serviceDS,
      typeName: 'Query',
      fieldName: 'getService',
      pathName: 'Query.getService',
    });

    // services by entity
    new JsPipelineResolverConstruct(this, 'ListServicesByEntityResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.serviceDS],
      typeName: 'Query',
      fieldName: 'servicesByEntity',
      pathName: 'Query.servicesByEntity',
    });

    // create service mutation resolver
    new JsPipelineResolverConstruct(this, 'CreateServiceResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.serviceDS],
      typeName: 'Mutation',
      fieldName: 'createService',
      pathName: 'Mutation.createService',
    });

    // update service mutation resolver
    new JsPipelineResolverConstruct(this, 'UpdateServiceResolver', {
      api: props.appSyncApi,
      dataSources: [props.serviceDS, props.entityUserDS, props.serviceDS],
      typeName: 'Mutation',
      fieldName: 'updateService',
      pathName: 'Mutation.updateService',
    });

    // TEMPLATES
    // templates.services
    new JsResolverConstruct(this, 'TemplateServicesResolver', {
      api: props.appSyncApi,
      dataSource: props.templateServiceDS,
      typeName: 'Template',
      fieldName: 'templateServices',
      pathName: 'Template.templateServices',
    });

    // get template
    new JsPipelineResolverConstruct(this, 'GetTemplateResolver', {
      api: props.appSyncApi,
      dataSources: [props.templateDS, props.entityUserDS],
      typeName: 'Query',
      fieldName: 'getTemplate',
      pathName: 'Query.getTemplate',
    });

    // templates by entity
    new JsPipelineResolverConstruct(this, 'ListTemplatesByEntityResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.templateDS],
      typeName: 'Query',
      fieldName: 'templatesByEntity',
      pathName: 'Query.templatesByEntity',
    });

    // create template mutation resolver
    new JsPipelineResolverConstruct(this, 'CreateTemplateResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.templateDS],
      typeName: 'Mutation',
      fieldName: 'createTemplate',
      pathName: 'Mutation.createTemplate',
    });

    // update template mutation resolver
    new JsPipelineResolverConstruct(this, 'UpdateTemplateResolver', {
      api: props.appSyncApi,
      dataSources: [props.templateDS, props.entityUserDS, props.templateDS],
      typeName: 'Mutation',
      fieldName: 'updateTemplate',
      pathName: 'Mutation.updateTemplate',
    });

    // TEMPLATE SERVICES
    // TemplateService.service
    new JsResolverConstruct(this, 'TemplateServiceServiceResolver', {
      api: props.appSyncApi,
      dataSource: props.serviceDS,
      typeName: 'TemplateService',
      fieldName: 'service',
      pathName: 'TemplateService.service',
    });

    // create template service
    new JsPipelineResolverConstruct(this, 'CreateTemplateServiceResolver', {
      api: props.appSyncApi,
      dataSources: [
        props.templateDS,
        props.entityUserDS,
        props.templateServiceDS,
      ],
      typeName: 'Mutation',
      fieldName: 'createTemplateService',
      pathName: 'Mutation.createTemplateService',
    });

    // delete template service
    new JsPipelineResolverConstruct(this, 'DeleteTemplateServiceResolver', {
      api: props.appSyncApi,
      dataSources: [
        props.templateDS,
        props.entityUserDS,
        props.templateServiceDS,
      ],
      typeName: 'Mutation',
      fieldName: 'deleteTemplateService',
      pathName: 'Mutation.deleteTemplateService',
    });

    // OCR / DOCUMENT ANALYSIS

    // queue
    const documentAnalysisQueue = new Queue(this, 'DocumentAnalysisQueue', {
      queueName: setResourceName('DocumentAnalysisQueue'),
      visibilityTimeout: Duration.minutes(15),
    });

    // topic
    const documentAnalysisTopic = new Topic(this, 'DocumentAnalysisTopic', {
      topicName: setResourceName('DocumentAnalysisTopic'),
      displayName: `Document Analysis Topic ${env}`,
    });

    documentAnalysisTopic.addSubscription(
      new SqsSubscription(documentAnalysisQueue)
    );

    const textractRole = new Role(this, 'TextractRole', {
      assumedBy: new ServicePrincipal('textract.amazonaws.com'),
    });

    // Attach the permissions policy to the role
    textractRole.addToPolicy(
      new PolicyStatement({
        actions: ['s3:GetObject', 'sns:Publish'],
        resources: [
          props.s3mediaBucket.bucketArn + '/*',
          documentAnalysisTopic.topicArn,
        ],
      })
    );

    const createDocumentAnalysis = new LambdaAppSyncOperationConstruct(
      this,
      'CreateDocumentAnalysisResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createDocumentAnalysis',
        environmentVars: {
          SQS_QUEUE_URL: documentAnalysisQueue.queueUrl,
          SNS_TOPIC_ARN: documentAnalysisTopic.topicArn,
          SNS_TOPIC_ROLE_ARN: textractRole.roleArn,
          STORAGE_BUCKETNAME: props.s3mediaBucket.bucketName,
          TABLE_DOCUMENT_ANALYSIS: props.documentAnalysisTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_JOB: props.jobTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
        },
      }
    );

    props.documentAnalysisTable.grantReadWriteData(
      createDocumentAnalysis.lambda
    );
    props.entityUserTable.grantReadData(createDocumentAnalysis.lambda);
    props.jobTable.grantReadWriteData(createDocumentAnalysis.lambda);
    props.taskTable.grantReadWriteData(createDocumentAnalysis.lambda);
    props.s3mediaBucket.grantReadWrite(createDocumentAnalysis.lambda);
    createDocumentAnalysis.lambda.addToRolePolicy(
      new PolicyStatement({
        actions: [
          'textract:StartExpenseAnalysis',
          'textract:StartDocumentAnalysis',
        ],
        resources: ['*'],
      })
    );
    documentAnalysisQueue.grantSendMessages(createDocumentAnalysis.lambda);
    documentAnalysisTopic.grantPublish(createDocumentAnalysis.lambda);

    // process document analysis
    const processDocumentAnalysis = new NodejsFunction(
      this,
      'ProcessDocumentAnalysisFunction',
      {
        ...getLambdaDefaultProps(this, 'processDocumentAnalysis'),
        timeout: Duration.minutes(15),
        environment: {
          API_GRAPHQLAPIENDPOINT: props.graphqlUrl,
          TABLE_DOCUMENT_ANALYSIS: props.documentAnalysisTable.tableName,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_JOB: props.jobTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          TABLE_NOTIFICATION: props.notificationTable.tableName,
          OPENSEARCH_DOMAIN_ENDPOINT: props.openSearchDomain.domainEndpoint,
        },
      }
    );
    props.documentAnalysisTable.grantReadWriteData(processDocumentAnalysis);
    props.entityUserTable.grantReadData(processDocumentAnalysis);
    props.jobTable.grantReadWriteData(processDocumentAnalysis);
    props.taskTable.grantReadData(processDocumentAnalysis);
    props.notificationTable.grantWriteData(processDocumentAnalysis);
    props.openSearchDomain.grantRead(processDocumentAnalysis);
    props.openSearchDomain.grantIndexRead('entity', processDocumentAnalysis);
    props.openSearchDomain.grantIndexRead('contact', processDocumentAnalysis);

    processDocumentAnalysis.role?.attachInlinePolicy(
      new Policy(this, 'AppSyncInvokeProcessDocumentAnalysisPolicy', {
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

    processDocumentAnalysis.addToRolePolicy(
      new PolicyStatement({
        actions: [
          'textract:GetExpenseAnalysis',
          'textract:GetDocumentAnalysis',
        ],
        resources: ['*'],
      })
    );
    documentAnalysisQueue.grantConsumeMessages(processDocumentAnalysis);
    const processDocumentAnalysisEventSource = new SqsEventSource(
      documentAnalysisQueue,
      {
        batchSize: 1,
      }
    );
    processDocumentAnalysis.addEventSource(processDocumentAnalysisEventSource);

    processDocumentAnalysis.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['es:ESHttpPost'],
        resources: [`${props.openSearchDomain.domainArn}/*`],
      })
    );

    processDocumentAnalysis.role?.attachInlinePolicy(
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

    // get document analysis
    const getDocumentAnalysis = new LambdaAppSyncOperationConstruct(
      this,
      'GetDocumentAnalysisResolver',
      {
        api: props.appSyncApi,
        typeName: 'Query',
        fieldName: 'getDocumentAnalysis',
        environmentVars: {
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_JOB: props.jobTable.tableName,
          TABLE_TASK: props.taskTable.tableName,
          TABLE_DOCUMENT_ANALYSIS: props.documentAnalysisTable.tableName,
        },
      }
    );

    props.entityUserTable.grantReadData(getDocumentAnalysis.lambda);
    props.jobTable.grantReadWriteData(getDocumentAnalysis.lambda);
    props.taskTable.grantReadData(getDocumentAnalysis.lambda);
    props.documentAnalysisTable.grantReadData(getDocumentAnalysis.lambda);
    getDocumentAnalysis.lambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['textract:GetExpenseAnalysis'],
        resources: ['*'],
      })
    );

    // OCR handle emails
    // processOcrEmail lambda function - provide access to call createDocumentAnalysis lambda function
    const processOcrEmail = new NodejsFunction(
      this,
      'ProcessOcrEmailFunction',
      {
        ...getLambdaDefaultProps(this, 'processOcrEmail'),
        memorySize: 512,
        environment: {
          TABLE_ENTITY: props.entityTable.tableName,
          FUNCTION_CREATE_DOCUMENT_ANALYSIS:
            createDocumentAnalysis.lambda.functionArn,
          STORAGE_BUCKETNAME: props.s3mediaBucket.bucketName,
          OCR_EMAIL_DOMAIN: ocrEmailDomain,
        },
      }
    );
    props.entityTable.grantReadData(processOcrEmail);
    props.s3mediaBucket.grantReadWrite(processOcrEmail);
    createDocumentAnalysis.lambda.grantInvoke(processOcrEmail);

    processOcrEmail.addPermission('ProcessOcrEmailFunctionPermission', {
      action: 'lambda:InvokeFunction',
      principal: new ServicePrincipal('ses.amazonaws.com'),
      sourceAccount: this.account,
      sourceArn: `arn:aws:ses:${this.region}:${this.account}:receipt-rule-set/*:receipt-rule/*`,
    });

    processOcrEmail.addPermission(
      'SnSMessageProcessOcrEmailFunctionPermission',
      {
        action: 'lambda:InvokeFunction',
        principal: new ServicePrincipal('sns.amazonaws.com'),
        sourceAccount: this.account,
        sourceArn: documentAnalysisTopic.topicArn,
      }
    );

    const ocrEmailNotificationTopic = new Topic(
      this,
      'OcrEmailNotificationTopic'
    );
    new CfnReceiptRuleSet(this, 'OcrEmailRuleSet', {
      ruleSetName: setResourceName('OcrEmailRuleSet'),
    });

    new CfnReceiptRule(this, 'OcrEmailReceiptRule', {
      ruleSetName: setResourceName('OcrEmailRuleSet'),
      rule: {
        recipients: [ocrEmailDomain],
        actions: [
          {
            s3Action: {
              bucketName: props.s3OcrEmailBucket.bucketName,
              objectKeyPrefix: 'emails/',
            },
          },
          //{
          //  lambdaAction: {
          //    functionArn: processOcrEmail.functionArn,
          //    invocationType: 'Event'
          //  }
          //},
          {
            snsAction: {
              topicArn: ocrEmailNotificationTopic.topicArn,
            },
          },
        ],
        name: setResourceName('OcrEmailReceiptRule'),
        enabled: true,
      },
    });

    props.s3OcrEmailBucket.grantReadWrite(processOcrEmail);
    ocrEmailNotificationTopic.addSubscription(
      new LambdaSubscription(processOcrEmail)
    );

    // update document analysis
    new JsPipelineResolverConstruct(this, 'UpdateDocumentAnalysisResolver', {
      api: props.appSyncApi,
      dataSources: [
        props.documentAnalysisDS,
        props.entityUserDS,
        props.documentAnalysisDS,
      ],
      typeName: 'Mutation',
      fieldName: 'updateDocumentAnalysis',
      pathName: 'Mutation.updateDocumentAnalysis',
    });

    // update document analysis subscription
    new JsPipelineResolverConstruct(
      this,
      'UpdateDocumentAnalysisSubscriptionResolver',
      {
        api: props.appSyncApi,
        dataSources: [props.entityUserDS, props.noDS],
        typeName: 'Subscription',
        fieldName: 'onUpdateDocumentAnalysis',
        pathName: 'Subscription.onUpdateDocumentAnalysis',
      }
    );

    // document analysis by entity status
    new JsPipelineResolverConstruct(
      this,
      'DocumentAnalysisByEntityStatusResolver',
      {
        api: props.appSyncApi,
        dataSources: [props.entityUserDS, props.documentAnalysisDS],
        typeName: 'Query',
        fieldName: 'documentAnalysisByEntityStatus',
        pathName: 'Query.documentAnalysisByEntityStatus',
      }
    );
  }
}
