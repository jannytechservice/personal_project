import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { aws_pinpoint as pinpoint } from 'aws-cdk-lib';
import {
  AnyPrincipal,
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';
import * as path from 'path';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { CustomCfnOutput } from '../constructs/customCfnOutput';
import { CustomStringParameter } from '../constructs/customStringParameter';
import { PinpointEmailTemplate } from '../constructs/pinpointEmailTemplate';
import { setResourceName } from '../helpers';
import {
  appPrefix,
  debugEmailAddress,
  env,
  fromEmail,
  isProd,
  transactionalEmailDomain,
} from '../helpers/constants';

dotenv.config({ path: join(__dirname, '..', '.env') }); // TODO: refactor so i dont need to do for each file?

interface PinpointStackProps extends StackProps {
  test?: boolean;
}

export class PinpointStack extends Stack {
  public readonly pinpointApp: pinpoint.CfnApp;

  constructor(scope: Construct, id: string, props: PinpointStackProps) {
    super(scope, id, props);

    // new iam role for pinpoint
    const pinpointRole = new Role(this, 'PinpointRole', {
      assumedBy: new ServicePrincipal('pinpoint.amazonaws.com'),
    });

    // topic to receive errors from pinpoint email template rendering
    const templateRenderingErrorTopic = new Topic(
      this,
      'EmailTemplateRenderingErrorTopic',
      {
        topicName: setResourceName('EmailTemplateRenderingErrorTopic'),
        displayName: 'Email Template Rendering Error Topic',
      }
    );

    templateRenderingErrorTopic.addSubscription(
      new EmailSubscription(debugEmailAddress)
    );

    pinpointRole.addToPolicy(
      new PolicyStatement({
        actions: ['sns:Publish'],
        resources: [templateRenderingErrorTopic.topicArn],
      })
    );

    // pinpoint policies
    pinpointRole.addToPolicy(
      new PolicyStatement({
        actions: [
          'mobiletargeting:PutEvents',
          'mobiletargeting:PutItems',
          'mobiletargeting:PutEventStream',
          'mobiletargeting:SendUsersMessages',
          'mobiletargeting:SendMessages',
          'ses:SendEmail',
          'ses:SendTemplatedEmail',
          'mobiletargeting:GetEmailTemplate',
        ],
        resources: ['*'],
      })
    );

    // create a new Pinpoint application
    const pinpointApp = new pinpoint.CfnApp(this, 'PinpointApp', {
      name: `${appPrefix}${env}PinpointApp`,
    });

    // enable the Email channel for the Pinpoint application
    new pinpoint.CfnEmailChannel(this, 'PinpointEmailChannel', {
      applicationId: pinpointApp.ref,
      enabled: true,
      fromAddress: fromEmail, //The verified email address that you want to send email from when you send email through the channel.
      identity: `arn:aws:ses:${props.env?.region}:${props.env?.account}:identity/${transactionalEmailDomain}`, //The Amazon Resource Name (ARN) of the email identity that you want to use when you send email through the channel.
      roleArn: pinpointRole.roleArn, //The ARN of the AWS Identity and Access Management (IAM) role that you want Amazon Pinpoint to use when it submits email-related event data for the channel.
      configurationSet: setResourceName('pinpointConfigurationSet'), //The name of the configuration set that you want to use when sending email through the channel.
      //fromDisplayName: 'Admiin', //The display name that you want to use as the "From" address in the email that you send.
    });

    const emailTemplateBucket = new Bucket(this, 'EmailTemplateBucket', {
      bucketName: isProd
        ? `${appPrefix.toLowerCase()}email-media`
        : `${appPrefix.toLowerCase()}${env}email-media`,
      removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProd,
      cors: [
        {
          allowedMethods: [
            HttpMethods.GET,
            //HttpMethods.POST,
            //HttpMethods.PUT,
            //HttpMethods.DELETE,
          ],
          allowedOrigins: ['*'], //TODO: check amplify behaviour
          allowedHeaders: ['*'], //TODO: check amplify behaviour
        },
      ],
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      transferAcceleration: isProd,
    });

    new BucketDeployment(this, 'EmailTemplateFiles', {
      sources: [Source.asset(path.join(__dirname, '../pinpoint/email-assets'))],
      destinationBucket: emailTemplateBucket,
    });

    // add permissions to allow all users to read from bucket, block any other actions
    emailTemplateBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [new AnyPrincipal()],
        resources: [`arn:aws:s3:::${emailTemplateBucket.bucketName}/*`],
      })
    );

    // ****************************************************************************
    // EMAIL TEMPLATES
    // ****************************************************************************
    new PinpointEmailTemplate(this, 'WelcomeEmailTemplate', {
      templateName: 'welcome',
      templateDescription:
        'Welcome email sent to users when they sign up for our app.',
      subject: 'Welcome to Admiin',
    });

    new PinpointEmailTemplate(this, 'InvoiceNotificationEmailTemplate', {
      templateName: 'invoice',
      templateDescription: 'invoice notification',
      subject: 'Your Latest Invoice from {{task.from}}',
      defaultSubstitutions: {
        notes: '',
      },
    });

    // invoice reminder template
    new PinpointEmailTemplate(this, 'InvoiceReminderEmailTemplate', {
      templateName: 'invoice-reminder',
      templateDescription: 'invoice reminder',
      subject: 'Friendly Reminder: Invoice Due Soon from {{task.from}}',
    });

    // invoice overdue
    new PinpointEmailTemplate(this, 'InvoiceOverdueEmailTemplate', {
      templateName: 'invoice-overdue',
      templateDescription: 'invoice overdue from {{task.from}}',
      subject: 'Overdue Invoice',
    });

    // invoice confirmation payer
    new PinpointEmailTemplate(this, 'InvoiceConfirmationPayerEmailTemplate', {
      templateName: 'invoice-confirmation-payer',
      templateDescription: 'invoice confirmation payer',
      subject: 'Invoice Payment Confirmation',
    });

    // invoice confirmation payee
    new PinpointEmailTemplate(this, 'InvoiceConfirmationPayeeEmailTemplate', {
      templateName: 'invoice-confirmation-payee',
      templateDescription: 'invoice confirmation payee',
      subject: 'Invoice Payment Confirmation',
    });

    // signature notification template
    new PinpointEmailTemplate(this, 'SignatureNotificationEmailTemplate', {
      templateName: 'signature',
      templateDescription: 'signature notification',
      subject: '{{task.from}} Requires Your Signature',
    });

    // signature notification reminder template
    new PinpointEmailTemplate(this, 'SignatureReminderEmailTemplate', {
      templateName: 'signature-reminder',
      templateDescription: 'signature reminder',
      subject: 'Friendly Reminder: {{task.from}} Requires Your Signature',
    });

    // signature notification overdue template
    new PinpointEmailTemplate(this, 'SignatureOverdueEmailTemplate', {
      templateName: 'signature-overdue',
      templateDescription: 'signature overdue',
      subject: 'Overdue: {{task.from}} Requires Your Signature',
    });

    // document signed
    new PinpointEmailTemplate(this, 'DocumentSignedEmailTemplate', {
      templateName: 'document-signed',
      templateDescription: 'document signed',
      subject: '{{signer.name}} Signed Your Document',
    });

    // payment-incorrect-account-details-sending
    new PinpointEmailTemplate(
      this,
      'PaymentIncorrectAccountDetailsSendingEmailTemplate',
      {
        templateName: 'payment-incorrect-account-details-sending',
        templateDescription: 'payment incorrect account details - SENDING',
        subject: 'Payment Failed - Incorrect Receiving Account Details',
      }
    );

    // payment-incorrect-account-details-receiving
    new PinpointEmailTemplate(
      this,
      'PaymentIncorrectAccountDetailsReceivingEmailTemplate',
      {
        templateName: 'payment-incorrect-account-details-receiving',
        templateDescription: 'payment incorrect account details - RECEIVING',
        subject: 'Payment Failed - Incorrect Account Details',
      }
    );

    // dda form
    new PinpointEmailTemplate(this, 'DdaFormEmailTemplate', {
      templateName: 'dda-form',
      templateDescription: 'dda form',
      subject: 'Direct Debit Request Form',
    });

    // entity invitation
    new PinpointEmailTemplate(this, 'EntityInvitationEmailTemplate', {
      templateName: 'entity-invitation',
      templateDescription: 'Entity Invitation',
      subject: 'Entity Invitation',
    });

    // referral invitation
    new PinpointEmailTemplate(this, 'ReferralInvitationEmailTemplate', {
      templateName: 'referral-invitation',
      templateDescription: 'referral invitation',
      subject: '{{name}} Has Invited You to Join Admiin',
    });

    // signed notification to sender

    // paid for seller

    // welcome
    //const htmlPart = readFileSync(
    //  join(__dirname, '../pinpoint/email-templates/welcome/content.html'),
    //  'utf8'
    //);
    //const textPart = readFileSync(
    //  join(__dirname, '../pinpoint/email-templates/welcome/content.txt'),
    //  'utf8'
    //);
    //
    //new pinpoint.CfnEmailTemplate(this, 'WelcomeEmailTemplate', {
    //  templateName: `user-welcome-email-${env}`,
    //  templateDescription:
    //    'Welcome email sent to users when they sign up for our app.',
    //  subject: 'Welcome to Admiin',
    //  htmlPart,
    //  textPart
    //  //defaultSubstitutions: JSON.stringify({
    //  //  subject: 'Welcome to Admiin',
    //  //  senderName: 'Admiin',
    //  //  senderEmail: fromEmail,
    //  //  htmlPart: htmlContent,
    //  //  textPart: 'Welcome to our app!'
    //  //}),
    //});

    // guest task notification email

    // cloud function output
    //new CfnOutput(this, 'PinpointAppId', {
    //  value: pinpointApp.ref,
    //  exportName: setResourceName('PinpointApiId'),
    //});

    new CustomCfnOutput(this, 'PinpointAppId', {
      value: pinpointApp.ref,
      exportName: 'PinpointApiId',
    });

    new CustomStringParameter(this, 'PinpointApiIdString', {
      parameterName: 'PinpointApiId',
      stringValue: pinpointApp.ref,
    });

    new pinpoint.CfnSMSChannel(this, 'PinpointSMSChannel', {
      applicationId: pinpointApp.ref,
      enabled: true,
      senderId: 'Admiin',
    });

    this.pinpointApp = pinpointApp;
  }
}
