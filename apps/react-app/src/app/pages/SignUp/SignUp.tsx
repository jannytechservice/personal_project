import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components';
import { AuthError, RequestStatus } from '@admiin-com/ds-common';
import { WBBox, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { isLoggedInVar, subInVar } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
import SignUpForm, { SignUpFormData } from './SignUpForm';
import mixpanel from 'mixpanel-browser';
import { SignInLogo } from '../../components/SignInLogo/SignInLogo';
import { BackButton } from '../../components/BackButton/BackButton';
import {
  confirmSignUp,
  fetchUserAttributes,
  resendSignUpCode,
  signIn,
  signUp,
  SignUpInput,
  signOut,
} from 'aws-amplify/auth';
import { identifyUser } from 'aws-amplify/analytics';

export type VerifyStep = 'EMAIL' | 'PHONE' | 'CODE';

const SignUp = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState<RequestStatus>('idle');
  const [authError, setAuthError] = useState<AuthError>({});
  const [codeDelivery, setCodeDelivery] = useState<string>('');
  const [submittedPhone, setSubmittedPhone] = useState('');
  const [verifyStep, setVerifyStep] = useState<VerifyStep>('EMAIL');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedPassword, setSubmittedPassword] = useState('');
  const [submittedUserName, setSubmittedUserName] = useState('');
  const [submittedReferralCode, setSubmittedReferralCode] = useState('');

  // get signup code for phone verification
  const onGetCode = async (phone: string, referralCode?: string) => {
    console.log('submittedPassword: ', submittedPassword);
    setAuthStatus('submitting');
    const params: SignUpInput = {
      username: submittedUserName,
      password: submittedPassword,
      options: {
        userAttributes: {
          email: submittedEmail.toLowerCase().trim(),
          phone_number: phone.replace(/\s/g, '') ?? '',
          locale: i18n.resolvedLanguage,
        },
        autoSignIn: true,
      },
    };

    if (referralCode && params?.options?.userAttributes) {
      (params.options.userAttributes as { [key: string]: any })[
        'custom:referralCode'
      ] = referralCode;
    }

    if (phone) {
      setSubmittedPhone(phone);
    }

    console.log('signup params: ', params);

    try {
      const data = await signUp(params);
      console.log('signUp data: ', data);

      // @ts-ignore
      const codeDeliveryDetails = data.nextStep?.codeDeliveryDetails;

      setCodeDelivery(codeDeliveryDetails.deliveryMedium);
      setVerifyStep('CODE');
    } catch (err: any) {
      console.log('ERROR signUp: ', err);
      if (err?.name === 'UsernameExistsException') {
        try {
          const user = await resendSignUpCode({ username: submittedUserName });

          console.log('Verification code resent successfully', user);
          setVerifyStep('CODE'); // Move to code verification step
        } catch (resendError: any) {
          if (resendError.message === 'User is already confirmed.') {
            setVerifyStep('EMAIL');
          }
          console.error('Error resending code: ', resendError);
          setAuthError(resendError);
          setAuthStatus('error');
        }
      } else {
        setAuthError(err);
        setAuthStatus('error');
      }
    }

    setAuthStatus('success');
  };

  const onSignUp = async ({
    email,
    password,
    phone,
    referralCode,
  }: SignUpFormData) => {
    setSubmittedEmail(email);
    const username = email.toLowerCase().trim();

    if (username) {
      setSubmittedUserName(username);
    }
    if (referralCode) {
      setSubmittedReferralCode(referralCode);
    }

    setSubmittedPassword(password);

    setAuthStatus('submitting');
    // Check if the user already exists
    try {
      await signIn({ username, password });
      // If no error is thrown, the user already exists
      setAuthError({
        name: 'UserAlreadyConfirmed',
        message: 'User is already confirmed.',
      });
      setAuthStatus('error');
    } catch (error: any) {
      console.log('ERROR signIn: ', error);
      if (
        error.name === 'UserNotFoundException' ||
        error.name === 'UserNotConfirmedException'
      ) {
        // User does not exist, proceed to phone verification step
        setVerifyStep('PHONE');
      } else if (error.name === 'NotAuthorizedException') {
        // Handle other errors
        setAuthError({
          name: 'UserAlreadyConfirmed',
          message: 'User is already confirmed.',
        });
      } else if (error.name === 'UserAlreadyAuthenticatedException') {
        // log out user
        console.log('attempting sign out');
        await signOut();
        console.log('sucess signed out');
        setVerifyStep('PHONE');
        // sign up as new user
      }

      setAuthStatus('error');
    } finally {
      setAuthStatus('idle');
    }
  };

  const onConfirmSignUp = async ({ phone, password, code }: SignUpFormData) => {
    setAuthStatus('submitting');
    let response;

    try {
      //TODO: see if can autoSignIn
      response = await confirmSignUp({
        username: submittedUserName,
        confirmationCode: code,
      });
      console.log('response: ', response);
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }

    if (response) {
      try {
        const params = {
          username: submittedUserName,
          password,
        };

        const user = await signIn(params);

        let userAttributes;
        try {
          userAttributes = await fetchUserAttributes();
          console.log('userAttributes: ', userAttributes);
        } catch (err: any) {
          console.log('ERROR fetchUserAttributes: ', err);
        }

        console.log('useruseruser: ', user);
        console.log('userAttributes?.sub: ', userAttributes?.sub);

        localStorage.setItem('sub', userAttributes?.sub as string);

        // update analytics userId

        if (userAttributes?.sub) {
          const options = {
            userId: userAttributes?.sub,
            userProfile: {
              email: submittedUserName,
            },
          };

          try {
            await identifyUser(options);
          } catch (err) {
            console.log('ERROR identifyUser: ', err);
          }

          try {
            mixpanel.identify(userAttributes?.sub);
          } catch (err) {
            console.log('ERROR mixpanel identify');
          }

          isLoggedInVar(true);
          subInVar(userAttributes?.sub);
          // redirect to dashboard if logged in
          navigate(PATHS.onboardingName, { replace: true });
        }
      } catch (err: any) {
        console.log('ERROR sign in: ', err);
        setAuthError(err);
        setAuthStatus('error');
      }
    }
  };

  /**
   * Handle submit sign up form
   */
  const onSubmit = (data: SignUpFormData) => {
    console.log('onsubmit: ', data);
    console.log('verifyStep:', verifyStep);

    setAuthError({});

    if (verifyStep === 'EMAIL') {
      onSignUp(data);
    }

    if (verifyStep === 'PHONE') {
      onGetCode(data.phone, data.referralCode);
    }

    if (verifyStep === 'CODE') {
      onConfirmSignUp(data);
    }
  };

  /**
   * Reset code field and trigger resend new code
   */
  const onResendCode = async () => {
    setAuthError({});
    setAuthStatus('idle');
    try {
      await resendSignUpCode({ username: submittedUserName });
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  return (
    <PageContainer
      sx={{
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 0,
        height: '100%',
        overflowY: 'scroll',
      }}
    >
      <WBFlex
        flex={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingTop={[0, 6]}
        paddingBottom={[0, 3]}
        mx={2}
        position="relative"
      >
        {verifyStep !== 'EMAIL' ? (
          <BackButton
            onClick={() => {
              setVerifyStep('EMAIL');
            }}
          />
        ) : null}
        <WBBox sx={{ mb: { md: 5, xs: 1 } }}>
          <WBTypography
            variant="h2"
            sx={{
              mt: {
                xs: verifyStep !== 'EMAIL' ? 9 : 5,
                sm: verifyStep !== 'EMAIL' ? 6 : 2,
              },
              mx: 2,
              textAlign: 'center',
            }}
          >
            {verifyStep !== 'EMAIL'
              ? t('codeSent', { ns: 'common' })
              : t('signUpTitle', { ns: 'common' })}
          </WBTypography>

          {verifyStep === 'PHONE' && (
            <WBTypography textAlign="center">
              {t('sendVerificationCodeVerification', { ns: 'common' })}
            </WBTypography>
          )}
          {verifyStep === 'CODE' && (
            <WBTypography textAlign="center">
              {t('enterVerificationCodeSent', { ns: 'common' })}{' '}
              <WBBox as="span" fontWeight={600}>
                {submittedPhone}
              </WBBox>
            </WBTypography>
          )}
        </WBBox>

        <SignUpForm
          authError={authError}
          authStatus={authStatus}
          codeDelivery={codeDelivery}
          verifyStep={verifyStep}
          onSubmit={onSubmit}
          onGetCodePress={onGetCode}
          onResendCode={onResendCode}
        />

        <WBFlex sx={{ flexGrow: 1 }} />
        {/*{*/}
        {/*  <WBTypography variant="body1">*/}
        {/*    {t('alreadyHaveAccount', { ns: 'signUp' })}{' '}*/}
        {/*    <WBLink to={PATHS.signIn} underline="always">*/}
        {/*      {t('signInTitle', { ns: 'common' })}*/}
        {/*    </WBLink>*/}
        {/*  </WBTypography>*/}
        {/*}*/}

        {/* {codeDelivery && (
         <WBTypography>
         {t('enterVerificationCodeSent', { ns: 'common' })}{' '}
         <WBBox component="span" fontWeight={600}>
         {codeDelivery === 'EMAIL' ? submittedEmail : submittedPhone}
         </WBBox>
         </WBTypography>
         )} */}
        {/* <WBFlex mt={3}>
         <SignUpXero />
         </WBFlex> */}
      </WBFlex>
      <WBFlex flex={1} display={['none', 'none', 'flex']}>
        <SignInLogo />
      </WBFlex>
    </PageContainer>
  );
};

export default SignUp;
