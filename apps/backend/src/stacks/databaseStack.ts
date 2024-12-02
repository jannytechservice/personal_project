import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table, //TODO: update to TableV2
} from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { CustomCfnOutput } from '../constructs/customCfnOutput';
import { getLambdaDefaultProps } from '../helpers';
import { isProd } from '../helpers/constants';

export class DatabaseStack extends Stack {
  public readonly defaultTableProps: () => Record<string, any>;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.defaultTableProps = () => ({
      removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY, //update if table shouldn't automatically destroy
      billingMode: BillingMode.PAY_PER_REQUEST,
      deletionProtection: isProd,
      pointInTimeRecovery: isProd,
    });

    // ACTIVITY
    const activityTable = new Table(this, 'ActivityTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'compositeId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    activityTable.addGlobalSecondaryIndex({
      indexName: 'activityByUser',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'ActivityTableArn', {
      value: activityTable.tableArn,
      exportName: 'ActivityTableArn',
    });

    // activity stream arn
    if (activityTable.tableStreamArn) {
      new CustomCfnOutput(this, 'ActivityTableStreamArn', {
        value: activityTable.tableStreamArn,
        exportName: 'ActivityTableStreamArn',
      });
    }

    // ADMIN
    const adminTable = new Table(this, 'AdminTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    //new CfnOutput(this, 'AdminTableArn', {
    //  value: this.adminTable.tableArn,
    //  exportName: setResourceName('AdminTableArn'),
    //});

    new CustomCfnOutput(this, 'AdminTableArn', {
      value: adminTable.tableArn,
      exportName: 'AdminTableArn',
    });

    // AUTOCOMPLETE RESULTS
    const autoCompleteResultsTable = new Table(
      this,
      'AutoCompleteResultsTable',
      {
        ...this.defaultTableProps(),
        partitionKey: { name: 'id', type: AttributeType.STRING },
        sortKey: { name: 'type', type: AttributeType.STRING },
      }
    );

    autoCompleteResultsTable.addGlobalSecondaryIndex({
      indexName: 'autocompleteResultsByType',
      partitionKey: { name: 'type', type: AttributeType.STRING },
      sortKey: { name: 'searchName', type: AttributeType.STRING },
    });

    //new CfnOutput(this, 'AutoCompleteResultsTableArn', {
    //  value: this.autoCompleteResultsTable.tableArn,
    //  exportName: setResourceName('AutoCompleteResultsTableArn'),
    //});

    new CustomCfnOutput(this, 'AutoCompleteResultsTableArn', {
      value: autoCompleteResultsTable.tableArn,
      exportName: 'AutoCompleteResultsTableArn',
    });

    // BENEFICIAL OWNER
    const beneficialOwnerTable = new Table(this, 'BeneficialOwnerTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    beneficialOwnerTable.addGlobalSecondaryIndex({
      indexName: 'beneficialOwnersByEntity',
      partitionKey: { name: 'entityId', type: AttributeType.STRING },
    });

    //new CfnOutput(this, 'BeneficialOwnerTableArn', {
    //  value: beneficialOwnerTable.tableArn,
    //  exportName: setResourceName('BeneficialOwnerTableArn'),
    //});

    new CustomCfnOutput(this, 'BeneficialOwnerTableArn', {
      value: beneficialOwnerTable.tableArn,
      exportName: 'BeneficialOwnerTableArn',
    });

    if (beneficialOwnerTable.tableStreamArn) {
      //new CfnOutput(this, 'BeneficialOwnerTableStreamArn', {
      //  value: beneficialOwnerTable.tableStreamArn,
      //  exportName: setResourceName('BeneficialOwnerTableStreamArn'),
      //});

      new CustomCfnOutput(this, 'BeneficialOwnerTableStreamArn', {
        value: beneficialOwnerTable.tableStreamArn,
        exportName: 'BeneficialOwnerTableStreamArn',
      });
    }

    // CONTACTS
    const contactsTable = new Table(this, 'ContactsTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    contactsTable.addGlobalSecondaryIndex({
      indexName: 'contactsByEntity',
      partitionKey: { name: 'entityId', type: AttributeType.STRING },
    });

    contactsTable.addGlobalSecondaryIndex({
      indexName: 'contactsByXeroTenantId',
      partitionKey: { name: 'xeroTenantId', type: AttributeType.STRING },
    });

    //new CfnOutput(this, 'ContactsTableArn', {
    //  value: contactsTable.tableArn,
    //  exportName: setResourceName('ContactsTableArn'),
    //});

    new CustomCfnOutput(this, 'ContactsTableArn', {
      value: contactsTable.tableArn,
      exportName: 'ContactsTableArn',
    });

    if (contactsTable.tableStreamArn) {
      //new CfnOutput(this, 'ContactsTableStreamArn', {
      //  value: contactsTable.tableStreamArn,
      //  exportName: setResourceName('ContactsTableStreamArn'),
      //});

      new CustomCfnOutput(this, 'ContactsTableStreamArn', {
        value: contactsTable.tableStreamArn,
        exportName: 'ContactsTableStreamArn',
      });
    }

    // CONVERSATION
    const conversationTable = new Table(this, 'ConversationTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    //new CfnOutput(this, 'ConversationTableArn', {
    //  value: this.conversationTable.tableArn,
    //  exportName: setResourceName('ConversationTableArn'),
    //});

    new CustomCfnOutput(this, 'ConversationTableArn', {
      value: conversationTable.tableArn,
      exportName: 'ConversationTableArn',
    });

    // stream arn
    if (conversationTable.tableStreamArn) {
      //new CfnOutput(this, 'ConversationTableStreamArn', {
      //  value: this.conversationTable.tableStreamArn,
      //  exportName: setResourceName('ConversationTableStreamArn'),
      //});

      new CustomCfnOutput(this, 'ConversationTableStreamArn', {
        value: conversationTable.tableStreamArn,
        exportName: 'ConversationTableStreamArn',
      });
    }

    // ENTITY
    const entityTable = new Table(this, 'EntityTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    entityTable.addGlobalSecondaryIndex({
      indexName: 'entityByOcrEmail',
      partitionKey: {
        name: 'ocrEmail',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
    });

    if (entityTable.tableStreamArn) {
      //new CfnOutput(this, 'EntityTableStreamArn', {
      //  value: entityTable.tableStreamArn,
      //  exportName: setResourceName('EntityTableStreamArn'),
      //});

      new CustomCfnOutput(this, 'EntityTableStreamArn', {
        value: entityTable.tableStreamArn,
        exportName: 'EntityTableStreamArn',
      });
    }

    //new CfnOutput(this, 'EntityTableArn', {
    //  value: this.entityTable.tableArn,
    //  exportName: setResourceName('EntityTableArn'),
    //});

    new CustomCfnOutput(this, 'EntityTableArn', {
      value: entityTable.tableArn,
      exportName: 'EntityTableArn',
    });

    // ENTITY BENEFICIAL OWNER
    const entityBeneficialOwnerTable = new Table(
      this,
      'EntityBeneficialOwnerTable',
      {
        ...this.defaultTableProps(),
        partitionKey: { name: 'entityId', type: AttributeType.STRING },
        sortKey: { name: 'beneficialOwnerId', type: AttributeType.STRING },
      }
    );

    entityBeneficialOwnerTable.addGlobalSecondaryIndex({
      indexName: 'entityBeneficialOwnersByEntity',
      partitionKey: {
        name: 'entityId',
        type: AttributeType.STRING,
      },
    });

    entityBeneficialOwnerTable.addGlobalSecondaryIndex({
      indexName: 'entityBeneficialOwnersByBeneficialOwner',
      partitionKey: {
        name: 'beneficialOwnerId',
        type: AttributeType.STRING,
      },
    });

    //new CfnOutput(this, 'EntityBeneficialOwnerTableArn', {
    //  value: entityBeneficialOwnerTable.tableArn,
    //  exportName: setResourceName('EntityBeneficialOwnerTableArn'),
    //});

    new CustomCfnOutput(this, 'EntityBeneficialOwnerTableArn', {
      value: entityBeneficialOwnerTable.tableArn,
      exportName: 'EntityBeneficialOwnerTableArn',
    });

    // ENTITY USER
    const entityUserTable = new Table(this, 'EntityUserTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'entityId', type: AttributeType.STRING },
      sortKey: { name: 'userId', type: AttributeType.STRING },
    });

    // entity user by userId
    entityUserTable.addGlobalSecondaryIndex({
      indexName: 'entityUsersByEntity',
      partitionKey: {
        name: 'entityId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
    });

    // entity user by userId
    entityUserTable.addGlobalSecondaryIndex({
      indexName: 'entityUsersByUser',
      partitionKey: {
        name: 'userId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
    });

    new CustomCfnOutput(this, 'EntityUserTableArn', {
      value: entityUserTable.tableArn,
      exportName: 'EntityUserTableArn',
    });

    // DOCUMENT ANALYSIS
    const documentAnalysisTable = new Table(this, 'DocumentAnalysisTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'DocumentAnalysisTableArn', {
      value: documentAnalysisTable.tableArn,
      exportName: 'DocumentAnalysisTableArn',
    });

    // document analysis by entity and status
    documentAnalysisTable.addGlobalSecondaryIndex({
      indexName: 'documentAnalysisByEntityStatus',
      partitionKey: { name: 'entityId', type: AttributeType.STRING },
      sortKey: { name: 'status', type: AttributeType.STRING },
    });

    // HASH
    const hashTable = new Table(this, 'HashTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'HashTableArn', {
      value: hashTable.tableArn,
      exportName: 'HashTableArn',
    });

    // REFERRAL
    const referralTable = new Table(this, 'ReferralTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'referredId', type: AttributeType.STRING },
    });

