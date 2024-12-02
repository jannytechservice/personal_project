import * as cdk from 'aws-cdk-lib';
import { EbsDeviceVolumeType } from 'aws-cdk-lib/aws-ec2';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  Domain,
  EngineVersion,
  DomainProps,
} from 'aws-cdk-lib/aws-opensearchservice';
import { Construct } from 'constructs';
import { CustomCfnOutput } from '../constructs/customCfnOutput';
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources';
import { getLambdaDefaultProps } from '../helpers';
import { env } from '../helpers/constants';
export class OpenSearchStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //let domainProps: DomainProps | null = null;

    //if (isProd) {
    //}

    // create dev cheaper instance
    //else {
    const domainProps: DomainProps = {
      version: EngineVersion.OPENSEARCH_1_0,
      enableAutoSoftwareUpdate: true,
      zoneAwareness: {
        enabled: false,
      },
      ebs: {
        enabled: true,
        volumeSize: 10,
        volumeType: EbsDeviceVolumeType.GP3,
      },
      enforceHttps: true,
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
      },
      capacity: {
        dataNodes: 1,
        dataNodeInstanceType: 't3.small.search',
      },
    };

    //t2.micro.search	;
    //}

    //if (domainProps) {
    const domain = new Domain(this, 'OpenSearchDomain', domainProps);

    cdk.Tags.of(domain).add('env', env);

    // open search domain arn
    new CustomCfnOutput(this, 'OpenSearchDomainArn', {
      value: domain.domainArn,
      exportName: 'OpenSearchDomainArn',
    });

    // open search endpoint
    new CustomCfnOutput(this, 'OpenSearchDomainEndpoint', {
      value: domain.domainEndpoint,
      exportName: 'OpenSearchDomainEndpoint',
    });

    const createIndexFunction = new NodejsFunction(
      this,
      'CreateIndexFunction',
      {
        ...getLambdaDefaultProps(this, 'initOpenSearchIndexes'),
        environment: {
          OPENSEARCH_DOMAIN_ENDPOINT: domain.domainEndpoint,
        },
      }
    );

    domain.grantReadWrite(createIndexFunction);
    domain.grantIndexReadWrite('user', createIndexFunction);
    domain.grantIndexReadWrite('contact', createIndexFunction);
    domain.grantIndexReadWrite('autocomplete-result', createIndexFunction);

    const customResource = new AwsCustomResource(
      this,
      'CreateIndexCustomResource',
      {
        onCreate: {
          service: 'Lambda',
          action: 'invoke',
          parameters: {
            FunctionName: createIndexFunction.functionName,
          },
          physicalResourceId: PhysicalResourceId.of(
            'CreateIndexCustomResource'
          ),
        },
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      }
    );

    createIndexFunction.grantInvoke(customResource);
    // depends on
    createIndexFunction.node.addDependency(domain);
  }
}
