import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { setResourceName } from '../helpers';

interface CustomCfnOutputProps {
  value: string;
  exportName: string;
}

export class CustomCfnOutput extends Construct {
  constructor(scope: Construct, id: string, props: CustomCfnOutputProps) {
    super(scope, id);

    new CfnOutput(this, `${props.exportName}Output`, {
      value: props.value,
      exportName: setResourceName(props.exportName),
    });
  }
}
