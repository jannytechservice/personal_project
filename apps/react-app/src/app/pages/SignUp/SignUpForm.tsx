import React, { useMemo, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  REGEX,
  PASSWORD_POLICY,
  SIGNUP_CODE_CHARS,
  RequestStatus,
  TERMS_CONDITIONS_URL,
  PRIVACY_POLICY_URL,
} from '@admiin-com/ds-common';
import {
  WBAlert,
  WBButton,
  WBFlex,
  WBForm,
  WBIcon,
  WBIconButton,
  WBLink,
  WBTelInput,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { matchIsValidTel } from 'mui-tel-input';
import { PasswordPolicyCheck } from '../../components/PasswordPolicyCheck/PasswordPolicyCheck';
import { PATHS } from '../../navigation/paths';
import { VerifyStep } from './SignUp';
import AdmiinLogo from '../../components/AdmiinLogo/AdmiinLogo';
import { useSearchParams } from 'react-router-dom';
import { InputLabel } from '@mui/material';

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  code: string;
  referralCode?: string;
}

interface SignUpFormProps {
  authError: any;
  authStatus: RequestStatus;
  codeDelivery: string;
  verifyStep: VerifyStep;
  onSubmit: SubmitHandler<any>;
  onResendCode: () => void;
  onGetCodePress: (phone: string) => void;
}

