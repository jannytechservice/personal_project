import { Duration, Expiration, Stack, StackProps } from 'aws-cdk-lib';
import { FieldLogLevel, GraphqlApi, SchemaFile } from 'aws-cdk-lib/aws-appsync';
import { AuthorizationType as AppSyncAuthorizationType } from 'aws-cdk-lib/aws-appsync';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CnameRecord, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import * as path from 'path';
import { CustomCfnOutput } from '../constructs/customCfnOutput';
import customImportValue from '../constructs/customImportValue';
import { CustomStringParameter } from '../constructs/customStringParameter';
import { setResourceName } from '../helpers';
import {
  apiDomainName,
  apiId,
  apiName,
  userPoolId,
} from '../helpers/constants';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';

interface AppSyncApiStackProps extends StackProps {
  readonly zone: IHostedZone;
}

export class AppSyncApiStack extends Stack {
  public readonly appSyncApi: GraphqlApi;

  constructor(scope: Construct, id: string, props: AppSyncApiStackProps) {
    super(scope, id, props);

    const userPool = UserPool.fromUserPoolId(this, 'UserPool', userPoolId);

    //identity pool unauthenticated role
    const unauthenticatedRoleArn = customImportValue('UnauthenticatedRoleArn');
    const unauthenticatedRole = Role.fromRoleArn(
      this,
      'identityPoolUnauthenticatedRole',
      unauthenticatedRoleArn
    );

    const appsyncCertificate = new Certificate(this, 'GraphQLApiCertificate', {
      domainName: apiDomainName,
      validation: CertificateValidation.fromDns(props.zone),
    });

    const apiLogRole = new Role(this, 'ApiLogRole', {
      roleName: setResourceName('ApiCloudWatchRole'),
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSAppSyncPushToCloudWatchLogs'
        ),
      ],
    });

    const appSyncApi = new GraphqlApi(this, apiId, {
      // project name
      name: apiName, //api name
      domainName: {
        certificate: appsyncCertificate,
        domainName: apiDomainName,
      },
      // TODO: implement non-deprecated schema
      schema: SchemaFile.fromAsset(
        path.join(__dirname, '../appsync/schema.graphql')
      ), //TODO: https://github.com/cdklabs/awscdk-appsync-utils should we implement?
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AppSyncAuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
        additionalAuthorizationModes: [
          // TODO: remove if not required.
          {
            authorizationType: AppSyncAuthorizationType.API_KEY,
            apiKeyConfig: {
              description: 'API Key for AppSync API',
              expires: Expiration.after(Duration.days(30)), //update days if required
            },
          },
          //TODO: review that this doesn't allow unauthenticated users
          { authorizationType: AppSyncAuthorizationType.IAM },
        ],
      },
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
        retention: RetentionDays.ONE_WEEK,
        role: apiLogRole,
      },
      xrayEnabled: true,
    });

    // create a cname to the appsync domain. will map to something like xxxx.cloudfront.net
    new CnameRecord(this, `CnameApiRecord`, {
      recordName: apiDomainName,
      zone: props.zone,
      domainName: appSyncApi.appSyncDomainName,
    });

    new CustomCfnOutput(this, 'GraphqlApiId', {
      value: appSyncApi.apiId,
      exportName: 'GraphqlApiId',
    });

    new CustomCfnOutput(this, 'GraphqlApiKey', {
      value: appSyncApi.apiKey as string,
      exportName: 'GraphqlApiKey',
    });

    new CustomStringParameter(this, 'GraphQLAPIKeyString', {
      parameterName: 'GraphQLAPIKey',
      stringValue: appSyncApi.apiKey as string,
    });

    new CustomCfnOutput(this, 'GraphqlApiUrl', {
      value: appSyncApi.graphqlUrl,
      exportName: 'GraphqlApiUrl',
    });

    new CustomStringParameter(this, 'GraphQLAPIURLString', {
      parameterName: 'GraphQLAPIURL',
      stringValue: appSyncApi.graphqlUrl,
    });

    new CustomCfnOutput(this, 'GraphqlApiArn', {
      value: appSyncApi.graphqlUrl,
      exportName: 'GraphqlApiArn',
    });

    this.appSyncApi = appSyncApi;

    appSyncApi.grantMutation(unauthenticatedRole, 'createPaymentMethodToken');
    appSyncApi.grantMutation(unauthenticatedRole, 'createPaymentGuest');
    appSyncApi.grantMutation(
      unauthenticatedRole,
      'createPaymentScheduledGuest'
    );
    appSyncApi.grantMutation(unauthenticatedRole, 'createTaskDocumentUrlGuest');
    appSyncApi.grantMutation(unauthenticatedRole, 'updateTaskGuest');
    appSyncApi.grantMutation(unauthenticatedRole, 'updateTaskPublic');
    appSyncApi.grantQuery(unauthenticatedRole, 'getTaskGuest');
    appSyncApi.grantQuery(unauthenticatedRole, 'getTaskPublic');
    appSyncApi.grantQuery(unauthenticatedRole, 'getPaymentGuest');
  }
}
