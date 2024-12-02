import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';
import { CustomStringParameter } from '../constructs/customStringParameter';

// https://github.com/aws/aws-cdk/issues/1972
// https://github.com/ranguard/cdk-talk-examples/tree/master/code/lambda_layer_example/lib
export class LayerStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // Create a Lambda layer
    const dependencyLayer = new LayerVersion(this, 'DependencyLayer', {
      code: Code.fromAsset(path.join(__dirname, '../layers/dependencyLayer')),
      compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X],
      removalPolicy: RemovalPolicy.RETAIN, //??
      description: 'Layer for dependency packages and helper functions',
    });

    const awsDependencyLayer = new LayerVersion(this, 'AWSDependencyLayer', {
      code: Code.fromAsset(
        path.join(__dirname, '../layers/awsDependencyLayer')
      ),
      compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X],
      removalPolicy: RemovalPolicy.RETAIN, //??
      description: 'Layer for AWS SDK and other AWS services',
    });

    // store layer version in ssm and reference to. https://github.com/aws/aws-cdk/issues/1972

    // create ssm string param of layer version arn
    //new StringParameter(this, 'VersionArn', {
    //  parameterName: 'dependencyLambdaLayer',
    //  stringValue: dependencyLayer.layerVersionArn,
    //});

    new CustomStringParameter(this, 'VersionArn', {
      parameterName: 'dependencyLambdaLayer',
      stringValue: dependencyLayer.layerVersionArn,
    });

    new CustomStringParameter(this, 'AWSVersionArn', {
      parameterName: 'AWSDependencyLambdaLayer',
      stringValue: awsDependencyLayer.layerVersionArn,
    });
  }
}