const SignUpForm = ({
  authError,
  authStatus,
  onSubmit,
  verifyStep,
  onResendCode,
}: SignUpFormProps) => {
  const { t, i18n } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordInput = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const { password } = watch();

  const inputs = useMemo(
    () => ({
      email: {
        label: t('emailTitle', { ns: 'common' }),
        name: 'email',
        type: 'email',
        placeholder: t('emailPlaceholder', { ns: 'common' }),

        defaultValue: '',
        rules: {
          required: t('emailRequired', { ns: 'common' }),
          pattern: {
            value: REGEX.EMAIL,
            message: t('invalidEmail', { ns: 'common' }),
          },
        },
      },
      phone: {
        label: t('mobileTitle', { ns: 'common' }),
        name: 'phone',
        placeholder: '',
        defaultValue: '',
        rules: { validate: matchIsValidTel },
      },
      referral: {
        label: t('referralTitle', { ns: 'common' }),
        name: 'referralCode',
        placeholder: t('referralPlaceholder', { ns: 'common' }),
        defaultValue: '',
        type: 'text',
        rules: {},
      },
      password: {
        label: t('passwordTitle', { ns: 'common' }),
        name: 'password',
        type: 'password',
        placeholder: t('passwordPlaceholder', { ns: 'common' }),
        defaultValue: '',
        rules: {
          required: t('passwordRequired', { ns: 'common' }),
          minLength: {
            value: PASSWORD_POLICY.length,
            message: `${t('passwordMustBe', { ns: 'common' })} ${
              PASSWORD_POLICY.length
            } ${t('orMoreCharacters', { ns: 'common' })}`,
          },

          validate: {
            lowercase: (value: string) =>
              PASSWORD_POLICY.lowercase
                ? /[a-z]/.test(value) ||
                  'Password must include at least one lowercase letter'
                : true,
            uppercase: (value: string) =>
              PASSWORD_POLICY.uppercase
                ? /[A-Z]/.test(value) ||
                  'Password must include at least one uppercase letter'
                : true,
            number: (value: string) =>
              PASSWORD_POLICY.numbers
                ? /[0-9]/.test(value) ||
                  'Password must include at least one number'
                : true,
            symbol: (value: string) =>
              PASSWORD_POLICY.symbols
                ? /[^A-Za-z0-9]/.test(value) ||
                  'Password must include at least one symbol'
                : true,
          },
        },
      },
      code: {
        name: 'code',
        label: t('codeTitle', { ns: 'common' }),
        placeholder: '',
        defaultValue: '',
        type: 'number',
        rules: {
          required: t('codeRequired', { ns: 'common' }),
          minLength: {
            value: SIGNUP_CODE_CHARS,
            message: `${t('codeMustBe', {
              ns: 'common',
            })} ${SIGNUP_CODE_CHARS} ${t('characters', { ns: 'common' })}`,
          },
        },
      },
    }),
    [t]
  );

  /**
   * Reset code field and trigger resend new code
   */

  const onResendCodePress = async () => {
    setValue('code', '');

    onResendCode();
  };
  const alreadyExists = authError?.message === 'User is already confirmed.';

  const [isReferralCodeVisible, setIsReferralCodeVisible] = useState(false);

  const hideReferralCode = () => {
    setIsReferralCodeVisible(!isReferralCodeVisible);
  };

  const [searchParams] = useSearchParams();

  const referralCodeFromUrl = searchParams.get('referralCode');

  React.useEffect(() => {
    if (referralCodeFromUrl) {
      setValue('referralCode', referralCodeFromUrl);
      setIsReferralCodeVisible(true);
    }
  }, [referralCodeFromUrl]);

  return (
    <WBFlex
      alignItems="center"
      width={{
        xs: '80%',
        sm: '80%',
        md: '60%',
        lg: '60%',
      }}
      flexDirection={'column'}
    >
      {verifyStep === 'EMAIL' ? (
        <WBFlex mt={2} justifyContent={'start'} width={'100%'}>
          <AdmiinLogo />
        </WBFlex>
      ) : null}

      {verifyStep === 'EMAIL' && (
        <WBFlex alignSelf={'flex-start'}>
          <WBTypography variant="body1" textAlign="left" mt={1}>
            {t('alreadyHaveAccount', { ns: 'signUp' })}{' '}
            <WBLink to={PATHS.signIn} underline="always">
              {t('signInTitle', { ns: 'common' })}
            </WBLink>
          </WBTypography>
        </WBFlex>
      )}

      <WBForm onSubmit={handleSubmit(onSubmit)} alignSelf="stretch">
        {verifyStep === 'PHONE' && (
          <Controller
            name={inputs.phone.name}
            defaultValue={inputs.phone.defaultValue}
            control={control}
            rules={inputs.phone.rules}
            render={({ field, fieldState }) => (
              <WBTelInput
                {...field}
                variant="standard"
                helperText={
                  fieldState.invalid ? t('invalidMobile', { ns: 'common' }) : ''
                }
                autoFocus
                error={fieldState.invalid}
                focusOnSelectCountry
                defaultCountry="AU"
                label={inputs.phone.label}
                margin="dense"
              />
              // <WBPhInput
              //   {...field}
              //   defaultCountry="AU"
              //   error={fieldState.invalid}
              //   autoFocus
              //   label={inputs.phone.label}
              // />
            )}
          />
        )}
        {verifyStep === 'CODE' && (
          <Controller
            control={control}
            name={inputs.code.name}
            rules={inputs.code.rules}
            defaultValue={inputs.code.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                autoFocus
                type={inputs.code.type}
                label={inputs.code.label}
                //placeholder={inputs.email.placeholder}
                error={!!(errors.code && errors.code.message)}
                helperText={
                  ((errors.code && errors.code.message) || '') as string
                }
                rightIcon={
                  <WBLink
                    variant="body2"
                    underline="always"
                    textAlign="right"
                    type="button"
                    width={120}
                    onClick={onResendCodePress}
                  >
                    {t('resendCodeTitle', { ns: 'common' })}
                  </WBLink>
                }
                margin="dense"
              />
            )}
          />
        )}
        {verifyStep === 'EMAIL' && (
          <>
            <Controller
              control={control}
              name={inputs.email.name}
              rules={inputs.email.rules}
              defaultValue={inputs.email.defaultValue}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  autoFocus
                  type={inputs.email.type}
                  label={inputs.email.label}
                  placeholder={inputs.email.placeholder}
                  error={!!(errors.email && errors.email.message)}
                  helperText={
                    ((errors.email && errors.email.message) as string) || ''
                  }
                  margin="dense"
                />
              )}
            />
            <Controller
              control={control}
              name={inputs.password.name}
              rules={inputs.password.rules}
              defaultValue={inputs.password.defaultValue}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type={isPasswordVisible ? 'text' : 'password'}
                  inputRef={passwordInput}
                  label={inputs.password.label}
                  placeholder={inputs.password.placeholder}
                  rightIcon={
                    <WBIconButton
                      size="small"
                      sx={{ opacity: isPasswordVisible ? 1 : 0.1 }}
                      icon={isPasswordVisible ? 'EyeOff' : 'Eye'}
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    />
                  }
                  error={!!(errors.password && errors.password.message)}
                  helperText={
                    ((errors.password && errors.password.message) as string) ||
                    ''
                  }
                  margin="dense"
                />
              )}
            />
            <Controller
              control={control}
              name={inputs.referral.name}
              rules={inputs.referral.rules}
              defaultValue={inputs.referral.defaultValue}
              render={({ field }) =>
                isReferralCodeVisible ? (
                  <WBTextField
                    {...field}
                    type={inputs.referral.type}
                    label={inputs.referral.label}
                    placeholder={inputs.referral.placeholder}
                    error={!!(errors.referral && errors.referral.message)}
                    helperText={
                      ((errors.referral &&
                        errors.referral.message) as string) || ''
                    }
                    rightLabel={
                      <WBFlex
                        justifyContent={'center'}
                        alignItems={'center'}
                        sx={{ cursor: 'pointer' }}
                        onClick={hideReferralCode}
                      >
                        <WBTypography variant="body2" color="GrayText" mr={1}>
                          {t('Optional', { ns: 'common' })}
                        </WBTypography>
                        <WBIcon name="ChevronUp" size={2} />
                      </WBFlex>
                    }
                    margin="dense"
                  />
                ) : (
                  <InputLabel
                    sx={{
                      marginTop: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {t('referralTitle', { ns: 'common' })}
                    <WBFlex
                      justifyContent={'center'}
                      alignItems={'center'}
                      sx={{ cursor: 'pointer' }}
                      onClick={hideReferralCode}
                    >
                      <WBTypography variant="body2" color="GrayText" mr={1}>
                        {t('Optional', { ns: 'common' })}
                      </WBTypography>
                      <WBIcon name="ChevronDown" size={2} />
                    </WBFlex>
                  </InputLabel>
                )
              }
            />
          </>
        )}
        {authError?.name && (
          <WBAlert
            title={
              alreadyExists
                ? ''
                : i18n.exists(authError.name)
                ? t(authError.name, { ns: 'authentication' })
                : authError?.message
            }
            severity={alreadyExists ? 'warning' : 'error'}
          >
            {alreadyExists ? (
              <WBTypography>
                {t('alreadyExists', { ns: 'authentication' })}{' '}
                <WBLink
                  to={PATHS.signIn}
                  underline="always"
                  fontSize={'body2.fontSize'}
                  color={'inherit'}
                >
                  {t('tryLogin', { ns: 'common' })}
                </WBLink>
              </WBTypography>
            ) : null}
          </WBAlert>
        )}

        {verifyStep === 'EMAIL' && (
          <PasswordPolicyCheck password={password} sx={{ mt: 1 }} />
        )}

        <WBFlex mb={1}>
          <WBButton
            sx={{ mt: 6 }}
            fullWidth
            loading={authStatus === 'submitting'}
          >
            {verifyStep === 'EMAIL' && t('proceedTitle', { ns: 'common' })}
            {verifyStep === 'PHONE' && t('getCodeTitle', { ns: 'common' })}
            {verifyStep === 'CODE' && t('signUpTitle', { ns: 'common' })}
          </WBButton>
        </WBFlex>
        {/*{verifyStep === 'EMAIL' ? <OAuthButton/> : null}*/}

        {verifyStep === 'EMAIL' && (
          <WBTypography
            mb={1}
            mt={3}
            variant="body2"
            fontWeight="regular"
            color="GrayText"
            textAlign="center"
          >
            {t('signUpAgreeTo', { ns: 'signUp' })}{' '}
            <WBLink
              href={TERMS_CONDITIONS_URL}
              target="_blank"
              underline="always"
              variant="body2"
              sx={{ color: 'inherit', fontWeight: 'inherit' }}
              color="text.primary"
            >
              {t('termsConditionsTitle', { ns: 'common' })}
            </WBLink>{' '}
            {t('and', { ns: 'signUp' })}{' '}
            <WBLink
              href={PRIVACY_POLICY_URL}
              target="_blank"
              underline="always"
              variant="body2"
              sx={{ color: 'inherit', fontWeight: 'inherit' }}
              color="text.primary"
            >
              {t('privacyPolicyTitle', { ns: 'common' })}
            </WBLink>
          </WBTypography>
        )}
      </WBForm>
    </WBFlex>
  );
};

export default SignUpForm;
