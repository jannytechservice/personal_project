import { NestedStack, SecretValue, StackProps } from 'aws-cdk-lib';
import { Secret, ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { env } from '../helpers/constants';

export class SecretsStack extends NestedStack {
  readonly zaiSecrets: ISecret;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.zaiSecrets = new Secret(this, 'ZaiSecrets', {
      secretName: `ZaiSecrets-${env}`,
      secretObjectValue: {
        zaiClientSecret: SecretValue.unsafePlainText(''),
        zaiWebhookSecret: SecretValue.unsafePlainText(''),
      },
    });
  }
}
