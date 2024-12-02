import { Stack, StackProps } from 'aws-cdk-lib';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { CustomStringLookup } from '../constructs/CustomStringLookup';
import {
  appName,
  appPrefix,
  domain,
  env,
  frankieOneSmartUiDomain,
  isProd,
} from '../helpers/constants';
import { WebDeploymentStack } from './webDeploymentStack';

const webDomainName = isProd ? `app.${domain}` : `app-${env}.${domain}`;

interface FrontendStackProps extends StackProps {
  readonly zone: IHostedZone;
}

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    // vpc due to limited storage on lambda for deployment bucket
    //const deploymentVpcStack = new DeploymentVpcStack(
    //  this,
    //  'DeploymentVpcStack',
    //  {}
    //);

    // get params from ssm for frontend application
    //const identityPoolId = StringParameter.valueFromLookup(
    //  this,
    //  setResourceName(`identityPoolId`)
    //);

    const identityPoolIdLookup = new CustomStringLookup(
      this,
      'IdentityPoolIdLookup',
      {
        parameterName: 'IdentityPoolId',
      }
    );
    const identityPoolId = identityPoolIdLookup.value;

    const userPoolIdLookup = new CustomStringLookup(this, 'UserPoolIdLookup', {
      parameterName: 'UserPoolId',
    });
    const userPoolId = userPoolIdLookup.value;

    //const userPoolId = StringParameter.valueFromLookup(this, 'userPoolId');

    const userPoolClientIdLookup = new CustomStringLookup(
      this,
      'UserPoolClientIdLookup',
      {
        parameterName: 'UserPoolClientId',
      }
    );

    const userPoolClientId = userPoolClientIdLookup.value;

    //const userPoolClientId = StringParameter.valueFromLookup(
    //  this,
    //  `${appPrefix}${env}userPoolClientId`
    //);
    const graphQLAPIURLLookup = new CustomStringLookup(
      this,
      'GraphqlApiUrlLookup',
      {
        parameterName: 'GraphQLAPIURL',
      }
    );

    const graphQLAPIURL = graphQLAPIURLLookup.value;
    //const graphQLAPIURL = StringParameter.valueFromLookup(
    //  this,
    //  `${appPrefix}${env}graphQLAPIURL`
    //);

    const graphQLAPIKeyLookup = new CustomStringLookup(this, 'graphQLAPIKey', {
      parameterName: 'GraphQLAPIKey',
    });
    const graphQLAPIKey = graphQLAPIKeyLookup.value;

    //const graphQLAPIKey = StringParameter.valueFromLookup(
    //  this,
    //  `${appPrefix}${env}graphQLAPIKey`
    //);

    //const region = StringParameter.valueFromLookup(this, 'backendRegion');
    const restApiNameLookup = new CustomStringLookup(this, 'restApiName', {
      parameterName: 'RestApiName',
    });
    const restApiName = restApiNameLookup.value;

    const restApiGatewayEndpointLookup = new CustomStringLookup(
      this,
      'restApiGatewayEndpoint',
      {
        parameterName: 'RestApiGatewayEndpoint',
      }
    );
    const restApiGatewayEndpoint = restApiGatewayEndpointLookup.value;

    //StringParameter.valueFromLookup(
    //  this,
    //  `${appPrefix}${env}restApiGatewayEndpoint`
    //);

    const mediaBucketNameLookup = new CustomStringLookup(
      this,
      'MediaBucketName',
      {
        parameterName: 'MediaBucketName',
      }
    );

    const mediaBucketName = mediaBucketNameLookup.value;

    //const mediaBucketName = StringParameter.valueFromLookup(
    //  this,
    //  `${appPrefix}${env}mediaBucketName`
    //);

    const placeIndexNameLookup = new CustomStringLookup(
      this,
      'PlaceIndexName',
      {
        parameterName: 'placeIndexName',
      }
    );
    const placeIndexName = placeIndexNameLookup.value;

    const pinpointAppIdLookup = new CustomStringLookup(
      this,
      'PinpointApiIdString',
      {
        parameterName: 'PinpointApiId',
      }
    );

    const pinpointAppId = pinpointAppIdLookup.value;

    const backendExports = {
      identityPoolId,
      userPoolId,
      userPoolClientId,
      graphQLAPIURL,
      graphQLAPIKey,
      mediaBucketName,
      region: this.region,
      restApiName,
      restApiGatewayEndpoint,
      placeIndexName,
      pinpointAppId,
      verificationUrl: frankieOneSmartUiDomain,
      env,
    };

    console.log('Generated backendExports: ', backendExports);

    // react app
    new WebDeploymentStack(this, `${appPrefix}WebDeploymentStack`, {
      appName,
      stage: env,
      domain: webDomainName,
      zone: props.zone,
      type: 'web',
      buildPath: '../../../../dist/apps/react-app',
      backendExports,
      memoryLimit: 512, //e-signature deployment causing issues, likely due to file size in public directory for react-app
      //useEfs: true,
      //vpc: deploymentVpcStack.vpc,
    });

    // backoffice app
    //new WebDeploymentStack(app, `${appPrefix}BackofficeDeploymentStack`, {
    //  env: {
    //    ...defaultEnv,
    //  },
    //  appName,
    //  stage,
    //  domain: backofficeDomainName,
    //  zone: route53Stack.zone,
    //  type: 'backoffice',
    //  buildPath: '../../../../dist/apps/backoffice-app',
    //});
  }
}
