import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components';
import { WBBox, WBFlex, WBTypography } from '@admiin-com/ds-web';
import ResetPwdForm from './ResetPasswordForm';
import { AuthError, RequestStatus } from '@admiin-com/ds-common';
import { PATHS } from '../../navigation/paths';
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [codeDelivery, setCodeDelivery] = useState<{
    deliveryMedium: string;
    destination: string;
  } | null>(null);
  const [authStatus, setAuthStatus] = useState<RequestStatus>('idle');
  const [authError, setAuthError] = useState<AuthError>({});

  const [, setSubmittedEmail] = useState('');

  /**
   * Gets code to reset password
   *
   * @param email
   */
  const getResetCode = async ({ email }: { email: string }) => {
    setAuthStatus('submitting');
    setAuthError({});
    setSubmittedEmail(email.toLowerCase().trim());

    try {
      const result = await resetPassword({
        username: email.toLowerCase().trim(),
      });

      const {
        //attributeName,
        deliveryMedium,
        destination,
      } = result.nextStep.codeDeliveryDetails;
      setCodeDelivery({
        destination: destination ?? '',
        deliveryMedium: deliveryMedium ?? '',
      });
    } catch (err: any) {
      console.log('ERROR forgot password get code: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
    setAuthStatus('success');
  };

  /**
   * Reset password with code
   * @param email
   * @param code
   * @param password
   */
  const onResetPassword = async ({
    email,
    code,
    password,
  }: {
    email: string;
    code: string;
    password: string;
  }) => {
    setAuthError({});
    setAuthStatus('submitting');
    try {
      await confirmResetPassword({
        username: email.toLowerCase().trim(),
        confirmationCode: code,
        newPassword: password,
      });
      window.alert(t('passwordHasBeenReset', { ns: 'common' }));
      navigate(PATHS.signIn, { replace: true });
    } catch (err: any) {
      console.log('ERROR forgot password submit: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
    setAuthStatus('success');
  };

  return (
    <PageContainer
      sx={{
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: 'background.default',
        height: '100%',
        overflowY: 'scroll',
      }}
    >
      <WBFlex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          width: ['100%', '80%', '80%', '80%', '60%'],
          paddingTop: 6,
          paddingBottom: 3,
        }}
      >
        <WBTypography variant="h2" sx={{ mt: { xs: 5, sm: 2 } }}>
          {t('resetPasswordTitle', { ns: 'common' })}
        </WBTypography>

        <WBBox mb={7}>
          {codeDelivery ? (
            <WBTypography
              variant="body2"
              fontWeight="regular"
              textAlign="center"
            >
              {t(
                codeDelivery?.deliveryMedium === 'SMS'
                  ? 'enterVerificationCodeSentSMS'
                  : 'enterVerificationCodeSentEmail',
                { ns: 'common' }
              )}{' '}
              <WBBox as="span" fontWeight="medium">
                {codeDelivery?.destination?.replace('+', '')}
              </WBBox>
            </WBTypography>
          ) : (
            <WBTypography
              mt={1}
              variant="body2"
              fontWeight="regular"
              textAlign="center"
            >
              {t('sendVerificationCodeResetPassword', { ns: 'common' })}
            </WBTypography>
          )}
        </WBBox>

        <ResetPwdForm
          authStatus={authStatus}
          authError={authError}
          codeDelivery={codeDelivery}
          getResetCode={getResetCode}
          resetPassword={onResetPassword}
        />
        <WBFlex sx={{ flexGrow: 1 }}></WBFlex>
      </WBFlex>
    </PageContainer>
  );
};

export default ResetPassword;
