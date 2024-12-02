import { gql, useLazyQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WBAlert, WBBox, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { useLocation, useNavigate } from 'react-router-dom';
import { OnboardingStatus } from '@admiin-com/ds-graphql';
import { PageContainer } from '../../components';
import { isLoggedInVar, subInVar } from '@admiin-com/ds-graphql';
import { getOnboardingPath } from '../../helpers/onboarding';
import { PATHS } from '../../navigation/paths';
import { AuthError, RequestStatus } from '@admiin-com/ds-common';
import NewPasswordForm, { NewPasswordFormData } from './NewPasswordForm';
import SignInForm, {
  ConfirmMfaFormData,
  ConfirmSignUpFormData,
  SignInFormData,
} from './SignInForm';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import mixpanel from 'mixpanel-browser';
import { SignInLogo } from '../../components/SignInLogo/SignInLogo';
import {
  confirmSignIn,
  confirmSignUp,
  fetchUserAttributes,
  resendSignUpCode,
  signIn,
  SignInOutput,
  FetchUserAttributesOutput,
} from 'aws-amplify/auth';
import { identifyUser } from 'aws-amplify/analytics';

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNewPasswordRequired, setIsNewPasswordRequired] =
    useState<boolean>(false);
  const [codeDelivery, setCodeDelivery] = useState<string>('');
  const [mfaCodeRequired, setMfaCodeRequired] = useState(false);
  const [authStatus, setAuthStatus] = useState<RequestStatus>('idle');
  const [authError, setAuthError] = useState<AuthError>({});
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedPassword, setSubmittedPassword] = useState('');

  const [getUser, { error: userError }] = useLazyQuery(gql(GET_USER));

  const from: string = useMemo(
    () => location.state?.from?.pathname || null,
    [location]
  );

  useEffect(() => {
    isLoggedInVar(false);
    localStorage.removeItem('sub');
  }, []);

  /**
   * Sign in a user
   *
   * @param data
   */
  const onSignIn = async (data: SignInFormData) => {
    setAuthStatus('submitting');
    setAuthError({});
    const { email, password } = data;

    if (email && password) {
      const params = {
        username: email?.toLowerCase()?.trim(),
        password,
      };

      let signInResponse;
      try {
        signInResponse = await signIn(params);
      } catch (err: any) {
        console.log('ERROR sign in: ', err.name);
        setAuthStatus('error');

        if (err.name === 'UserNotConfirmedException') {
          await resendCode({ email });
        } else if (err.name === 'UserAlreadyAuthenticatedException') {
          // user already signed in
        } else {
          setAuthError(err);
        }
      }

      if (
        signInResponse?.nextStep.signInStep ===
        'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
      ) {
        setSubmittedPassword(password);
        setIsNewPasswordRequired(true);
      } else {
        let userAttributes;
        try {
          userAttributes = await fetchUserAttributes();
        } catch (err: any) {
          console.log('ERROR get user attributes: ', err);
        }

        console.log('signInResponse: ', signInResponse);

        if (userAttributes?.sub) {
          localStorage.setItem('sub', userAttributes.sub as string);

          // update analytics userId
          const options = {
            userId: userAttributes.sub,
            userProfile: {
              email: userAttributes.email,
            },
          };

          try {
            await identifyUser(options);
          } catch (err) {
            console.log('ERROR identifyUser: ', err);
          }

          try {
            mixpanel.identify(userAttributes.sub);
          } catch (err) {
            console.log('ERROR mixpanel identify');
          }

          //mfa sign in
          // signInResponse.challengeName === 'SMS_MFA' ||
          if (
            signInResponse?.nextStep?.signInStep ===
            'CONTINUE_SIGN_IN_WITH_TOTP_SETUP'
          ) {
            setMfaCodeRequired(true);
          }

          // sign in success
          else {
            await onSignInSuccess(signInResponse, password, userAttributes);
          }
        }
      }
    }

    setAuthStatus('success');
  };

  const onSignInSuccess = async (
    signInResponse: SignInOutput | undefined,
    password = '',
    userAttributes: FetchUserAttributesOutput
  ) => {
    let loggedInUserData;
    if (
      signInResponse?.nextStep.signInStep !==
      'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
    ) {
      try {
        loggedInUserData = await getUser({
          variables: {
            id: userAttributes.sub,
          },
        });
      } catch (err) {
        console.log('ERROR getUser', err);
      }
    }

    const loggedInUser = loggedInUserData?.data?.getUser;

    setAuthStatus('success');
    if (loggedInUser?.onboardingStatus !== OnboardingStatus.COMPLETED) {
      isLoggedInVar(true);
      subInVar(userAttributes.sub);
      navigate(getOnboardingPath(loggedInUser), { replace: true });
    } else if (from) {
      isLoggedInVar(true);
      subInVar(userAttributes.sub);
      // redirect to intended page if set and is logged in
      navigate(from, { replace: true });
    } else {
      isLoggedInVar(true);
      subInVar(userAttributes.sub);
      // redirect to dashboard if logged in
      navigate(getOnboardingPath(loggedInUser), { replace: true });
    }
  };

  const onSubmitNewPassword = async ({ newPassword }: NewPasswordFormData) => {
    setAuthStatus('submitting');
    try {
      const confirm = await confirmSignIn({ challengeResponse: newPassword });
      console.log('confirm: ', confirm);

      let userAttributes;
      try {
        userAttributes = await fetchUserAttributes();
      } catch (err: any) {
        console.log('ERROR get user attributes: ', err);
      }

      if (userAttributes?.sub) {
        // at this time the user is logged in if no MFA required
        localStorage.setItem('sub', userAttributes.sub as string);

        let loggedInUserData;
        let loggedInUser;
        try {
          loggedInUserData = await getUser({
            variables: {
              id: userAttributes.sub,
            },
          });

          loggedInUser = loggedInUserData?.data?.getUser;
        } catch (err) {
          console.log('ERROR getUser', err);
        }
        isLoggedInVar(true);
        subInVar(userAttributes.sub);
        navigate(getOnboardingPath(loggedInUser), { replace: true });
      }
    } catch (err: any) {
      console.log('ERROR set new password: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  /**
   * Resend verification code for sign in
   */
  const resendCode = async ({ email }: { email: string }) => {
    setSubmittedEmail(email.toLowerCase().trim());

    try {
      const { deliveryMedium } = await resendSignUpCode({
        username: email.toLowerCase().trim(),
      });

      setCodeDelivery(deliveryMedium ?? '');
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }

    alert(t('unverifiedEmailSendCode', { ns: 'common' }));
  };

  const onConfirmSignUp = async ({
    email,
    password,
    code,
  }: ConfirmSignUpFormData) => {
    setAuthStatus('submitting');
    setAuthError({});

    let confirmSignUpResponse;
    try {
      confirmSignUpResponse = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }

    try {
      const params = {
        username: email.toLowerCase().trim(),
        password,
      };

      if (
        confirmSignUpResponse?.nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN'
      ) {
        localStorage.setItem('sub', confirmSignUpResponse?.userId as string);
        isLoggedInVar(true);
        subInVar(confirmSignUpResponse?.userId);
        setAuthStatus('success');
        navigate(PATHS.onboardingName, { replace: true });
      }
    } catch (err: any) {
      console.log('ERROR sign in: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  const onConfirmMfa = async ({ code }: ConfirmMfaFormData) => {
    setAuthStatus('submitting');
    try {
      const confirmSignInResponse = await confirmSignIn({
        challengeResponse: code,
      });
      console.log('confirmSignInResponse: ', confirmSignInResponse);

      const userAttributes = await fetchUserAttributes();

      await onSignInSuccess(confirmSignInResponse, undefined, userAttributes);
    } catch (err: any) {
      console.log('ERROR mfa sign in: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  const onResendCode = async () => {
    setAuthError({});
    setAuthStatus('idle');
    try {
      await resendSignUpCode({ username: submittedEmail });
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
        {!codeDelivery && !isNewPasswordRequired && (
          <WBBox sx={{ mb: { md: 5, xs: 1 } }}>
            <WBTypography
              variant="h2"
              sx={{
                mt: {
                  xs: 5,
                  sm: 2,
                },
              }}
            >
              {t('signInTitle', { ns: 'common' })}
            </WBTypography>
          </WBBox>
        )}

        {codeDelivery && isNewPasswordRequired && (
          <WBTypography variant="h2">
            {t('verificationSent', { ns: 'common' })}
          </WBTypography>
        )}
        {mfaCodeRequired && (
          <WBTypography variant="h2">
            {t('mfaCodeRequired', { ns: 'authentication' })}
          </WBTypography>
        )}

        <WBFlex flexDirection="row" flexWrap="wrap">
          {mfaCodeRequired && (
            <WBTypography variant="h2">
              {t('enterMfaCode', { ns: 'authentication' })}
            </WBTypography>
          )}
          {codeDelivery && !isNewPasswordRequired && (
            <WBTypography variant="h2" textAlign="center">
              {t('enterVerificationCodeSent', { ns: 'common' })}{' '}
              {submittedEmail}
            </WBTypography>
          )}
        </WBFlex>

        {!isNewPasswordRequired && (
          <SignInForm
            isNewPasswordRequired={isNewPasswordRequired}
            mfaCodeRequired={mfaCodeRequired}
            authError={authError}
            authStatus={authStatus}
            codeDelivery={codeDelivery}
            onSignIn={onSignIn}
            onConfirmSignUp={onConfirmSignUp}
            onConfirmMfa={onConfirmMfa}
            onResendCode={onResendCode}
          />
        )}

        {isNewPasswordRequired && (
          <NewPasswordForm
            submittedEmail={submittedEmail}
            authError={authError}
            authStatus={authStatus}
            oldPassword={submittedPassword}
            onSubmit={onSubmitNewPassword}
          />
        )}

        {userError?.message && (
          <WBAlert title={userError.message} severity="error" />
        )}
        <WBFlex sx={{ flexGrow: 1 }} />
      </WBFlex>
      <WBFlex flex={1} display={['none', 'none', 'flex']}>
        <SignInLogo />
      </WBFlex>
    </PageContainer>
  );
};

export default SignIn;
