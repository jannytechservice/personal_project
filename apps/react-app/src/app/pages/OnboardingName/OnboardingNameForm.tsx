import {
  WBAlert,
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBTextField,
} from '@admiin-com/ds-web';
import { getNextOnboardingStep } from '@admiin-com/ds-common';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getOnboardingPath } from '../../helpers/onboarding';
import { useOnboardingProcess } from '../../components/OnboardingContainer/OnboadringContainer';

interface UserOnboardingFormData {
  firstName: string;
  lastName: string;
  about?: string;
}

const OnboardingNameForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserOnboardingFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const [loading, setLoading] = useState(false);

  const { user, sub, updateUser, initBusinessStep, updateError } =
    useOnboardingProcess();

  const inputs = useMemo(
    () => ({
      firstName: {
        label: t('firstNameTitle', { ns: 'common' }),
        placeholder: t('firstNamePlaceholder', { ns: 'common' }),
        name: 'firstName' as const,
        type: 'text',
        defaultValue: '',
        rules: {
          required: t('firstNameRequired', { ns: 'common' }),
        },
      },
      lastName: {
        label: t('lastNameTitle', { ns: 'common' }),
        name: 'lastName' as const,
        type: 'text',
        placeholder: t('lastNamePlaceholder', { ns: 'common' }),
        defaultValue: '',
        rules: {
          required: t('lastNameRequired', { ns: 'common' }),
        },
      },
    }),
    [t]
  );

  useEffect(() => {
    if (user.firstName) {
      setValue('firstName', user.firstName, { shouldValidate: true });
    }
    if (user.lastName) {
      setValue('lastName', user.lastName, { shouldValidate: true });
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserOnboardingFormData) => {
    setLoading(true);

    try {
      const [updateUserData] = await Promise.all([
        updateUser({
          variables: {
            input: {
              ...data,
              onboardingStatus: getNextOnboardingStep(user),
              id: sub,
            },
          },
        }),
        //updateUserAttributes(user, data),
      ]);

      setLoading(false);

      const updatedUser = updateUserData?.data?.updateUser;

      initBusinessStep();
      navigate(getOnboardingPath(updatedUser), {
        replace: true,
      });
    } catch (err) {
      console.log('ERROR updating user: ', err);
      setLoading(false);
    }
  };
  const renderErrorAlert = (error: any) => {
    if (error) {
      return <WBAlert title={error.message} severity="error" sx={{ my: 2 }} />;
    }
    return null;
  };

  return (
    <WBFlex
      flexDirection="column"
      alignItems="center"
      width={{
        xs: '100%',
        sm: '80%',
        md: '60%',
        lg: '40%',
      }}
    >
      <WBForm onSubmit={handleSubmit(onSubmit)} alignSelf="stretch">
        <Controller
          control={control}
          name={inputs.firstName.name}
          rules={inputs.firstName.rules}
          defaultValue={inputs.firstName.defaultValue}
          render={({ field }) => (
            <WBBox>
              <WBTextField
                {...field}
                label={inputs.firstName.label}
                type="text"
                placeholder={inputs.firstName.placeholder}
                error={!!(errors.firstName && errors.firstName.message)}
                helperText={
                  (errors.firstName && errors.firstName.message) || ''
                }
                margin="dense"
              />
            </WBBox>
          )}
        />
        <Controller
          control={control}
          name={inputs.lastName.name}
          rules={inputs.lastName.rules}
          defaultValue={inputs.lastName.defaultValue}
          render={({ field }) => (
            <WBBox sx={{ mt: 2 }}>
              <WBTextField
                {...field}
                label={inputs.lastName.label}
                type={inputs.lastName.type}
                placeholder={inputs.lastName.placeholder}
                error={!!(errors.lastName && errors.lastName.message)}
                helperText={
                  ((errors.lastName && errors.lastName.message) as string) || ''
                }
                margin="dense"
              />
            </WBBox>
          )}
        />
        <WBButton
          sx={{
            mt: {
              xs: 6,
              sm: 10,
            },
          }}
          loading={loading}
        >
          {t('nextTitle', { ns: 'common' })}
        </WBButton>
      </WBForm>
      {renderErrorAlert(updateError)}
    </WBFlex>
  );
};

export default OnboardingNameForm;
