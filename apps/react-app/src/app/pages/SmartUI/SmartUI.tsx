import { WBBox } from '@admiin-com/ds-web';
import React, { useEffect } from 'react';
import { useClientContext } from '../../components/ApolloClientProvider/ApolloClientProvider';

interface SmartUIProps {
  token: string;
  applicantReference: string;
}
function SmartUI({ token, applicantReference }: SmartUIProps) {
  const { output } = useClientContext();
  // const boxRef = React.useRef(null); // Initialize the ref here
  useEffect(() => {
    if (token && output.verificationUrl) {
      const widgetConfiguration = {
        frankieBackendUrl: output.verificationUrl,
        documentTypes: [
          'NATIONAL_HEALTH_ID',
          { type: 'PASSPORT', acceptedCountries: 'ALL' },
          'DRIVERS_LICENCE',
        ],
        idScanVerification: false,
        checkProfile: 'auto',
        maxAttemptCount: 5,
        googleAPIKey: false,
        phrases: {
          document_select: {
            title: 'Custom Text Here: Choose your ID',
            hint_message: "Choose which ID you'd like to provide.",
          },
        },
        requestAddress: { acceptedCountries: ['AUS', 'NZL'] },
        consentText:
          'I consent to the collection, use, and disclosure of my personal information in accordance with Admiin’s (SIGNPAY PTY LTD) <a href="admiin.com/privacy-policy">Privacy Policy</a>, and consent to my personal information being disclosed to a credit reporting agency or my information being checked with the document issuer or official record holder via third party systems in connection with a request to verify my identity in accordance with the AML/CTF Act.',
        //consentText:
        //  "I consent to my personal data being used as stated in Signpay Pty Ltd's (Admiin) Privacy Policy. For identity verification, I permit:\n" +
        //  '• Checking my details against official records via third parties;\n' +
        //  "• Signpay's agents acting as intermediaries as per Australian\n" +
        //  'Privacy Principles',
      };

      try {
        console.log('initalizse: ', applicantReference);
        window.frankieFinancial.initialiseOnboardingWidget({
          applicantReference,
          config: widgetConfiguration,
          width: '100%',
          height: '100%',
          ffToken: token,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [token, applicantReference, output]);

  return (
    <WBBox sx={{ width: '100%', height: '100%' }}>
      {/*@ts-ignore*/}
      <ff-onboarding-widget width="AUTO" height="100%" />
    </WBBox>
  );
}

export default SmartUI;