    referralTable.addGlobalSecondaryIndex({
      indexName: 'referralByUser',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
    });

    referralTable.addGlobalSecondaryIndex({
      indexName: 'referralByReferredId',
      partitionKey: { name: 'referredId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'ReferralTableArn', {
      value: referralTable.tableArn,
      exportName: 'ReferralTableArn',
    });
    if (referralTable.tableStreamArn) {
      new CustomCfnOutput(this, 'ReferralTableStreamArn', {
        value: referralTable.tableStreamArn,
        exportName: 'ReferralTableStreamArn',
      });
    }
    // JOB
    const jobTable = new Table(this, 'JobTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    new CustomCfnOutput(this, 'JobTableArn', {
      value: jobTable.tableArn,
      exportName: 'JobTableArn',
    });

    // J
    jobTable.addGlobalSecondaryIndex({
      indexName: 'jobsByJobId',
      partitionKey: { name: 'jobId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
    });

    // NOTIFICATION
    const notificationTable = new Table(this, 'NotificationTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    notificationTable.addGlobalSecondaryIndex({
      indexName: 'notificationsByUser',
      partitionKey: {
        name: 'owner',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
    });

    new CustomCfnOutput(this, 'NotificationTableArn', {
      value: notificationTable.tableArn,
      exportName: 'NotificationTableArn',
    });

    // OPTION
    const optionTable = new Table(this, 'OptionTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    optionTable.addGlobalSecondaryIndex({
      indexName: 'optionsByGroup',
      partitionKey: { name: 'group', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'OptionTableArn', {
      value: optionTable.tableArn,
      exportName: 'OptionTableArn',
    });

    // PAY IN PAYMENT
    const payInPaymentTable = new Table(this, 'PayInPaymentTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    payInPaymentTable.addGlobalSecondaryIndex({
      indexName: 'payInPaymentsByProviderUser',
      partitionKey: { name: 'paymentUserId', type: AttributeType.STRING },
      sortKey: { name: 'status', type: AttributeType.STRING },
    });

    //new CfnOutput(this, 'PayInPaymentTableArn', {
    //  value: payInPaymentTable.tableArn,
    //  exportName: setResourceName('PayInPaymentTableArn')
    //});

    new CustomCfnOutput(this, 'PayInPaymentTableArn', {
      value: payInPaymentTable.tableArn,
      exportName: 'PayInPaymentTableArn',
    });

    // payInPaymentTable stream arn
    if (payInPaymentTable.tableStreamArn) {
      //new CfnOutput(this, 'PayInPaymentTableStreamArn', {
      //  value: payInPaymentTable.tableStreamArn,
      //  exportName: setResourceName('PayInPaymentTableStreamArn'),
      //});

      new CustomCfnOutput(this, 'PayInPaymentTableStreamArn', {
        value: payInPaymentTable.tableStreamArn,
        exportName: 'PayInPaymentTableStreamArn',
      });
    }

    // PAYMENT
    const paymentTable = new Table(this, 'PaymentTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    paymentTable.addGlobalSecondaryIndex({
      indexName: 'paymentsByEntity',
      partitionKey: { name: 'entityId', type: AttributeType.STRING },
      sortKey: { name: 'scheduledAt', type: AttributeType.STRING },
    });

