import { CfnEmailTemplate } from 'aws-cdk-lib/aws-pinpoint';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { join } from 'path';
import { appName, env } from '../helpers/constants';
import { generateTransactionalEmailHTML } from '../helpers/transactionalEmailTemplates';

export interface PinpointEmailTemplateProps {
  templateName: string;
  templateDescription: string;
  subject: string;
  defaultSubstitutions?: Record<any, any>;
}

export class PinpointEmailTemplate extends Construct {
  constructor(scope: Construct, id: string, props: PinpointEmailTemplateProps) {
    super(scope, id);

    const emailBody = readFileSync(
      join(
        __dirname,
        `../pinpoint/email-templates/${props.templateName}/content.html`
      ),
      'utf8'
    );

    const htmlPart = generateTransactionalEmailHTML({
      emailBody,
    });
    const textPart = readFileSync(
      join(
        __dirname,
        `../pinpoint/email-templates/${props.templateName}/content.txt`
      ),
      'utf8'
    );

    new CfnEmailTemplate(this, `${props.templateName}PinpointEmailTemplate`, {
      templateName: `${appName}${env}${props.templateName}`,
      templateDescription: props.templateDescription,
      subject: props.subject,
      htmlPart,
      textPart,
      defaultSubstitutions: JSON.stringify(props.defaultSubstitutions ?? {}),
    });
  }
}
