import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { IGraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { IRole, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { LambdaAppSyncOperationConstruct } from '../constructs/lambdaAppSyncOperationConstruct';
import {
  account,
  createUserFuncName,
  ocrEmailDomain,
  region,
} from '../helpers/constants';

interface ClientServiceStackProps extends NestedStackProps {
  appSyncApi: IGraphqlApi;
  unauthenticatedRole: IRole;
  entityUserTable: ITable;
  entityTable: ITable;
  userTable: ITable;
  entityBeneficialOwnerTable: ITable;
  beneficialOwnerTable: ITable;
  userPool: IUserPool;
}

export class ClientServiceStack extends NestedStack {
  constructor(scope: Construct, id: string, props: ClientServiceStackProps) {
    super(scope, id, props);

    // CLIENTS
    const createClient = new LambdaAppSyncOperationConstruct(
      this,
      'CreateClientResolver',
      {
        api: props.appSyncApi,
        typeName: 'Mutation',
        fieldName: 'createClient',
        environmentVars: {
          TABLE_ENTITY_USER: props.entityUserTable.tableName,
          TABLE_ENTITY: props.entityTable.tableName,
          TABLE_USER: props.userTable.tableName,
          TABLE_ENTITY_BENEFICIAL_OWNER:
            props.entityBeneficialOwnerTable.tableName,
          TABLE_BENEFICIAL_OWNER: props.beneficialOwnerTable.tableName,
          FUNCTION_CREATEUSER: createUserFuncName,
          AUTH_USERPOOLID: props.userPool.userPoolId,
          OCR_EMAIL_DOMAIN: ocrEmailDomain,
        },
      }
    );

    props.entityUserTable.grantReadWriteData(createClient.lambda);
    props.entityTable.grantReadWriteData(createClient.lambda);
    props.userTable.grantReadWriteData(createClient.lambda);
    props.entityBeneficialOwnerTable.grantReadData(createClient.lambda);
    props.beneficialOwnerTable.grantReadData(createClient.lambda);
    // allow create cognito user permissions
    createClient.lambda.role?.attachInlinePolicy(
      new Policy(this, 'CreateClientFuncUserPoolPolicy', {
        statements: [
          new PolicyStatement({
            actions: [
              'cognito-idp:AdminGetUser',
              'cognito-idp:AdminCreateUser',
            ],
            resources: [props.userPool.userPoolArn],
          }),
        ],
      })
    );

    // invoke create user permissions
    createClient.lambda.role?.attachInlinePolicy(
      new Policy(this, 'CreateClientFuncInvokeCreateUserFunc', {
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
  }
}
