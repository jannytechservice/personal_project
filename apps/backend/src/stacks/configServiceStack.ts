import { Duration, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { IGraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { JsResolverConstruct } from '../constructs/jsResolverConstruct';
import { getLambdaDefaultProps } from '../helpers';
import {
  env,
  restApiDomainName,
  zaiClientId,
  zaiClientScope,
  zaiDomain,
  zaiTokenDomain,
  zaiWebhookDomain,
} from '../helpers/constants';

interface ConfigServiceStackProps extends NestedStackProps {
  appSyncApi: IGraphqlApi;
  optionTable: ITable;
  entityTable: ITable;
  zaiSecrets: ISecret;
}

export class ConfigServiceStack extends NestedStack {
  constructor(scope: Construct, id: string, props: ConfigServiceStackProps) {
    super(scope, id, props);

    // OPTIONS
    const optionDS = props.appSyncApi.addDynamoDbDataSource(
      'OptionTableDataSource',
      props.optionTable
    );
    new JsResolverConstruct(this, 'GetOptionResolver', {
      api: props.appSyncApi,
      dataSource: optionDS,
      typeName: 'Query',
      fieldName: 'getOption',
      pathName: 'Query.getOption',
    });

    new JsResolverConstruct(this, 'CreateOptionResolver', {
      api: props.appSyncApi,
      dataSource: optionDS,
      typeName: 'Mutation',
      fieldName: 'createOption',
      pathName: 'Mutation.createOption',
    });

    // init env
    const initEnvFunc = new NodejsFunction(this, 'InitEnvFunction', {
      ...getLambdaDefaultProps(this, 'initEnv'),
      timeout: Duration.minutes(15),
      environment: {
        TABLE_ENTITY: props.entityTable.tableName,
        TABLE_OPTION: props.optionTable.tableName,
        ZAI_DOMAIN: zaiDomain,
        ZAI_TOKEN_DOMAIN: zaiTokenDomain,
        ZAI_WEBHOOK_DOMAIN: zaiWebhookDomain,
        ZAI_WEBHOOK_LISTENER_DOMAIN: `${restApiDomainName}/webhook-zai`, //TODO: obfuscation of webhook endpoint
        ZAI_CLIENT_ID: zaiClientId,
        ZAI_CLIENT_SCOPE: zaiClientScope,
        ENV: env,
      },
    });

    props.entityTable.grantWriteData(initEnvFunc);
    props.optionTable.grantWriteData(initEnvFunc);
    props.zaiSecrets.grantRead(initEnvFunc);

    new JsResolverConstruct(this, 'ListOptionsResolver', {
      api: props.appSyncApi,
      dataSource: optionDS,
      typeName: 'Query',
      fieldName: 'listOptions',
      pathName: 'Query.listOptions',
    });

    new JsResolverConstruct(this, 'OptionsByGroupResolver', {
      api: props.appSyncApi,
      dataSource: optionDS,
      typeName: 'Query',
      fieldName: 'optionsByGroup',
      pathName: 'Query.optionsByGroup',
    });
  }
}
