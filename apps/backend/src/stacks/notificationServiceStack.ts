import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { IGraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { NoneDataSource } from 'aws-cdk-lib/aws-appsync/lib/data-source';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { JsResolverConstruct } from '../constructs/jsResolverConstruct';
import { LambdaAppSyncOperationConstruct } from '../constructs/lambdaAppSyncOperationConstruct';

interface NotificationServiceStackProps extends NestedStackProps {
  appSyncApi: IGraphqlApi;
  notificationTable: ITable;
  noDS: NoneDataSource;
  userTable: ITable;
  pinpointAppId: string;
}

export class NotificationServiceStack extends NestedStack {
  constructor(
    scope: Construct,
    id: string,
    props: NotificationServiceStackProps
  ) {
    super(scope, id, props);

    // NOTIFICATIONS
    const notificationDS = props.appSyncApi.addDynamoDbDataSource(
      'NotificationTableDataSource',
      props.notificationTable
    );

    // list notifications by user
    new JsResolverConstruct(this, 'NotificationsByUserResolver', {
      api: props.appSyncApi,
      dataSource: notificationDS,
      typeName: 'Query',
      fieldName: 'notificationsByUser',
      pathName: 'Query.notificationsByUser',
    });
    // create notification
    new JsResolverConstruct(this, 'CreateNotificationResolver', {
      api: props.appSyncApi,
      dataSource: notificationDS,
      typeName: 'Mutation',
      fieldName: 'createNotification',
      pathName: 'Mutation.createNotification',
    });
    // update notification
    new JsResolverConstruct(this, 'UpdateNotificationResolver', {
      api: props.appSyncApi,
      dataSource: notificationDS,
      typeName: 'Mutation',
      fieldName: 'updateNotification',
      pathName: 'Mutation.updateNotification',
    });
    // subscription to be notified when notification created
    new JsResolverConstruct(this, 'OnCreateNotificationResolver', {
      api: props.appSyncApi,
      dataSource: props.noDS,
      typeName: 'Subscription',
      fieldName: 'onCreateNotification',
      pathName: 'Subscription.onCreateNotification',
    });

    const createPushNotification = new LambdaAppSyncOperationConstruct(
      this,
      'CreatePushNotification',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createPushNotification',
        environmentVars: {
          TABLE_USER: props.userTable.tableName,
          ANALYTICS_PINPOINT_ID: props.pinpointAppId, //TODO pinpoint id and permissions
        },
      }
    );
    props.userTable.grantReadData(createPushNotification.lambda);
  }
}
