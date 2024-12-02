const { APP_NAME, COMPANY_NAME, DOMAIN, REPLY_TO_EMAIL, WEB_DOMAIN_NAME } =
  process.env;
import { CustomMessageTriggerEvent, Context, Callback } from 'aws-lambda';
import {
  generateCognitoWelcomeEmail,
  GenerateCognitoWelcomeEmailProps,
} from '../../helpers/cognitoEmailTemplate';

export const handler = async (
  event: CustomMessageTriggerEvent,
  context: Context,
  callback: Callback
) => {
  if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
    console.log('Event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context, null, 2));
    const { request } = event;
    const { userAttributes, clientMetadata } = request;

    const emailProps: GenerateCognitoWelcomeEmailProps = {
      appName: APP_NAME ?? '',
      companyName: COMPANY_NAME ?? '',
      domain: DOMAIN ?? '',
      replyToEmail: REPLY_TO_EMAIL ?? '',
      webDomainName: WEB_DOMAIN_NAME ?? '',
    };

    // Customize the email message
    event.response.emailSubject =
      clientMetadata?.invitedBy && clientMetadata?.entityName
        ? `${clientMetadata.invitedBy} has invited you to manage ${clientMetadata.entityName}`
        : `Welcome to ${emailProps.appName}, ${userAttributes.given_name}!`;
    event.response.emailMessage = generateCognitoWelcomeEmail(
      emailProps,
      true,
      clientMetadata
    );
  }

  callback(null, event);
};
