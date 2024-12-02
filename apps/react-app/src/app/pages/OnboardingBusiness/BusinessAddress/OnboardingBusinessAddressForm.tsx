import { gql, useMutation } from '@apollo/client';
import {
  WBAlert,
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBLink,
  WBSelect,
  WBTextField,
} from '@admiin-com/ds-web';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Address,
  AddressInput,
  CreateEntityInput,
  updateEntity as UPDATE_ENTITY,
} from '@admiin-com/ds-graphql';
import { WBLocationCompletion } from '@admiin-com/ds-amplify-web';
import { useOnboardingProcess } from '../../../components/OnboardingContainer/OnboadringContainer';
import { AddressResponse } from 'libs/amplify-web/src/lib/components/LocationAutoCompletion/LocationAutoCompletion';
import { STATES_AUSTRALIA } from '@admiin-com/ds-common';
import { mapStreetType } from '../../../helpers/entities';

const OnboardingBusinessAddressForm = () => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useFormContext<{ entity: CreateEntityInput }>();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { nextBusiness, isNotOnboarding, onboardingEntityId } =
    useOnboardingProcess();

  const [isManual, setIsManual] = React.useState(false);
  const [updateEntity, { error: updateError }] = useMutation(
    gql(UPDATE_ENTITY)
  );

  const inputs = useMemo(
    () => ({
      address: {
        label: t('businessAddress', { ns: 'onboarding' }),
        name: 'entity.address.address1' as const,
        type: 'text',
        placeholder: t('businessAddressPlaceholder', { ns: 'onboarding' }),
        defaultValue: '',
        rules: isManual
          ? {}
          : { required: t('businessAddressRequired', { ns: 'onboarding' }) },
      },
      manual: {
        unit_number: {
          label: t('unitNumber', { ns: 'onboarding' }),
          name: 'entity.address.unitNumber' as const,
          type: 'text',
          placeholder: t('unitNumberPlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: {},
        },
        street_number: {
          label: t('streetNumber', { ns: 'onboarding' }),
          name: 'entity.address.streetNumber' as const,
          type: 'text',
          placeholder: t('streetNumberPlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: {},
        },
        street_name: {
          label: t('streetName', { ns: 'onboarding' }),
          name: 'entity.address.streetName' as const,
          type: 'text',
          placeholder: t('streetNamePlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: isManual
            ? {
                required: t('streetNameRequired', { ns: 'onboarding' }),
              }
            : {},
        },
        suburb: {
          label: t('suburb', { ns: 'onboarding' }),
          name: 'entity.address.city' as const,
          type: 'text',
          placeholder: t('suburbPlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: isManual
            ? {
                required: t('suburbRequired', { ns: 'onboarding' }),
              }
            : {},
        },
        state: {
          label: t('state', { ns: 'onboarding' }),
          name: 'entity.address.state' as const,
          type: 'text',
          placeholder: t('statePlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: isManual
            ? {
                required: t('stateRequired', { ns: 'onboarding' }),
              }
            : {},
        },
        country: {
          label: t('country', { ns: 'onboarding' }),
          name: 'entity.address.country' as const,
          type: 'text',
          placeholder: t('countryPlaceholder', { ns: 'onboarding' }),
          defaultValue: 'AUS',
          rules: isManual
            ? {
                required: t('countryRequired', { ns: 'onboarding' }),
              }
            : {},
        },
        postcode: {
          label: t('postcode', { ns: 'onboarding' }),
          name: 'entity.address.postalCode' as const,
          type: 'text',
          placeholder: t('postcodePlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: isManual
            ? {
                required: t('postcodeRequired', { ns: 'onboarding' }),
              }
            : {},
        },
      },
    }),
    [t, isManual]
  );

  const onSubmit = async (data: { entity: CreateEntityInput }) => {
    setLoading(true);
    try {
      const address = data.entity.address;

      if (!isNotOnboarding && onboardingEntityId) {
        const updateData = await updateEntity({
          variables: {
            input: {
              address: address,
              id: onboardingEntityId,
            },
          },
        });
        // setOnboardingEntity(updateData?.data.updateEntity);
      }

      setLoading(false);

      nextBusiness();
    } catch (err) {
      console.log('error updating entity: ', err);
      setLoading(false);
    }
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
        <>
          {''}
          <Controller
            control={control}
            name={inputs.address.name}
            rules={inputs.address.rules}
            defaultValue={inputs.address.defaultValue}
            render={({ field }) => (
              <WBBox>
                <WBLocationCompletion
                  {...field}
                  label={inputs.address.label}
                  type={inputs.address.type}
                  placeholder={inputs.address.placeholder}
                  error={
                    !!(
                      errors.entity?.address?.address1 &&
                      errors.entity?.address?.address1.message
                    )
                  }
                  helperText={
                    ((errors.entity?.address?.address1 &&
                      errors.entity?.address?.address1.message) as string) || ''
                  }
                  onChange={(address: AddressResponse) => {
                    field.onChange(address.label);
                    setValue('entity.address.addressId', address.id);
                    setValue('entity.address.unitNumber', address.unitNumber);
                    setValue('entity.address.postalCode', address.postalCode);
                    setValue('entity.address.city', address.municipality);
                    setValue('entity.address.state', address.region);
                    setValue('entity.address.streetName', address.street);
                    setValue(
                      'entity.address.streetType',
                      mapStreetType(address.street)
                    );
                    setValue(
                      'entity.address.streetNumber',
                      address.addressNumber
                    );
                    setValue('entity.address.country', address.country);
                  }}
                  onLocationLookupStart={() => setDisabled(true)}
                  onLocationLookupEnd={() => setDisabled(false)}
                  margin="dense"
                />
              </WBBox>
            )}
          />
          {!isManual && (
            <WBLink
              variant="body2"
              mt={2}
              underline="always"
              onClick={() => setIsManual(true)}
            >
              {t('enterAddressManually', { ns: 'onboarding' })}
            </WBLink>
          )}
        </>
        {isManual && (
          <>
            <WBFlex flexDirection={['column', 'row']}>
              <WBBox flex={1} pr={[0, 3]}>
                <Controller
                  control={control}
                  name={inputs.manual.unit_number.name}
                  rules={inputs.manual.unit_number.rules}
                  defaultValue={inputs.manual.unit_number.defaultValue}
                  render={({ field }) => (
                    <WBTextField
                      {...field}
                      type="text"
                      label={inputs.manual.unit_number.label}
                      placeholder={inputs.manual.unit_number.placeholder}
                      error={!!errors?.entity?.address?.unitNumber}
                      helperText={
                        errors?.entity?.address?.unitNumber?.message || ''
                      }
                      margin="dense"
                    />
                  )}
                />
              </WBBox>
              <WBBox flex={1} pr={[0, 3]}>
                <Controller
                  control={control}
                  name={inputs.manual.street_number.name}
                  rules={inputs.manual.street_number.rules}
                  defaultValue={inputs.manual.street_number.defaultValue}
                  render={({ field }) => (
                    <WBTextField
                      {...field}
                      label={inputs.manual.street_number.label}
                      type="text"
                      placeholder={inputs.manual.street_number.placeholder}
                      error={!!errors?.entity?.address?.streetNumber}
                      helperText={
                        errors?.entity?.address?.streetNumber?.message || ''
                      }
                      margin="dense"
                    />
                  )}
                />
              </WBBox>
              <WBBox flex={3}>
                <Controller
                  control={control}
                  name={inputs.manual.street_name.name}
                  rules={inputs.manual.street_name.rules}
                  defaultValue={inputs.manual.street_name.defaultValue}
                  render={({ field }) => (
                    <WBTextField
                      {...field}
                      label={inputs.manual.street_name.label}
                      type="text"
                      placeholder={inputs.manual.street_name.placeholder}
                      error={!!errors?.entity?.address?.streetName}
                      helperText={
                        errors?.entity?.address?.streetName?.message || ''
                      }
                      margin="dense"
                    />
                  )}
                />
              </WBBox>
            </WBFlex>

            <WBFlex mt={[0, 4]}>
              <Controller
                control={control}
                name={inputs.manual.suburb.name}
                rules={inputs.manual.suburb.rules}
                defaultValue={inputs.manual.suburb.defaultValue}
                render={({ field }) => (
                  <WBTextField
                    {...field}
                    label={inputs.manual.suburb.label}
                    type="text"
                    placeholder={inputs.manual.suburb.placeholder}
                    error={!!errors?.entity?.address?.city}
                    helperText={errors?.entity?.address?.city?.message || ''}
                    margin="dense"
                  />
                )}
              />
            </WBFlex>
            <WBFlex flexDirection={['column', 'row']}>
              <Controller
                control={control}
                name={inputs.manual.state.name}
                rules={inputs.manual.state.rules}
                defaultValue={inputs.manual.state.defaultValue}
                render={({ field }) => (
                  <WBBox flex={1} pr={[0, 3]}>
                    {/* <WBTextField
                      {...field}
                      label={inputs.manual.state.label}
                      type="text"
                      placeholder={inputs.manual.state.placeholder}
                      error={!!errors?.address?.state}
                      helperText={errors?.address?.state?.message || ''}
                      margin="dense"
                    /> */}
                    <WBSelect
                      {...field}
                      label={inputs.manual.state.label}
                      error={!!errors?.entity?.address?.state}
                      helperText={errors?.entity?.address?.state?.message || ''}
                      margin="dense"
                      options={STATES_AUSTRALIA.map(
                        (state: { code: string; name: string }) => ({
                          label: state.name,
                          value: state.name,
                        })
                      )}
                    />
                  </WBBox>
                )}
              />

              <Controller
                control={control}
                name={inputs.manual.country.name}
                rules={inputs.manual.country.rules}
                defaultValue={inputs.manual.country.defaultValue}
                render={({ field }) => (
                  <WBBox flex={1} pr={[0, 3]}>
                    <WBTextField
                      {...field}
                      aria-readonly
                      value={'AUS'}
                      label={inputs.manual.country.label}
                      type="text"
                      placeholder={inputs.manual.country.placeholder}
                      error={!!errors?.entity?.address?.country}
                      helperText={
                        errors?.entity?.address?.country?.message || ''
                      }
                      margin="dense"
                    />
                  </WBBox>
                )}
              />
              <Controller
                control={control}
                name={inputs.manual.postcode.name}
                rules={inputs.manual.postcode.rules}
                defaultValue={inputs.manual.postcode.defaultValue}
                render={({ field }) => (
                  <WBBox flex={1}>
                    <WBTextField
                      {...field}
                      label={inputs.manual.postcode.label}
                      type="text"
                      placeholder={inputs.manual.postcode.placeholder}
                      error={!!errors?.entity?.address?.postalCode}
                      helperText={
                        errors?.entity?.address?.postalCode?.message || ''
                      }
                      margin="dense"
                    />
                  </WBBox>
                )}
              />
            </WBFlex>
          </>
        )}
        <WBButton
          sx={{
            mt: {
              xs: 6,
              sm: 10,
            },
          }}
          disabled={disabled}
          loading={loading}
        >
          {t('nextTitle', { ns: 'common' })}
        </WBButton>
      </WBForm>
      {updateError?.message && (
        <WBAlert title={updateError.message} severity="error" sx={{ my: 2 }} />
      )}
    </WBFlex>
  );
};

export default OnboardingBusinessAddressForm;
