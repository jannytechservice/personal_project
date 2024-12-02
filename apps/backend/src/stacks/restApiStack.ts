import { IdentityPool } from '@aws-cdk/aws-cognito-identitypool-alpha';
import { Stack, StackProps } from 'aws-cdk-lib';
import {
  BasePathMapping,
  CognitoUserPoolsAuthorizer,
  Cors,
  DomainName,
  EndpointType,
  LambdaIntegration,
  RestApi,
  SecurityPolicy,
  AuthorizationType as RESTAuthorizationType,
  ResponseType,
} from 'aws-cdk-lib/aws-apigateway';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import {
  Effect,
  Policy,
  PolicyStatement,
  PolicyDocument,
  AnyPrincipal,
} from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CnameRecord, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { CustomCfnOutput } from '../constructs/customCfnOutput';
import customImportValue from '../constructs/customImportValue';
import { CustomStringParameter } from '../constructs/customStringParameter';
import { getLambdaDefaultProps } from '../helpers';
import {
  env,
  identityPoolId,
  restApiDomainName,
  restApiName,
  userPoolId,
  frankieOneWhiteListIps,
  ZaiWebhookIPs,
} from '../helpers/constants';

interface RestApiStackProps extends StackProps {
  readonly zone: IHostedZone;
}
export class RestApiStack extends Stack {
  constructor(scope: Construct, id: string, props: RestApiStackProps) {
    super(scope, id, props);

    // TABLES IMPORT
    const userTableArn = customImportValue('UserTableArn');
    const userTableStreamArn = customImportValue('UserTableStreamArn');
    const userTable = Table.fromTableAttributes(this, 'UserTable', {
      tableArn: userTableArn,
      tableStreamArn: userTableStreamArn,
      //localIndexes: [''],
    });

    // COGNITO AUTHENTICATION IMPORTS
    const identityPool = IdentityPool.fromIdentityPoolId(
      this,
      'IdentityPool',
      identityPoolId
    );

    const userPool = UserPool.fromUserPoolId(this, 'UserPool', userPoolId);

    const restCertificate = new Certificate(this, 'RestApiCertificate', {
      domainName: restApiDomainName,
      validation: CertificateValidation.fromDns(props.zone),
    });

    const ipWhitelistPolicy = new PolicyDocument({
      statements: [
        // zai
        new PolicyStatement({
          effect: Effect.DENY,
          principals: [new AnyPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: [
            `arn:aws:execute-api:${this.region}:${this.account}:*/POST/webhook-zai`,
          ],
          conditions: {
            NotIpAddress: {
              'aws:SourceIp': ZaiWebhookIPs,
            },
          },
        }),
        // zai
        new PolicyStatement({
          effect: Effect.ALLOW,
          principals: [new AnyPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: [
            `arn:aws:execute-api:${this.region}:${this.account}:*/POST/webhook-zai`,
            `arn:aws:execute-api:${this.region}:${this.account}:*/POST/webhook-frankieone/*`,
          ],
          conditions: {
            IpAddress: {
              'aws:SourceIp': ZaiWebhookIPs,
            },
          },
        }),
        // frankieone
        new PolicyStatement({
          effect: Effect.DENY,
          principals: [new AnyPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: [
            `arn:aws:execute-api:${this.region}:${this.account}:*/POST/webhook-frankieone/*`,
          ],
          conditions: {
            NotIpAddress: {
              'aws:SourceIp': frankieOneWhiteListIps,
            },
          },
        }),
        // frankieone
        new PolicyStatement({
          effect: Effect.ALLOW,
          principals: [new AnyPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: [
            `arn:aws:execute-api:${this.region}:${this.account}:*/POST/webhook-frankieone/*`,
          ],
          conditions: {
            IpAddress: {
              'aws:SourceIp': frankieOneWhiteListIps,
            },
          },
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          principals: [new AnyPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: [`arn:aws:execute-api:${this.region}:${this.account}:*`],
          conditions: {
            StringNotLike: {
              'aws:ResourceArn': [
                `arn:aws:execute-api:${this.region}:${this.account}:*/POST/webhook-frankieone/*`,
                `arn:aws:execute-api:${this.region}:${this.account}:*/POST/webhook-zai`,
              ],
            },
          },
        }),
      ],
    });

    // Define the RestApi and apply the policy
    const restApi = new RestApi(this, 'RestApiGateway', {
      description: 'Rest API gateway',
      restApiName,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS, // TODO: restrict to specific domains
        allowMethods: Cors.ALL_METHODS,
      },
      deployOptions: {
        stageName: env,
      },
      policy: ipWhitelistPolicy,
    });

    restApi.addGatewayResponse('Default4XXResponse', {
      type: ResponseType.DEFAULT_4XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'",
        'Access-Control-Allow-Headers':
          "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        'Access-Control-Allow-Methods': "'GET,OPTIONS,PUT,POST,DELETE,PATCH'",
      },
    });

    new CustomCfnOutput(this, 'RestApiId', {
      value: restApi.restApiId,
      exportName: 'RestApiId',
    });

    const customDomain = new DomainName(this, 'RestAPICustomDomain', {
      domainName: restApiDomainName,
      certificate: restCertificate,
      endpointType: EndpointType.EDGE,
      securityPolicy: SecurityPolicy.TLS_1_2,
    });

    new BasePathMapping(this, 'RestAPIBasePathMapping', {
      domainName: customDomain,
      restApi,
    });

    // cname for custom api domain name
    new CnameRecord(this, 'RestAPICustomDomainCnameRecord', {
      recordName: restApiDomainName,
      domainName: customDomain.domainNameAliasDomainName,
      zone: props.zone,
    });

    // authorizer for lambdas linked with rest api
    const restApiCognitoAuthorizer = new CognitoUserPoolsAuthorizer(
      this,
      'RestApiCognitoAuthorizer',
      {
        cognitoUserPools: [userPool],
      }
    );

    new CustomCfnOutput(this, 'RESTAPIName', {
      value: restApi.restApiName,
      exportName: 'RESTAPIName',
    });

    new CustomStringParameter(this, 'restAPINameString', {
      parameterName: 'RestApiName',
      stringValue: restApi.restApiName,
    });

    new CustomCfnOutput(this, 'RestApiGatewayEndpoint', {
      value: restApiDomainName,
      exportName: 'RestApiGatewayEndpoint',
    });

    new CustomStringParameter(this, 'RestApiGatewayEndpointString', {
      parameterName: `RestApiGatewayEndpoint`,
      stringValue: `https://${restApiDomainName}`,
    });

    // root resource id
    new CustomCfnOutput(this, 'RestApiRootResourceId', {
      exportName: 'RestApiRootResourceId',
      value: restApi.restApiRootResourceId,
    });

    const updateUserIdentityIdFunc = new NodejsFunction(
      this,
      'UpdateUserIdentityIdFunction',
      {
        ...getLambdaDefaultProps(this, 'updateUserIdentityId'),
        environment: {
          TABLE_USER: userTable.tableName,
          AUTH_USERPOOLID: userPool.userPoolId,
          AUTH_IDENTITYPOOLID: identityPool.identityPoolId,
        },
      }
    );
    const updateUserIdentityIdIntegration = new LambdaIntegration(
      updateUserIdentityIdFunc
    );
    const identityIdEndpoint = restApi.root.addResource('identity-id');
    identityIdEndpoint.addMethod('POST', updateUserIdentityIdIntegration, {
      authorizer: restApiCognitoAuthorizer,
      authorizationType: RESTAuthorizationType.COGNITO,
    });

    userTable.grantWriteData(updateUserIdentityIdFunc);
    updateUserIdentityIdFunc.role?.attachInlinePolicy(
      new Policy(this, 'UpdateUserIdentityIdFuncUserPoolPolicy', {
        statements: [
          new PolicyStatement({
            actions: ['cognito-idp:AdminUpdateUserAttributes'],
            effect: Effect.ALLOW,
            resources: [userPool.userPoolArn],
          }),
        ],
      })
    );
  }
}