    paymentTable.addGlobalSecondaryIndex({
      indexName: 'paymentsByTask',
      partitionKey: { name: 'taskId', type: AttributeType.STRING },
      sortKey: { name: 'scheduledAt', type: AttributeType.STRING },
    });

    paymentTable.addGlobalSecondaryIndex({
      indexName: 'paymentsByStatus',
      partitionKey: { name: 'status', type: AttributeType.STRING },
      sortKey: { name: 'scheduledAt', type: AttributeType.STRING },
    });

    paymentTable.addGlobalSecondaryIndex({
      indexName: 'paymentsByPayInPayment',
      partitionKey: { name: 'payInPaymentId', type: AttributeType.STRING },
      sortKey: { name: 'scheduledAt', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'PaymentTableArn', {
      value: paymentTable.tableArn,
      exportName: 'PaymentTableArn',
    });

    // payment table stream arn
    if (paymentTable.tableStreamArn) {
      //new CfnOutput(this, 'PaymentTableStreamArn', {
      //  value: paymentTable.tableStreamArn,
      //  exportName: setResourceName('PaymentTableStreamArn'),
      //});

      new CustomCfnOutput(this, 'PaymentTableStreamArn', {
        value: paymentTable.tableStreamArn,
        exportName: 'PaymentTableStreamArn',
      });
    }

    // PAYOUT

    // PAYMENT ACCOUNT
    const paymentAccountTable = new Table(this, 'PaymentAccountTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    // TODO: remove in place of compositeId index
    //paymentAccountTable.addGlobalSecondaryIndex({
    //  indexName: 'paymentAccountsByBillerCodeReference',
    //  partitionKey: { name: 'billerCode', type: AttributeType.STRING },
    //  sortKey: { name: 'reference', type: AttributeType.STRING },
    //});

    // composite key
    paymentAccountTable.addGlobalSecondaryIndex({
      indexName: 'paymentAccountsByCompositeId',
      partitionKey: { name: 'compositeId', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'PaymentAccountTableArn', {
      value: paymentAccountTable.tableArn,
      exportName: 'PaymentAccountTableArn',
    });

    // PAYMENT METHOD
    const paymentMethodTable = new Table(this, 'PaymentMethodTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    //paymentMethodTable.addGlobalSecondaryIndex({
    //  indexName: 'paymentMethodsByUser',
    //  partitionKey: { name: 'userId', type: AttributeType.STRING },
    //  sortKey: { name: 'createdAt', type: AttributeType.STRING}
    //});

    paymentMethodTable.addGlobalSecondaryIndex({
      indexName: 'paymentMethodsByEntity',
      partitionKey: { name: 'entityId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'PaymentMethodTableArn', {
      value: paymentMethodTable.tableArn,
      exportName: 'PaymentMethodTableArn',
    });

    // PAY TO AGREEMENT
    const payToAgreementTable = new Table(this, 'PayToAgreementTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    payToAgreementTable.addGlobalSecondaryIndex({
      indexName: 'payToAgreementsByEntity',
      partitionKey: { name: 'entityId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
    });

    payToAgreementTable.addGlobalSecondaryIndex({
      indexName: 'payToAgreementsByEntitiesByFrequency',
      partitionKey: { name: 'compositeId', type: AttributeType.STRING },
      sortKey: { name: 'status', type: AttributeType.STRING },
    });

    //new CfnOutput(this, 'PayToAgreementTableArn', {
    //  value: payToAgreementTable.tableArn,
    //  exportName: setResourceName('PayToAgreementTableArn'),
    //});

    new CustomCfnOutput(this, 'PayToAgreementTableArn', {
      value: payToAgreementTable.tableArn,
      exportName: 'PayToAgreementTableArn',
    });

    if (payToAgreementTable.tableStreamArn) {
      //new CfnOutput(this, 'PayToAgreementTableStreamArn', {
      //  value: payToAgreementTable.tableStreamArn,
      //  exportName: setResourceName('PayToAgreementTableStreamArn'),
      //});

      new CustomCfnOutput(this, 'PayToAgreementTableStreamArn', {
        value: payToAgreementTable.tableStreamArn,
        exportName: 'PayToAgreementTableStreamArn',
      });
    }

    // USER CONVERSATION
    const userConversationTable = new Table(this, 'UserConversations', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    userConversationTable.addGlobalSecondaryIndex({
      indexName: 'userConversationsByConversationIdAndCreatedAt',
      partitionKey: {
        name: 'conversationId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
    });

    userConversationTable.addGlobalSecondaryIndex({
      indexName: 'userConversationsByUserId',
      partitionKey: {
        name: 'userId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
    });

    new CustomCfnOutput(this, 'UserConversationTableArn', {
      value: userConversationTable.tableArn,
      exportName: 'UserConversationTableArn',
    });

    // INCREMENT
    const incrementTable = new Table(this, 'IncrementTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'type', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'IncrementTableArn', {
      value: incrementTable.tableArn,
      exportName: 'IncrementTableArn',
    });

    const initIncrementFunc = new NodejsFunction(
      this,
      'InitIncrementFunction',
      {
        ...getLambdaDefaultProps(this, 'initIncrement'),
        environment: {
          TABLE_INCREMENT: incrementTable.tableName,
        },
      }
    );
    incrementTable.grantReadWriteData(initIncrementFunc);

    // create custom resource to trigger initIncrement function once increment table is created
    const initIncrementResource = new AwsCustomResource(
      this,
      'InitIncrementResource',
      {
        onCreate: {
          service: 'Lambda',
          action: 'invoke',
          parameters: {
            FunctionName: initIncrementFunc.functionArn,
          },
          physicalResourceId: PhysicalResourceId.of('InitIncrementResource'),
        },
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      }
    );

    initIncrementFunc.grantInvoke(initIncrementResource);
    initIncrementFunc.node.addDependency(incrementTable);

    // MESSAGE
    const messageTable = new Table(this, 'MessageTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    messageTable.addGlobalSecondaryIndex({
      indexName: 'messagesByConversation',
      partitionKey: {
        name: 'conversationId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
    });

    new CustomCfnOutput(this, 'MessageTableArn', {
      value: messageTable.tableArn,
      exportName: 'MessageTableArn',
    });

    // message table stream arn
    if (messageTable.tableStreamArn) {
      new CustomCfnOutput(this, 'MessageTableStreamArn', {
        value: messageTable.tableStreamArn,
        exportName: 'MessageTableStreamArn',
      });
    }

    // REFERRER
    const referrerTable = new Table(this, 'ReferrerTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'ReferrerTableArn', {
      value: referrerTable.tableArn,
      exportName: 'ReferrerTableArn',
    });

    // SERVICES
    const serviceTable = new Table(this, 'ServiceTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'ServiceTableArn', {
      value: serviceTable.tableArn,
      exportName: 'ServiceTableArn',
    });

    // services by entity
    serviceTable.addGlobalSecondaryIndex({
      indexName: 'servicesByEntityId',
      partitionKey: { name: 'entityId', type: AttributeType.STRING },
      sortKey: { name: 'updatedAt', type: AttributeType.STRING },
    });

    // SIGNATURE
    const signatureTable = new Table(this, 'SignatureTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'SignatureTableArn', {
      value: signatureTable.tableArn,
      exportName: 'SignatureTableArn',
    });

    // TASK
    const taskTable = new Table(this, 'TaskTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'entityId', type: AttributeType.STRING },
      sortKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    //TODO: can these queries be merged into one?

    // list tasks entity to and status, sort by dueAt
    taskTable.addGlobalSecondaryIndex({
      indexName: 'tasksByEntityTo',
      partitionKey: {
        name: 'toSearchStatus',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'dueAt',
        type: AttributeType.STRING,
      },
    });

    taskTable.addGlobalSecondaryIndex({
      indexName: 'tasksByXeroTenantId',
      partitionKey: { name: 'xeroTenantId', type: AttributeType.STRING },
    });

    // list tasks entity from and status, sort by dueAt
    taskTable.addGlobalSecondaryIndex({
      indexName: 'tasksByEntityFrom',
      partitionKey: {
        name: 'fromSearchStatus',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'dueAt',
        type: AttributeType.STRING,
      },
    });

    //TODO: need to review logic here, as we have to / from tasks
    // tasks by search name
    //taskTable.addGlobalSecondaryIndex({
    //  indexName: 'tasksBySearchName',
    //  partitionKey: {
    //    name: 'searchName',
    //    type: AttributeType.STRING,
    //  },
    //  sortKey: {
    //    name: 'dueAt',
    //    type: AttributeType.STRING,
    //  },
    //});
    taskTable.addGlobalSecondaryIndex({
      indexName: 'tasksBySearchName',
      partitionKey: {
        name: 'entityId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'searchName',
        type: AttributeType.STRING,
      },
    });

    // tasks by entity id by
    taskTable.addGlobalSecondaryIndex({
      indexName: 'tasksByEntityBy',
      partitionKey: {
        name: 'entityIdBy',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'dueAt',
        type: AttributeType.STRING,
      },
    });

    taskTable.addGlobalSecondaryIndex({
      indexName: 'tasksByEntityByIdContactId',
      partitionKey: {
        name: 'entityByIdContactId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'dueAt',
        type: AttributeType.STRING,
      },
    });

    //TODO: enable
    taskTable.addGlobalSecondaryIndex({
      indexName: 'tasksByStatus',
      partitionKey: {
        name: 'status',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'dueAt',
        type: AttributeType.STRING,
      },
    });

    // tasks by to
    //taskTable.addGlobalSecondaryIndex({
    //  indexName: 'tasksByTo',
    //  partitionKey: {
    //    name: 'fromTo',
    //    type: AttributeType.STRING,
    //  },
    //  sortKey: {
    //    name: 'dueAt',
    //    type: AttributeType.STRING,
    //  },
    //});

    // TODO: disable
    // tasks by agreementUuid
    //taskTable.addGlobalSecondaryIndex({
    //  indexName: 'tasksByAgreementUuid',
    //  partitionKey: {
    //    name: 'agreementUuid',
    //    type: AttributeType.STRING,
    //  },
    //});

    // TODO: disable
    // tasks by agreementUuid and paymentStatus
    taskTable.addGlobalSecondaryIndex({
      indexName: 'tasksByAgreementUuidByPaymentStatus',
      partitionKey: {
        name: 'agreementUuid',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'paymentStatus',
        type: AttributeType.STRING,
      },
    });

    new CustomCfnOutput(this, 'TaskTableArn', {
      value: taskTable.tableArn,
      exportName: 'TaskTableArn',
    });

    // task table stream arn
    if (taskTable.tableStreamArn) {
      //new CfnOutput(this, 'TaskTableStreamArn', {
      //  value: taskTable.tableStreamArn,
      //  exportName: setResourceName('TaskTableStreamArn'),
      //});

      new CustomCfnOutput(this, 'TaskTableStreamArn', {
        value: taskTable.tableStreamArn,
        exportName: 'TaskTableStreamArn',
      });
    }

    // task number increment table
    const taskNumIncrementTable = new Table(this, 'TaskNumIncrementTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    new CustomCfnOutput(this, 'TaskNumIncrementTableArn', {
      value: taskNumIncrementTable.tableArn,
      exportName: 'TaskNumIncrementTableArn',
    });

    // TEMPLATES
    const templateTable = new Table(this, 'TemplateTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'TemplateTableArn', {
      value: templateTable.tableArn,
      exportName: 'TemplateTableArn',
    });

    // templates by entity
    templateTable.addGlobalSecondaryIndex({
      indexName: 'templatesByEntity',
      partitionKey: { name: 'entityId', type: AttributeType.STRING },
      sortKey: { name: 'updatedAt', type: AttributeType.STRING },
    });

    // TEMPLATE SERVICE
    const templateServiceTable = new Table(this, 'TemplateServiceTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'templateId', type: AttributeType.STRING },
      sortKey: { name: 'serviceId', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'TemplateServiceTableArn', {
      value: templateServiceTable.tableArn,
      exportName: 'TemplateServiceTableArn',
    });

    // TRANSACTION
    const transactionTable = new Table(this, 'TransactionTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    new CustomCfnOutput(this, 'TransactionTableArn', {
      value: transactionTable.tableArn,
      exportName: 'TransactionTableArn',
    });

    // USER
    const userTable = new Table(this, 'UserTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    userTable.addGlobalSecondaryIndex({
      indexName: 'usersByReferralCode',
      partitionKey: {
        name: 'referralCode',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
    });

    new CustomCfnOutput(this, 'UserTableArn', {
      value: userTable.tableArn,
      exportName: 'UserTableArn',
    });

    // user table stream arn
    if (userTable.tableStreamArn) {
      new CustomCfnOutput(this, 'UserTableStreamArn', {
        value: userTable.tableStreamArn,
        exportName: 'UserTableStreamArn',
      });
    }

    // xero token
    const xeroTokenTable = new Table(this, 'XeroTokenTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    new CustomCfnOutput(this, 'XeroTokenTableArn', {
      value: xeroTokenTable.tableArn,
      exportName: 'XeroTokenTableArn',
    });

    // xero token
    const tokenTable = new Table(this, 'TokenTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    new CustomCfnOutput(this, 'TokenTableArn', {
      value: tokenTable.tableArn,
      exportName: 'TokenTableArn',
    });
  }
}
