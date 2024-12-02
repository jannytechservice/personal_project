import { REGEX } from '@admiin-com/ds-common';
import { WBBox, WBFlex, WBTelInput, WBTextField } from '@admiin-com/ds-web';
import { matchIsValidTel } from 'mui-tel-input';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { ClientInput } from '@admiin-com/ds-graphql';

interface Client {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  [key: string]: any; // This allows additional properties with any value
}

export interface ContactFormProps {
  disabled?: boolean;
  prefix?: string;
}

export function ContactForm({ disabled = false }: ContactFormProps) {
  const { t } = useTranslation();
  const inputs = React.useMemo(
    () => ({
      firstName: {
        label: t('firstName', { ns: 'contacts' }),
        name: 'firstName' as const,
        type: 'text',
        placeholder: t('firstNamePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: { required: t('firstNameRequired', { ns: 'contacts' }) },
      },
      lastName: {
        label: t('lastName', { ns: 'contacts' }),
        name: 'lastName' as const,
        type: 'text',
        placeholder: t('lastNamePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: { required: t('lastNameRequired', { ns: 'contacts' }) },
      },
      email: {
        label: t('email', { ns: 'contacts' }),
        name: 'email' as const,
        type: 'email',
        defaultValue: '',
        placeholder: t('emailPlaceholder', { ns: 'contacts' }),
        rules: {
          required: t('emailRequired', { ns: 'common' }),
          pattern: {
            value: REGEX.EMAIL,
            message: t('invalidEmail', { ns: 'common' }),
          },
        },
      },
      mobile: {
        label: t('mobile', { ns: 'contacts' }),
        name: 'mobile' as const,
        type: 'text',
        placeholder: t('mobilePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {
          validate: (value: string | null | undefined) =>
            value === null ||
            value === undefined ||
            value === '' ||
            matchIsValidTel(value) ||
            t('invalidMobile', { ns: 'common' }),
        },
      },
      phone: {
        label: t('phone', { ns: 'contacts' }),
        name: 'phone' as const,
        type: 'text',
        placeholder: t('phonePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {},
      },
    }),
    [t]
  );

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<{
    client: ClientInput;
  }>();

  return (
    <>
      <WBFlex flexDirection={['column', 'row']}>
        <WBBox flex={1} pr={[0, 3]}>
          <Controller
            control={control}
            name={`client.firstName`}
            rules={inputs.firstName.rules}
            defaultValue={inputs.firstName.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type="text"
                variant="standard"
                label={inputs.firstName.label}
                placeholder={inputs.firstName.placeholder}
                error={!!errors?.client?.firstName}
                helperText={errors?.client?.firstName?.message || ''}
                margin="dense"
                disabled={disabled}
              />
            )}
          />
        </WBBox>
        <WBBox flex={1} pl={[0, 3]}>
          <Controller
            control={control}
            name={`client.lastName`}
            rules={inputs.lastName.rules}
            defaultValue={inputs.lastName.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type="text"
                variant="standard"
                label={inputs.lastName.label}
                placeholder={inputs.lastName.placeholder}
                error={!!errors?.client?.lastName}
                helperText={errors?.client?.lastName?.message || ''}
                margin="dense"
                disabled={disabled}
              />
            )}
          />
        </WBBox>
      </WBFlex>
      <WBFlex flexDirection={['column', 'row']} mt={[0, 4]}>
        <WBBox flex={1} pr={[0, 3]}>
          <Controller
            control={control}
            name={`client.email`}
            rules={inputs.email.rules}
            defaultValue={inputs.email.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type="text"
                variant="standard"
                label={inputs.email.label}
                placeholder={inputs.email.placeholder}
                error={!!errors?.client?.email}
                helperText={errors?.client?.email?.message || ''}
                margin="dense"
                disabled={disabled}
              />
            )}
          />
        </WBBox>
        <WBBox flex={1} pl={[0, 3]}>
          <Controller
            control={control}
            name="client.mobile"
            defaultValue={inputs.mobile.defaultValue}
            rules={inputs.mobile.rules}
            render={({ field, fieldState }) => (
              //@ts-ignore - value shouldn't be null but is possible by react-form-hooks
              <WBTelInput
                {...field}
                variant="standard"
                helperText={
                  fieldState.invalid ? t('invalidPhone', { ns: 'common' }) : ''
                }
                error={fieldState.invalid}
                focusOnSelectCountry
                defaultCountry="AU"
                label={inputs.mobile.label}
                margin="dense"
                disabled={disabled}
              />
            )}
          />
        </WBBox>
      </WBFlex>

      <WBFlex flexDirection={['column', 'row']} mt={[0, 4]}>
        <WBBox flex={1} pr={[0, 3]}>
          <Controller
            control={control}
            name="client.phone"
            defaultValue={inputs.phone.defaultValue}
            rules={inputs.phone.rules}
            render={({ field, fieldState }) => (
              <WBTextField
                {...field}
                type="text"
                variant="standard"
                label={inputs.phone.label}
                placeholder={inputs.phone.placeholder}
                error={!!errors?.client?.phone}
                helperText={errors?.client?.phone?.message || ''}
                margin="dense"
                disabled={disabled}
              />
            )}
          />
        </WBBox>
      </WBFlex>
    </>
  );
}

export default ContactForm;
