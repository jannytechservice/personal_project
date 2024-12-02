import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { setResourceName } from '../helpers';

interface CustomStringLookupProps {
  parameterName: string;
}

export class CustomStringLookup extends Construct {
  public readonly value: string;

  constructor(scope: Construct, id: string, props: CustomStringLookupProps) {
    super(scope, id);

    this.value = StringParameter.valueFromLookup(
      this,
      setResourceName(props.parameterName)
    );
  }
}
