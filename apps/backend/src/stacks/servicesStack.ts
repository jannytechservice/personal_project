import { Stack, StackProps } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Domain } from 'aws-cdk-lib/aws-opensearchservice';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import customImportValue from '../constructs/customImportValue';
import { userPoolId } from '../helpers/constants';
import { ClientServiceStack } from './clientServiceStack';
import { ConfigServiceStack } from './configServiceStack';
import { ContactServiceStack } from './contactServiceStack';
import { EntityServiceStack } from './entityServiceStack';
import { NotificationServiceStack } from './notificationServiceStack';
import { PaymentServiceStack } from './paymentServiceStack';
import { SearchServiceStack } from './searchServiceStack';
import { SecretsStack } from './secretsStack';
import { TaskServiceStack } from './taskServiceStack';
import { UserServiceStack } from './userServiceStack';

export class ServicesStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // APPSYNC
    const graphqlApiId = customImportValue('GraphqlApiId');
    const graphqlApiArn = customImportValue('GraphqlApiArn');
    const graphqlUrl = customImportValue('GraphqlApiUrl');
    const appSyncApi = GraphqlApi.fromGraphqlApiAttributes(this, 'AppsyncApi', {
      graphqlApiId,
      graphqlApiArn,
    });

    // OPEN SEARCH
    const domainArn = customImportValue('OpenSearchDomainArn');
    const domainEndpoint = customImportValue('OpenSearchDomainEndpoint');
    const openSearchDomain = Domain.fromDomainAttributes(
      this,
      'OpenSearchDomain',
      {
        domainArn,
        domainEndpoint,
      }
    );

    const openSearchDS = appSyncApi.addOpenSearchDataSource(
      'OpenSearchDataSource',
      openSearchDomain
    );

    // REST API
    const restApiId = customImportValue('RestApiId');
    const rootResourceId = customImportValue('RestApiRootResourceId');
    const restApi = RestApi.fromRestApiAttributes(this, 'ImportedRestApi', {
      restApiId,
      rootResourceId,
    });

    // S3 media
    const s3mediaBucketName = customImportValue('MediaBucketName');
    const s3mediaBucket = Bucket.fromBucketName(
      this,
      'S3MediaBucket',
      s3mediaBucketName
    );

    // S3 ocr emails
    const s3OcrEmailBucketName = customImportValue('OcrEmailBucket');
    const s3OcrEmailBucket = Bucket.fromBucketName(
      this,
      'S3OcrEmailBucket',
      s3OcrEmailBucketName
    );

    // COGNITO AUTHENTICATION
    const userPool = UserPool.fromUserPoolId(this, 'UserPool', userPoolId);
    //const identityPool = IdentityPool.fromIdentityPoolId(
    //  this,
    //  'IdentityPool',
    //  identityPoolId
    //);

    const unauthenticatedRoleArn = customImportValue('UnauthenticatedRoleArn');
    const unauthenticatedRole = Role.fromRoleArn(
      this,
      'identityPoolUnauthenticatedRole',
      unauthenticatedRoleArn
    );

    // authenticatedRole
    const authenticatedRoleArn = customImportValue('AuthenticatedRoleArn');
    const authenticatedRole = Role.fromRoleArn(
      this,
      'identityPoolAuthenticatedRole',
      authenticatedRoleArn
    );

    // SECRETS
    const secrets = new SecretsStack(this, 'SecretsStack');

    // PINPOINT
    const pinpointAppId = customImportValue('PinpointApiId');

    // DATASOURCES
    const noDS = appSyncApi.addNoneDataSource('NoDataSource', {
      name: 'NoDataSource',
    });

    // activity
    const activityTableArn = customImportValue('ActivityTableArn');
    const activityTableStreamArn = customImportValue('ActivityTableStreamArn');
    const activityTable = Table.fromTableAttributes(this, 'ActivityTable', {
      tableArn: activityTableArn,
      tableStreamArn: activityTableStreamArn,
      localIndexes: ['activityByUser'],
    });
    const activityDS = appSyncApi.addDynamoDbDataSource(
      'ActivityTableDataSource',
      activityTable
    );

    //REFERRAL
    const referralTableArn = customImportValue('ReferralTableArn');
    const referralTableStreamArn = customImportValue('ReferralTableStreamArn');
    const referralTable = Table.fromTableAttributes(this, 'ReferralTable', {
      tableArn: referralTableArn,
      tableStreamArn: referralTableStreamArn,
      localIndexes: ['referralByUser'],
    });
    const referralDS = appSyncApi.addDynamoDbDataSource(
      'ReferralTableDataSource',
      referralTable
    );
    // autocomplete results
    const autoCompleteResultsTableArn = customImportValue(
      'AutoCompleteResultsTableArn'
    );
    const autoCompleteResultsTableStreamArn = customImportValue(
      'autoCompleteResultsTableStreamArn'
    );
    const autoCompleteResultsTable = Table.fromTableAttributes(
      this,
      'AutocompleteResultsTable',
      {
        tableArn: autoCompleteResultsTableArn,
        tableStreamArn: autoCompleteResultsTableStreamArn,
        localIndexes: ['autocompleteResultsByType'],
      }
    );
    const autoCompleteResultsDS = appSyncApi.addDynamoDbDataSource(
      'AutocompleteResultsDataSource',
      autoCompleteResultsTable
    );

    // beneficial owner
    const beneficialOwnerTableArn = customImportValue(
      'BeneficialOwnerTableArn'
    );
    const beneficialOwnerTableStreamArn = customImportValue(
      'BeneficialOwnerTableStreamArn'
    );
    const beneficialOwnerTable = Table.fromTableAttributes(
      this,
      'BeneficialOwnerTable',
      {
        tableArn: beneficialOwnerTableArn,
        tableStreamArn: beneficialOwnerTableStreamArn,
        localIndexes: [
          'beneficialOwnersByEntity',
          'entityBeneficialOwnersByBeneficialOwner',
        ],
      }
    );
    const beneficialOwnerTableDS = appSyncApi.addDynamoDbDataSource(
      'BeneficialOwnerTableDataSource',
      beneficialOwnerTable
    );

    // contacts
    const contactsTableArn = customImportValue('ContactsTableArn');
    const contactsTableStreamArn = customImportValue('ContactsTableStreamArn');
    const contactsTable = Table.fromTableAttributes(this, 'ContactsTable', {
      tableStreamArn: contactsTableStreamArn,
      tableArn: contactsTableArn,
      localIndexes: ['contactsByEntity'],
    });
    const contactsDS = appSyncApi.addDynamoDbDataSource(
      'ContactsTableDataSource',
      contactsTable
    );

    // document analysis
    const documentAnalysisTableArn = customImportValue(
      'DocumentAnalysisTableArn'
    );
    const documentAnalysisTable = Table.fromTableAttributes(
      this,
      'DocumentAnalysisTable',
      {
        tableArn: documentAnalysisTableArn,
        localIndexes: ['documentAnalysisByEntity'],
      }
    );

    const documentAnalysisDS = appSyncApi.addDynamoDbDataSource(
      'DocumentAnalysisTableDataSource',
      documentAnalysisTable
    );

    // entity
    const entityTableArn = customImportValue('EntityTableArn');
    const entityTableStreamArn = customImportValue('EntityTableStreamArn');
    const entityTable = Table.fromTableAttributes(this, 'EntityTable', {
      tableArn: entityTableArn,
      tableStreamArn: entityTableStreamArn,
      localIndexes: ['entityByOcrEmail'],
    });
    const entityDS = appSyncApi.addDynamoDbDataSource(
      'EntityTableDataSource',
      entityTable
    );

    // entity beneficial owner
    const entityBeneficialOwnerTableArn = customImportValue(
      'EntityBeneficialOwnerTableArn'
    );
    const entityBeneficialOwnerTableStreamArn = customImportValue(
      'EntityBeneficialOwnerTableStreamArn'
    );
    const entityBeneficialOwnerTable = Table.fromTableAttributes(
      this,
      'EntityBeneficialOwnerTable',
      {
        tableArn: entityBeneficialOwnerTableArn,
        tableStreamArn: entityBeneficialOwnerTableStreamArn,
        localIndexes: ['entityBeneficialOwnersByEntity'],
      }
    );
    const entityBeneficialOwnerDS = appSyncApi.addDynamoDbDataSource(
      'EntityBeneficialOwnerTableDataSource',
      entityBeneficialOwnerTable
    );

    // entity user
    const entityUserTableArn = customImportValue('EntityUserTableArn');
    const entityUserTableStreamArn = customImportValue(
      'EntityUserTableStreamArn'
    );
    const entityUserTable = Table.fromTableAttributes(this, 'EntityUserTable', {
      tableArn: entityUserTableArn,
      tableStreamArn: entityUserTableStreamArn,
      localIndexes: ['entityUsersByUser', 'entityUsersByEntity'],
    });
    const entityUserDS = appSyncApi.addDynamoDbDataSource(
      'EntityUserTableDataSource',
      entityUserTable
    );

    // hash
    const hashTableArn = customImportValue('HashTableArn');
    const hashTable = Table.fromTableAttributes(this, 'HashTable', {
      tableArn: hashTableArn,
    });

    const jobTableArn = customImportValue('JobTableArn');
    const jobTable = Table.fromTableAttributes(this, 'JobTable', {
      tableArn: jobTableArn,
      localIndexes: ['jobsByJobId'],
    });

    // increment
    const incrementTable = Table.fromTableAttributes(this, 'IncrementTable', {
      tableArn: customImportValue('IncrementTableArn'),
    });

    // notification
    const notificationTableArn = customImportValue('NotificationTableArn');
    const notificationTable = Table.fromTableAttributes(
      this,
      'NotificationTable',
      {
        tableArn: notificationTableArn,
        localIndexes: ['notificationsByUser'],
      }
    );

    // option
    const optionTableArn = customImportValue('OptionTableArn');
    const optionTable = Table.fromTableAttributes(this, 'OptionTable', {
      tableArn: optionTableArn,
      localIndexes: ['optionsByGroup'],
    });

    // payment account
    const paymentAccountTableArn = customImportValue('PaymentAccountTableArn');
    const paymentAccountTableStreamArn = customImportValue(
      'PaymentAccountTableStreamArn'
    );
    const paymentAccountTable = Table.fromTableAttributes(
      this,
      'PaymentAccountTable',
      {
        tableArn: paymentAccountTableArn,
        tableStreamArn: paymentAccountTableStreamArn,
        localIndexes: ['paymentAccountsByCompositeId'],
      }
    );

    // pay in payments
    const payInPaymentsTableArn = customImportValue('PayInPaymentTableArn');
    const payInPaymentsTableStreamArn = customImportValue(
      'PayInPaymentsTableStreamArn'
    );
    const payInPaymentsTable = Table.fromTableAttributes(
      this,
      'PayInPaymentsTable',
      {
        tableArn: payInPaymentsTableArn,
        tableStreamArn: payInPaymentsTableStreamArn,
        localIndexes: ['payInPaymentsByProviderUser'],
      }
    );

    // services
    const serviceTableArn = customImportValue('ServiceTableArn');
    const serviceTable = Table.fromTableAttributes(this, 'ServiceTable', {
      tableArn: serviceTableArn,
      localIndexes: ['servicesByEntity'],
    });
    const serviceDS = appSyncApi.addDynamoDbDataSource(
      'ServiceTableDataSource',
      serviceTable
    );

    // signature
    const signatureTableArn = customImportValue('SignatureTableArn');
    const signatureTable = Table.fromTableAttributes(this, 'SignatureTable', {
      tableArn: signatureTableArn,
    });
    const signatureDS = appSyncApi.addDynamoDbDataSource(
      'SignatureTableDataSource',
      signatureTable
    );

    // task
    const taskTableArn = customImportValue('TaskTableArn');
    const taskTableStreamArn = customImportValue('TaskTableStreamArn');
    const taskTable = Table.fromTableAttributes(this, 'TaskTable', {
      tableArn: taskTableArn,
      tableStreamArn: taskTableStreamArn,
      localIndexes: [
        'tasksByEntityTo',
        'tasksByEntityFrom',
        'tasksBySearchName',
        'tasksByEntityBy',
        'tasksByEntityByIdContactId',
        'tasksByAgreementUuid',
      ],
    });
    const taskDS = appSyncApi.addDynamoDbDataSource(
      'TaskTableDataSource',
      taskTable
    );

    // task num increment
    const taskNumIncrementTableArn = customImportValue(
      'TaskNumIncrementTableArn'
    );
    const taskNumIncrementTable = Table.fromTableAttributes(
      this,
      'TaskNumIncrementTable',
      {
        tableArn: taskNumIncrementTableArn,
      }
    );

    // templates
    const templateTableArn = customImportValue('TemplateTableArn');
    const templateTable = Table.fromTableAttributes(this, 'TemplateTable', {
      tableArn: templateTableArn,
      localIndexes: ['templatesByEntity'],
    });
    const templateDS = appSyncApi.addDynamoDbDataSource(
      'TemplateTableDataSource',
      templateTable
    );

    // template service
    const templateServiceTableArn = customImportValue(
      'TemplateServiceTableArn'
    );
    const templateServiceTable = Table.fromTableAttributes(
      this,
      'TemplateServiceTable',
      {
        tableArn: templateServiceTableArn,
      }
    );
    const templateServiceDS = appSyncApi.addDynamoDbDataSource(
      'TemplateServiceTableDataSource',
      templateServiceTable
    );

    // transaction
    const transactionTableArn = customImportValue('TransactionTableArn');
    const transactionTable = Table.fromTableAttributes(
      this,
      'TransactionTable',
      {
        tableArn: transactionTableArn,
      }
    );

    // user
    const userTableArn = customImportValue('UserTableArn');
    const userTableStreamArn = customImportValue('UserTableStreamArn');
    const userTable = Table.fromTableAttributes(this, 'UserTable', {
      tableArn: userTableArn,
      tableStreamArn: userTableStreamArn,
      localIndexes: ['usersByReferralCode'],
    });
    // USERS
    const userDS = appSyncApi.addDynamoDbDataSource(
      'UserTableDataSource',
      userTable
    );

    // xero token
    const xeroTokenTableArn = customImportValue('XeroTokenTableArn');
    const xeroTokenTable = Table.fromTableAttributes(this, 'XeroTokenTable', {
      tableArn: xeroTokenTableArn,
    });
    const xeroTokenDS = appSyncApi.addDynamoDbDataSource(
      'XeroTokenTableDataSource',
      xeroTokenTable
    );

    // token
    const tokenTableArn = customImportValue('TokenTableArn');
    const tokenTable = Table.fromTableAttributes(this, 'TokenTable', {
      tableArn: tokenTableArn,
    });

    // payment
    const paymentTableArn = customImportValue('PaymentTableArn');
    const paymentTableStreamArn = customImportValue('PaymentTableStreamArn');
    const paymentTable = Table.fromTableAttributes(this, 'PaymentTable', {
      tableArn: paymentTableArn,
      tableStreamArn: paymentTableStreamArn,
      localIndexes: [
        'paymentsByEntity',
        'paymentsByTask',
        'paymentsByStatus',
        'paymentsByPayInPayment',
      ],
    });
    const paymentDS = appSyncApi.addDynamoDbDataSource(
      'PaymentTableDataSource',
      paymentTable
    );

    // payment method
    const paymentMethodTableArn = customImportValue('PaymentMethodTableArn');
    const paymentMethodTableStreamArn = customImportValue(
      'PaymentMethodTableStreamArn'
    );
    const paymentMethodTable = Table.fromTableAttributes(
      this,
      'PaymentMethodTable',
      {
        tableArn: paymentMethodTableArn,
        tableStreamArn: paymentMethodTableStreamArn,
        localIndexes: ['paymentMethodsByEntity'],
      }
    );
    const paymentMethodTableDS = appSyncApi.addDynamoDbDataSource(
      'PaymentMethodTableDataSource',
      paymentMethodTable
    );

    //const paytoAgreementsTableArn = customImportValue('PayToAgreementTableArn');
    //const payToAgreementsTableStreamArn = customImportValue(
    //  'PayToAgreementTableStreamArn'
    //);
    //const paytoAgreementsTable = Table.fromTableAttributes(
    //  this,
    //  'PaytoAgreementsTable',
    //  {
    //    tableArn: paytoAgreementsTableArn,
    //    tableStreamArn: payToAgreementsTableStreamArn,
    //    localIndexes: ['payToAgreementsByEntitiesByFrequency', 'payToAgreementsByEntity'], //TODO: also be imported value for index name?
    //  }
    //);

    new ClientServiceStack(this, 'ClientServiceStack', {
      appSyncApi,
      unauthenticatedRole,
      beneficialOwnerTable,
      entityBeneficialOwnerTable,
      entityTable,
      entityUserTable,
      userPool,
      userTable,
    });

    new EntityServiceStack(this, 'EntityServiceStack', {
      autoCompleteResultsTable,
      contactsDS,
      entityDS,
      entityUserTable,
      paymentMethodTableDS,
      restApi,
      userPool,
      zaiSecrets: secrets.zaiSecrets,
      appSyncApi,
      beneficialOwnerTable,
      beneficialOwnerTableDS,
      entityBeneficialOwnerDS,
      entityBeneficialOwnerTable,
      entityTable,
      userTable,
      referralTable,
      entityUserDS,
      userDS: userDS,
      graphqlUrl,
      noDS,
      openSearchDomain,
    });

    new PaymentServiceStack(this, 'PaymentServiceStack', {
      graphqlUrl,
      payInPaymentsTable,
      paymentAccountTable,
      paymentDS,
      paymentMethodTable,
      paymentMethodTableDS,
      restApi,
      transactionTable,
      userTable,
      appSyncApi,
      unauthenticatedRole,
      contactsTable,
      entityTable,
      entityUserTable,
      incrementTable,
      paymentTable,
      //paytoAgreementsTable,
      pinpointAppId,
      taskTable,
      zaiSecrets: secrets.zaiSecrets,
      activityTable,
      referralTable,
    });

    new SearchServiceStack(this, 'SearchServiceStack', {
      appSyncApi,
      autoCompleteResultsDS,
      authenticatedRole,
    });

    new TaskServiceStack(this, 'TaskServiceStack', {
      appSyncApi,
      userPool,
      unauthenticatedRole,
      activityDS,
      activityTable,
      contactsDS,
      contactsTable,
      documentAnalysisDS,
      documentAnalysisTable,
      entityDS,
      entityTable,
      xeroTokenTable,
      entityUserDS,
      entityUserTable,
      hashTable,
      jobTable,
      notificationTable,
      graphqlUrl,
      s3mediaBucket,
      serviceTable,
      serviceDS,
      taskDS,
      taskTable,
      taskNumIncrementTable,
      templateTable,
      templateDS,
      templateServiceDS,
      userTable,
      referralTable,
      openSearchDomain,
      pinpointAppId,
      s3OcrEmailBucket,
      noDS,
    });

    new UserServiceStack(this, 'UserServiceStack', {
      appSyncApi,
      restApi,
      graphqlUrl,
      authenticatedRole,
      autoCompleteResultsDS,
      entityTable,
      entityUserTable,
      signatureDS,
      taskTable,
      userDS,
      userPool,
      userTable,
      xeroTokenTable,
      contactsTable,
      referralTable,
      zaiSecrets: secrets.zaiSecrets,
      activityDS,
      referralDS,
    });

    new ContactServiceStack(this, 'ContactServiceStack', {
      contactsTable,
      entityUserTable,
      unauthenticatedRole,
      appSyncApi,
      contactsDS,
      entityUserDS,
      s3mediaBucket,
      entityTable,
      userTable,
      xeroTokenTable,
      entityBeneficialOwnerTable,
      beneficialOwnerTable,
      zaiSecrets: secrets.zaiSecrets,
      notificationTable,
      graphqlUrl,
      openSearchDomain,
      openSearchDS,
    });

    new NotificationServiceStack(this, 'NotificationServiceStack', {
      appSyncApi,
      noDS,
      userTable,
      pinpointAppId,
      notificationTable,
    });

    new ConfigServiceStack(this, 'ConfigServiceStack', {
      appSyncApi,
      entityTable,
      optionTable,
      zaiSecrets: secrets.zaiSecrets,
    });

    //new TranslationsStack(app, setResourceName('TranslationsStack'), {
    //  env: {
    //    ...defaultEnv,
    //  },
    //});
  }
}
