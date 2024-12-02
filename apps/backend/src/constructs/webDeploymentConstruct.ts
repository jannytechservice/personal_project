import { RemovalPolicy, StackProps } from 'aws-cdk-lib';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import {
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { CnameRecord, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { existsSync } from 'fs';
import { join } from 'path';
import { generateRandomNDigits, setResourceName } from '../helpers';
import { CustomCfnOutput } from './customCfnOutput';

interface WebDeploymentProps extends StackProps {
  readonly appName: string;
  readonly stage: string;
  readonly domain: string;
  readonly zone: IHostedZone;
  readonly type: string;
  readonly buildPath: string;
  readonly memoryLimit?: number;
  readonly useEfs?: boolean;
  readonly vpc?: Vpc;
  readonly backendExports: Record<string, any>;
}

export class WebDeploymentConstruct extends Construct {
  public readonly distribution: Distribution;

  constructor(scope: Construct, id: string, props: WebDeploymentProps) {
    super(scope, id);

    const certificate = new Certificate(this, 'WebCertificate', {
      domainName: props.domain,
      validation: CertificateValidation.fromDns(props.zone),
    });

    const deploymentBucket = new Bucket(this, 'WebDeploymentBucket', {
      bucketName: `${props.appName.toLowerCase()}-${props.type}-deployment-${
        props.stage
      }-${generateRandomNDigits(5)}`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    const uiDirectory = join(__dirname, props.buildPath);

    if (!existsSync(uiDirectory)) {
      console.warn('no ui directory found');
      throw new Error('No UI directory found. Deployment aborted.');
    }

    const originIdentity = new OriginAccessIdentity(
      this,
      'OriginAccessIdentity',
      {}
    );
    deploymentBucket.grantRead(originIdentity);

    const distribution = new Distribution(this, 'WebCloudfrontDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity,
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        '/pspdfkit/*': {
          origin: new S3Origin(deploymentBucket, {
            originAccessIdentity: originIdentity,
          }),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
      certificate,
      domainNames: [props.domain],
    });

    new CnameRecord(this, 'WebCloudfrontDistributionARecord', {
      recordName: props.domain,
      zone: props.zone,
      domainName: distribution.domainName,
    });

    new BucketDeployment(this, `WebBucketDeployment`, {
      destinationBucket: deploymentBucket,
      sources: [
        Source.asset(uiDirectory),
        Source.jsonData('backendExports.json', props.backendExports),
      ],
      distribution,
      distributionPaths: ['/*'],
      memoryLimit: props.memoryLimit ?? 128,
      useEfs: props.useEfs ?? false,
      vpc: props.vpc ?? undefined,
    });

    //new CfnOutput(this, `${props.appName}CloudfrontUrl`, {
    //  value: distribution.distributionDomainName,
    //  exportName: setResourceName(`${props.type}WebCloudfrontUrl`),
    //});

    new CustomCfnOutput(this, `${props.appName}CloudfrontUrl`, {
      value: distribution.distributionDomainName,
      exportName: setResourceName(`${props.type}WebCloudfrontUrl`),
    });

    //new CfnOutput(this, `DeploymentBucketName`, {
    //  value: deploymentBucket.bucketName,
    //  exportName: setResourceName(`${props.type}DeploymentBucketName`),
    //});

    new CustomCfnOutput(this, `DeploymentBucketName`, {
      value: deploymentBucket.bucketName,
      exportName: `${props.type}DeploymentBucketName`,
    });

    this.distribution = distribution;
  }
}
