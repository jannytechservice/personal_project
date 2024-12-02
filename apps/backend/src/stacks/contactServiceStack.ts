import { Duration, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import {
  DynamoDbDataSource,
  IGraphqlApi,
  OpenSearchDataSource,
} from 'aws-cdk-lib/aws-appsync';
import { IDomain } from 'aws-cdk-lib/aws-opensearchservice';
import { Effect, IRole, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { StartingPosition } from 'aws-cdk-lib/aws-lambda';
import {
  DynamoEventSource,
  SqsEventSource,
} from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { JsPipelineResolverConstruct } from '../constructs/jsPipelineResolverConstruct';
import { LambdaAppSyncOperationConstruct } from '../constructs/lambdaAppSyncOperationConstruct';
import { getLambdaDefaultProps, setResourceName } from '../helpers';
import {
  env,
  mixpanelToken,
  zaiClientId,
  zaiClientScope,
  zaiDomain,
  zaiTokenDomain,
  region,
  xeroClientId,
  xeroClientSecret,
} from '../helpers/constants';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

interface ContactServiceStackProps extends NestedStackProps {
  appSyncApi: IGraphqlApi;
  contactsTable: ITable;
  unauthenticatedRole: IRole;
  entityUserTable: ITable;
  entityTable: ITable;
  userTable: ITable;
  xeroTokenTable: ITable;
  entityBeneficialOwnerTable: ITable;
  beneficialOwnerTable: ITable;
  zaiSecrets: ISecret;
  contactsDS: DynamoDbDataSource;
  entityUserDS: DynamoDbDataSource;
  s3mediaBucket: IBucket;
  notificationTable: ITable;
  graphqlUrl: string;
  openSearchDomain: IDomain;
  openSearchDS: OpenSearchDataSource;
}

export class ContactServiceStack extends NestedStack {
  constructor(scope: Construct, id: string, props: ContactServiceStackProps) {
    super(scope, id, props);

    // CONTACTS
    // contact stream
    const contactStreamFunc = new NodejsFunction(
      this,
      'ContactStreamFunction',
      {
        ...getLambdaDefaultProps(this, 'streamContact'),
        timeout: Duration.minutes(15),
        environment: {
          TABLE_CONTACT: props.contactsTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_USER: props.userTable.tableName,
          TABLE_XERO_TOKEN: props.xeroTokenTable.tableName,
          XERO_CLIENT_ID: xeroClientId,
          XERO_CLIENT_SECRET: xeroClientSecret,
          ZAI_DOMAIN: zaiDomain,
          ZAI_TOKEN_DOMAIN: zaiTokenDomain,
          ZAI_CLIENT_ID: zaiClientId,
          ZAI_CLIENT_SCOPE: zaiClientScope,
          OPENSEARCH_DOMAIN_ENDPOINT: props.openSearchDomain.domainEndpoint,
          ENV: env,
        },
      }
    );

    contactStreamFunc.addEventSource(
      new DynamoEventSource(props.contactsTable, {
        startingPosition: StartingPosition.TRIM_HORIZON,
      })
    );

    props.xeroTokenTable.grantReadWriteData(contactStreamFunc);
    props.contactsTable.grantReadWriteData(contactStreamFunc);
    props.userTable.grantReadData(contactStreamFunc);
    props.entityTable.grantReadData(contactStreamFunc);
    props.zaiSecrets.grantRead(contactStreamFunc);

    props.openSearchDomain.grantWrite(contactStreamFunc);
    props.openSearchDomain.grantIndexReadWrite('contact', contactStreamFunc);

    //get contact
    new JsPipelineResolverConstruct(this, 'GetContactResolver', {
      api: props.appSyncApi,
      dataSources: [props.contactsDS, props.entityUserDS],
      typeName: 'Query',
      fieldName: 'getContact',
      pathName: 'Query.getContact',
    });

    // list contacts by entity
    new JsPipelineResolverConstruct(this, 'ListContactsResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.openSearchDS],
      typeName: 'Query',
      fieldName: 'contactsByEntity',
      pathName: 'Query.contactsByEntity',
    });

    // create contact
    new JsPipelineResolverConstruct(this, 'CreateContactResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.contactsDS],
      typeName: 'Mutation',
      fieldName: 'createContact',
      pathName: 'Mutation.createContact',
    });

    // update contact
    new JsPipelineResolverConstruct(this, 'UpdateContactResolver', {
      api: props.appSyncApi,
      dataSources: [props.entityUserDS, props.contactsDS],
      typeName: 'Mutation',
      fieldName: 'updateContact',
      pathName: 'Mutation.updateContact',
    });

    // csv bulk upload
    const contactsBulkUploadQueue = new Queue(this, 'ContactsBulkUploadQueue', {
      queueName: setResourceName('ContactsBulkUploadQueue'),
      visibilityTimeout: Duration.minutes(15),
    });

    const createContactBulkUpload = new LambdaAppSyncOperationConstruct(
      this,
      'CreateContactBulkUploadResolver',
      {
        timeout: Duration.minutes(15),
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createContactBulkUpload',
        environmentVars: {
          SQS_QUEUE_URL: contactsBulkUploadQueue.queueUrl,
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          MIXPANEL_TOKEN: mixpanelToken,
          REGION: region,
        },
      }
    );

    props.entityUserTable.grantReadData(createContactBulkUpload.lambda);
    contactsBulkUploadQueue.grantSendMessages(createContactBulkUpload.lambda);

    const processContactBulkUpload = new NodejsFunction(
      this,
      'ProcessContactBulkUploadFunc',
      {
        ...getLambdaDefaultProps(this, 'processContactBulkUpload'),
        timeout: Duration.minutes(15),
        environment: {
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_CONTACT: props.contactsTable.tableName,
          STORAGE_BUCKETNAME: props.s3mediaBucket.bucketName,
          TABLE_NOTIFICATION: props.notificationTable.tableName,
          API_GRAPHQLAPIENDPOINT: props.graphqlUrl,
          REGION: region,
        },
      }
    );
    props.entityTable.grantReadData(processContactBulkUpload);
    props.contactsTable.grantWriteData(processContactBulkUpload);
    props.notificationTable.grantWriteData(processContactBulkUpload);
    props.s3mediaBucket.grantReadWrite(processContactBulkUpload);
    processContactBulkUpload.role?.attachInlinePolicy(
      new Policy(this, 'AppSyncInvokeProcessBulkUploadPolicy', {
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
    contactsBulkUploadQueue.grantConsumeMessages(processContactBulkUpload);

    // lambda trigger for SQS messages
    // add trigger to receive SQS messages
    const contactBulkUploadEventSource = new SqsEventSource(
      contactsBulkUploadQueue,
      {
        batchSize: 1,
      }
    );
    processContactBulkUpload.addEventSource(contactBulkUploadEventSource);
  }
}
