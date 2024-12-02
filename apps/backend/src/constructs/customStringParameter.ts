import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { setResourceName } from '../helpers';

interface CustomStringParameterProps {
  parameterName: string;
  stringValue: string;
}

export class CustomStringParameter extends Construct {
  constructor(scope: Construct, id: string, props: CustomStringParameterProps) {
    super(scope, id);

    new StringParameter(this, `${props.parameterName}StringParameter`, {
      parameterName: setResourceName(props.parameterName),
      stringValue: props.stringValue,
    });
  }
}
