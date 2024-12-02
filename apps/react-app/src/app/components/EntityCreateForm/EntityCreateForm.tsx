import { CreateEntityInput, EntityType } from '@admiin-com/ds-graphql';
import {
  useSnackbar,
  WBBox,
  WBCollapse,
  WBSelect,
  WBStack,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import React, { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import AbnAutoCompleteLookup, {
  ABNResult,
} from '../AutoCompleteLookup/AbnAutoCompleteLookup';
import EntityAddressForm from '../EntityAddressForm/EntityAddressForm';
import {
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  styled,
} from '@mui/material';
import { useFormValues } from '../../hooks/useFormValues/useFormValues';

export interface EntityCreateFormProps {
  isOnboarding?: boolean;
  entityTypes?: EntityType[];
  disabled?: boolean;
  noAddress?: boolean;
  onAbnLookupStart?: () => void;
  onAbnLookupEnd?: () => void;
  type?: 'ENTITY' | 'CONTACT' | 'CLIENT';
  noType?: boolean;
}

const AbnSelector = styled(ToggleButton)(({ theme, selected }) => {
  const mode = theme.palette.mode;
  return {
    '&.Mui-selected': {
      backgroundColor: selected
        ? mode === 'dark'
          ? theme.palette.common.white
          : theme.palette.common.black
        : 'transparent',
      color: selected
        ? mode === 'dark'
          ? theme.palette.common.black
          : theme.palette.common.white
        : 'inherit',
    },

    '&:disabled': {
      border: 0,
    },
    fontWeight: 'bold',

    border: 0,
    marginRight: theme.spacing(1),
    '&:last-child': {
      marginRight: 0,
    },
  };
});

export function EntityCreateForm({
  isOnboarding = false,
  onAbnLookupStart,
  onAbnLookupEnd,
  disabled = false,
  noAddress = false,
  type = 'CONTACT',
  noType,
}: EntityCreateFormProps) {
  const {
    control,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useFormContext<{
    entity: CreateEntityInput;
  }>();
  const { t } = useTranslation();
  const entity = useFormValues().entity;
  // const [abnStatus, setABNStatus] = React.useState<'HasAbn' | 'NoAbn'>(
  //   'HasAbn'
  // );
  // const hasABN = abnStatus === 'HasAbn';

  const hasABN = true;
  const [entitySearched, setEntitySearched] = React.useState<
    ABNResult | undefined
  >();
  const isIndividual =
    //  entity?.type === EntityType.INDIVIDUAL &&
    !hasABN;

  const resetForm = () => {
    clearErrors();
    setValue('entity', { taxNumber: '', type: '' as any, name: '' });
    setEntitySearched(undefined);
  };
  React.useEffect(() => {
    if (!disabled && !hasABN) {
      resetForm();
    }
  }, [hasABN, disabled]);

  // React.useEffect(() => {
  //   if (
  //     !disabled &&
  //     type === 'ENTITY' &&
  //     !!entity?.address &&
  //     !entity?.taxNumber
  //   ) {
  //     setABNStatus('NoAbn');
  //   }
  // }, [disabled, entity?.address, entity?.taxNumber, type]);

  // React.useEffect(() => {
  //   if (disabled) {
  //     if (entity?.taxNumber) {
  //       setABNStatus('HasAbn');
  //     } else setABNStatus('NoAbn');
  //   }
  // }, [disabled, entity?.taxNumber]);

  React.useEffect(() => {
    if (!hasABN && onAbnLookupEnd) onAbnLookupEnd();
  }, [hasABN]);

  const inputs = useMemo(
    () => ({
      entity: {
        type: {
          label: t('type', { ns: 'common' }),
          name: 'entity.type' as const,
          type: 'select',
          placeholder: t('typePlaceholder', { ns: 'onboarding' }),
          rules: { required: t('typeRequired', { ns: 'onboarding' }) },
        },
        taxNumber: {
          label: t(type === 'ENTITY' ? 'searchEntity' : 'searchEntity', {
            //label: t(type === 'ENTITY' ? 'yourEntity' : 'searchEntity', {
            ns: 'onboarding',
          }),
          name: 'entity.taxNumber' as const,
          type: 'text',
          placeholder: t('abnPlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules:
            hasABN && type !== 'CONTACT'
              ? {
                  required: t('abnRequired', { ns: 'onboarding' }),
                }
              : {},
        },
        name: {
          label: t('businessName', { ns: 'onboarding' }),
          name: 'entity.name' as const,
          type: 'text',
          placeholder: t('businessNamePlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules:
            type !== 'CONTACT'
              ? {
                  required: t('businessNameRequired', { ns: 'onboarding' }),
                }
              : {},
        },
        firstName: {
          label: t('firstNameTitle', { ns: 'common' }),
          name: 'entity.firstName' as const,
          type: 'text',
          placeholder: t('firstNamePlaceholder', { ns: 'common' }),
          defaultValue: '',
          rules: { required: t('firstNameRequired', { ns: 'common' }) },
        },
        lastName: {
          label: t('lastNameTitle', { ns: 'common' }),
          name: 'entity.lastName' as const,
          type: 'text',
          placeholder: t('lastNamePlaceholder', { ns: 'common' }),
          defaultValue: '',
          rules: { required: t('lastNameRequired', { ns: 'common' }) },
        },
      },
    }),
    [t, hasABN, type]
  );

  return (
    <>
      {/* {!disabled && (
        <WBStack sx={{ mt: 2 }} direction="row" spacing={2}>
          <ToggleButtonGroup
            value={abnStatus}
            onChange={(event: React.MouseEvent<HTMLElement>, newValue: any) => {
              if (newValue) setABNStatus(newValue);
            }}
            exclusive
            disabled={disabled}
          >
            <AbnSelector value="HasAbn">
              {t('hasABN', { ns: 'onboarding' })}
            </AbnSelector>
            <AbnSelector value="NoAbn">
              {t('noABN', { ns: 'onboarding' })}
            </AbnSelector>
          </ToggleButtonGroup>
        </WBStack>
      )} */}
      {!noType && !hasABN && !disabled && (
        <Controller
          control={control}
          name={inputs.entity.type.name}
          rules={inputs.entity.type.rules}
          defaultValue={'' as any}
          disabled={disabled}
          render={({ field, formState: { errors } }) => (
            <WBSelect
              {...field}
              options={[
                ...Object.keys(EntityType)
                  .filter(
                    (type) =>
                      (!isOnboarding && type !== EntityType.BPAY) ||
                      (isOnboarding &&
                        // type !== EntityType.INDIVIDUAL &&
                        type !== EntityType.BPAY)
                  )
                  .map((value) => ({
                    label: t(value, { ns: 'common' }),
                    value: value,
                  })),
              ]}
              label={inputs.entity.type.label}
              placeholder={inputs.entity.type.placeholder}
              error={!!errors?.entity?.type}
              helperText={
                ((errors?.entity?.type &&
                  (errors?.entity?.type as any).message) as string) || ''
              }
            />
          )}
        />
      )}
      {isIndividual ? (
        <>
          {''}
          <Controller
            control={control}
            name={inputs.entity.firstName.name}
            rules={inputs.entity.firstName.rules}
            defaultValue={inputs.entity.firstName.defaultValue}
            render={({ field }) => (
              <WBBox sx={{ mt: 2 }}>
                <WBTextField
                  {...field}
                  disabled={disabled}
                  label={inputs.entity.firstName.label}
                  type={inputs.entity.firstName.type}
                  placeholder={inputs.entity.firstName.placeholder}
                  error={
                    !!(
                      errors?.entity?.firstName &&
                      errors?.entity?.firstName.message
                    )
                  }
                  helperText={
                    ((errors?.entity?.firstName &&
                      errors?.entity?.firstName.message) as string) || ''
                  }
                  margin="dense"
                />
              </WBBox>
            )}
          />
          {''}
          <Controller
            control={control}
            name={inputs.entity.lastName.name}
            rules={inputs.entity.lastName.rules}
            defaultValue={inputs.entity.lastName.defaultValue}
            render={({ field }) => (
              <WBBox sx={{ mt: 2 }}>
                <WBTextField
                  {...field}
                  disabled={disabled}
                  label={inputs.entity.lastName.label}
                  type={inputs.entity.lastName.type}
                  placeholder={inputs.entity.lastName.placeholder}
                  error={
                    !!(
                      errors?.entity?.lastName &&
                      errors?.entity?.lastName.message
                    )
                  }
                  helperText={
                    ((errors?.entity?.lastName &&
                      errors?.entity?.lastName.message) as string) || ''
                  }
                  margin="dense"
                />
              </WBBox>
            )}
          />
        </>
      ) : (
        <>
          {hasABN && (
            <Controller
              control={control}
              name={inputs.entity.taxNumber.name}
              rules={inputs.entity.taxNumber.rules}
              defaultValue={inputs.entity.taxNumber.defaultValue}
              render={({ field, fieldState }) => (
                <WBBox sx={{ mt: 2 }}>
                  {!disabled && (
                    <AbnAutoCompleteLookup
                      {...field}
                      label={inputs.entity.taxNumber.label}
                      placeholder={inputs.entity.taxNumber.placeholder}
                      disabled={disabled}
                      noPopupIcon
                      onChange={(value) => {
                        console.log(field.ref);
                      }}
                      onLoading={(loading: boolean) => {
                        if (loading) {
                          if (onAbnLookupStart) onAbnLookupStart();
                        } else if (onAbnLookupEnd) onAbnLookupEnd();
                      }}
                      onSearch={(value) => {
                        setEntitySearched(value);
                        setValue('entity.name', value.name);
                        setValue('entity.taxNumber', value.abn);
                        setValue('entity.type', value.type as EntityType);
                        if (onAbnLookupEnd) onAbnLookupEnd();
                        if (value?.abn === '') {
                          clearErrors();
                        }
                      }}
                      onError={(error) => {
                        console.error('error: ', error);
                        resetForm();
                        if (error.message === 'AbnInvalid') {
                          setError('entity.taxNumber', {
                            type: 'validate',
                            message: t('AbnInvalid', { ns: 'onboarding' }),
                          });
                        }
                        if (error.message === 'Network Error') {
                          if (onAbnLookupEnd) onAbnLookupEnd();
                        }
                      }}
                      renderProps={{
                        error: fieldState.invalid,
                        helperText: fieldState.error?.message,
                      }}
                    />
                  )}
                  <WBCollapse in={!!entitySearched || !!entity?.name}>
                    {(entitySearched?.name || entity?.name) && (
                      <WBBox mt={1}>
                        <InputLabel>
                          {t('businessName', { ns: 'onboarding' })}
                        </InputLabel>
                        <WBTypography sx={{ mt: 1 }}>
                          {entitySearched?.name || entity?.name}
                        </WBTypography>
                      </WBBox>
                    )}
                    <WBBox
                      mt={1}
                      display="flex"
                      flexDirection={['row', 'column']}
                    >
                      {(entitySearched?.abn || entity?.taxNumber) && (
                        <WBBox flex={1} mt={1} mr={[2, 0]}>
                          <InputLabel>
                            {t('abn', { ns: 'onboarding' })}
                          </InputLabel>
                          <WBTypography sx={{ mt: 1 }}>
                            {entitySearched?.abn || entity?.taxNumber}
                          </WBTypography>
                        </WBBox>
                      )}
                      {(entitySearched?.acn || entity?.acn) && (
                        <WBBox flex={1} mt={1}>
                          <InputLabel>
                            {t('acn', { ns: 'onboarding' })}
                          </InputLabel>
                          <WBTypography sx={{ mt: 1 }}>
                            {entitySearched?.acn || entity?.acn}
                          </WBTypography>
                        </WBBox>
                      )}
                    </WBBox>
                    {(entitySearched?.type || entity?.type) && (
                      <WBBox mt={1}>
                        <InputLabel>
                          {t('entityType', { ns: 'onboarding' })}
                        </InputLabel>
                        <WBTypography sx={{ mt: 1 }}>
                          {entitySearched?.type || entity?.type}
                        </WBTypography>
                      </WBBox>
                    )}
                  </WBCollapse>
                  {/*)}*/}
                </WBBox>
              )}
            />
          )}
          {!hasABN && (
            <Controller
              control={control}
              name={inputs.entity.name.name}
              rules={inputs.entity.name.rules}
              defaultValue={inputs.entity.name.defaultValue}
              render={({ field }) => (
                <WBBox sx={{ mt: 2 }}>
                  <WBTextField
                    {...field}
                    label={inputs.entity.name.label}
                    disabled={disabled}
                    type={inputs.entity.name.type}
                    placeholder={inputs.entity.name.placeholder}
                    error={
                      !!(errors?.entity?.name && errors?.entity?.name.message)
                    }
                    helperText={
                      ((errors?.entity?.name &&
                        errors?.entity?.name.message) as string) || ''
                    }
                    margin="dense"
                  />
                </WBBox>
              )}
            />
          )}
        </>
      )}
      {noAddress || disabled ? null : (
        <WBBox mt={2}>
          <EntityAddressForm />
        </WBBox>
      )}
    </>
  );
}

export default EntityCreateForm;
