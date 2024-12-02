import { useClipboard } from '@admiin-com/ds-hooks';
import React, { useEffect, useMemo } from 'react';
import { gql, useMutation } from '@apollo/client';
import {
  useSnackbar,
  WBAlert,
  WBBox,
  WBCheckbox,
  WBFlex,
  WBIconButton,
  WBLink,
  WBSelect,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Address,
  EntityType,
  regenerateEntityOcrEmail as REGENERATE_ENTITY_OCR_EMAIL,
} from '@admiin-com/ds-graphql';
import { AlertColor, InputLabel } from '@mui/material';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { ABN_LENGTH, ACN_LENGTH } from '../../constants/config';
import { Image } from '@admiin-com/ds-common';
import { WBLocationCompletion } from '@admiin-com/ds-amplify-web';
import { AddressResponse } from 'libs/amplify-web/src/lib/components/LocationAutoCompletion/LocationAutoCompletion';
import { S3AvatarUpload } from 'libs/amplify-web/src/lib/components/S3AvatarUpload/S3AvatarUpload';
import { updateEntity as UPDATE_ENTITY } from '@admiin-com/ds-graphql';
import RefreshIcon from '../../../assets/icons/refresh-icon.svg';
import ConfirmationDlg from '../ConfirmationDlg/ConfirmationDlg';

interface BusinessFormData {
  businessName: string;
  companyType: string;
  abn: string;
  acn: string;
  gstRegistered: boolean;
  logo: Image;
  email?: string;
  address: Address;
}

const BusinessForm = () => {
  const [, copy] = useClipboard();
  const showSnackBar = useSnackbar();
  const { t } = useTranslation();

  const { entity } = useSelectedEntity();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BusinessFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const inputs = useMemo(
    () =>
      ({
        businessName: {
          label: t('businessName', { ns: 'onboarding' }),
          name: 'businessName',
          type: 'text',
          placeholder: t('businessName', { ns: 'onboarding' }),
          defaultValue: '',
          rules: {
            required: t('businessNameRequired', { ns: 'onboarding' }),
          },
        },
        companyType: {
          label: t('companyTypeTitle', { ns: 'onboarding' }),
          name: 'companyType',
          type: 'select',
          placeholder: '',
          defaultValue: '',
          rules: {
            required: t('companyTypeRequired', { ns: 'onboarding' }),
          },
        },
        abn: {
          label: t('abn', { ns: 'onboarding' }),
          name: 'abn' as const,
          type: 'text',
          placeholder: t('abnPlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: {
            required: t('abnRequired', { ns: 'onboarding' }),
            minLength: {
              value: ABN_LENGTH,
              message: `ABN must be ${ABN_LENGTH} digits long`, // Custom message for minLength
            },
            maxLength: {
              value: ABN_LENGTH,
              message: `ABN must be ${ABN_LENGTH} digits long`, // Custom message for maxLength
            },
            pattern: {
              value: /^\d{11}$/, // Regex for exactly 11 digits
              message: 'Invalid ABN format', // Custom message for pattern
            },
          },
        },

        acn: {
          label: t('acn', { ns: 'onboarding' }),
          name: 'acn' as const,
          type: 'text',
          placeholder: t('acnPlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: {
            required: t('acnRequired', { ns: 'onboarding' }),
            minLength: {
              value: ACN_LENGTH,
              message: `acn must be ${ACN_LENGTH} digits long`, // Custom message for minLength
            },
            maxLength: {
              value: ACN_LENGTH,
              message: `acn must be ${ACN_LENGTH} digits long`, // Custom message for maxLength
            },
            pattern: {
              value: /^\d{9}$/, // Regex for exactly 11 digits
              message: 'Invalid acn format', // Custom message for pattern
            },
          },
        },
        address: {
          label: t('address', { ns: 'onboarding' }),
          name: 'address.address1' as const,
          type: 'text',
          placeholder: t('businessAddressPlaceholder', { ns: 'onboarding' }),
          defaultValue: '',
          rules: {
            required: t('businessAddressRequired', { ns: 'onboarding' }),
          },
        },
        gstRegistered: {
          label: t('gstRegistered', { ns: 'settings' }),
          name: 'gstRegistered' as const,
          type: 'checkbox',
          placeholder: t('gstRegisteredPlaceholder', { ns: 'settings' }),
          defaultValue: false,
          rules: {
            required: t('gstRegisteredRequired', { ns: 'settings' }),
          },
        },
        email: {
          label: t('forwardEmail', { ns: 'settings' }),
          name: 'email' as const,
          type: 'text',
          defaultValue: '',
          rules: {},
        },
        logo: {
          label: t('businessLogoTitle', { ns: 'settings' }),
          name: 'logo' as const,
        },
      } as const),
    [t]
  );

  useEffect(() => {
    if (entity?.name) {
      setValue('businessName', entity.name, { shouldValidate: true });
    }
    if (entity?.type) {
      setValue('companyType', entity.type, { shouldValidate: true });
    }
    if (entity?.taxNumber) {
      setValue('abn', entity.taxNumber, { shouldValidate: true });
    }
    if (entity?.logo) {
      setValue('logo', entity.logo, { shouldValidate: true });
    }
    if (entity?.ocrEmail) {
      setValue('email', entity.ocrEmail, { shouldValidate: true });
    }
    if (entity?.address) {
      setValue('address', entity.address, { shouldValidate: true });
    }
    if (entity?.gstRegistered) {
      console.log('gstRegistered: ', entity.gstRegistered);
      setValue('gstRegistered', entity.gstRegistered, { shouldValidate: true });
    }
  }, [entity, setValue]);

  const [updateEntity, { error: updateError }] = useMutation(
    gql(UPDATE_ENTITY)
  );

  const [loading, setLoading] = React.useState(false);
  const updateGST = async (gstRegistered: boolean) => {
    setValue('gstRegistered', gstRegistered, { shouldValidate: true });
    if (entity) {
      try {
        await updateEntity({
          variables: {
            input: {
              id: entity.id,
              gstRegistered: gstRegistered,
            },
          },
        });
        showSnackBar({
          message: t('gstUpdated', { ns: 'settings' }),
          severity: 'success' as AlertColor,
          horizontal: 'right',
          vertical: 'bottom',
        });
      } catch (err) {
        console.log('ERROR updating entity: ', err);
        showSnackBar({
          message: t('errorOcurred', { ns: 'settings' }),
          severity: 'error' as AlertColor,
          horizontal: 'right',
          vertical: 'bottom',
        });
      }
    }
  };
  const onSubmit = async (data: BusinessFormData) => {
    try {
      // await updateUser({
      //   variables: {
      //     input: {
      //       ...data,
      //       id: userId,
      //     },
      //   },
      // });
    } catch (err) {
      console.log('ERROR updating user: ', err);
    }
  };
  const onImageUpload = async (image: Image) => {
    // setImage(image);
    console.log(image);
    // otherwise update entity
    if (!entity) return;
    setLoading(true);
    try {
      await updateEntity({
        variables: {
          input: {
            id: entity.id,
            logo: {
              alt: image?.alt,
              identityId: image?.identityId,
              key: image?.key,
              level: image?.level,
            },
          },
        },
      });
      setLoading(false);
    } catch (err) {
      console.log('ERROR updating entity: ', err);
      setLoading(false);
    }
  };

  //TODO: reusable copy function?
  const copyCode = async () => {
    try {
      if (entity?.ocrEmail) await copy(entity.ocrEmail);
      showSnackBar({
        message: t('emailCopied', { ns: 'settings' }),
        severity: 'success' as AlertColor,
        horizontal: 'right',
        vertical: 'bottom',
      });
    } catch (error) {
      console.log(error);
      showSnackBar({
        message: t('errorOcurred', { ns: 'settings' }),
        severity: 'error' as AlertColor,
        horizontal: 'right',
        vertical: 'bottom',
      });
    }
  };

  const [regenerateEntityOcrEmail, { loading: refreshingEmail }] = useMutation(
    gql(REGENERATE_ENTITY_OCR_EMAIL),
    {
      onError: (error) => {
        console.log(error);
        showSnackBar({
          message: t('errorOcurred', { ns: 'settings' }),
          severity: 'error' as AlertColor,
          horizontal: 'right',
          vertical: 'bottom',
        });
      },
    }
  );

  //TODO: call function on confirm dialog
  const refreshEmail = async () => {
    await regenerateEntityOcrEmail({
      variables: {
        input: {
          entityId: entity?.id,
        },
      },
    });

    // show confirmation
    showSnackBar({
      message: t('emailRefreshed', { ns: 'settings' }),
      severity: 'success' as AlertColor,
      horizontal: 'right',
      vertical: 'bottom',
    });
  };

  const [showConfirmation, setShowConfirmation] = React.useState(false);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <WBFlex mt={5}>
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <WBBox>
                <InputLabel>{t('businessLogo', { ns: 'settings' })}</InputLabel>
                <WBFlex alignItems={'center'} mt={2}>
                  <S3AvatarUpload
                    sx={{
                      borderRadius: '3px',
                      width: '52px',
                      height: '52px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    imgKey={field.value?.key}
                    level={field.value?.level}
                    onImageUpload={onImageUpload}
                    maxSizeMB={0.2}
                    maxWidthOrHeight={420}
                    companyName={entity?.searchName ?? ''}
                    label={t('editLogo', { ns: 'settings' })}
                  />
                </WBFlex>
              </WBBox>
            )}
          />
        </WBFlex>
        <WBFlex flexDirection={['column', 'row']}>
          <WBBox flex={1} pr={[0, 3]}>
            <Controller
              control={control}
              name={inputs.businessName.name}
              rules={inputs.businessName.rules}
              defaultValue={inputs.businessName.defaultValue}
              render={({ field: { ref, ...field } }) => (
                <WBTextField
                  {...field}
                  disabled
                  type="text"
                  label={inputs.businessName.label}
                  //placeholder={inputs.businessName.placeholder}
                  error={!!(errors.businessName && errors.businessName.message)}
                  helperText={
                    ((errors.businessName &&
                      errors.businessName.message) as string) || ''
                  }
                  margin="dense"
                />
              )}
            />
          </WBBox>
          <WBBox flex={1} pl={[0, 3]}>
            <Controller
              control={control}
              name={inputs.companyType.name}
              rules={inputs.companyType.rules}
              defaultValue={inputs.companyType.defaultValue as ''}
              render={({ field }) => (
                <WBBox>
                  <WBSelect
                    disabled
                    options={[
                      ...Object.keys(EntityType).map((value) => ({
                        label: t(value, { ns: 'common' }),
                        value: value,
                      })),
                    ]}
                    label={inputs.companyType.label}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={inputs.companyType.label}
                    error={!!(errors.companyType && errors.companyType.message)} // Add error handling
                    helperText={
                      (errors.companyType && errors.companyType.message) || ''
                    } // Add helper text for errors
                  />
                </WBBox>
              )}
            />
          </WBBox>
        </WBFlex>
        <WBFlex flexDirection={['column', 'row']}>
          <WBBox flex={1} pr={[0, 3]}>
            <Controller
              control={control}
              name={inputs.abn.name}
              rules={inputs.abn.rules}
              defaultValue={inputs.abn.defaultValue}
              render={({ field: { ref, ...field } }) => (
                <WBTextField
                  {...field}
                  disabled
                  type={inputs.abn.type}
                  label={inputs.abn.label}
                  error={!!(errors.abn && errors.abn.message)}
                  helperText={
                    ((errors.abn && errors.abn.message) as string) || ''
                  }
                  margin="dense"
                />
              )}
            />
          </WBBox>
          <WBBox flex={1} pl={[0, 3]}>
            <Controller
              control={control}
              name={inputs.acn.name}
              rules={inputs.acn.rules}
              defaultValue={inputs.acn.defaultValue}
              render={({ field: { ref, ...field } }) => (
                <WBTextField
                  {...field}
                  disabled
                  type={inputs.acn.type}
                  label={inputs.acn.label}
                  error={!!(errors.acn && errors.acn.message)}
                  helperText={
                    ((errors.acn && errors.acn.message) as string) || ''
                  }
                  margin="dense"
                />
              )}
            />
          </WBBox>
        </WBFlex>
        <WBFlex>
          <Controller
            control={control}
            name={inputs.address.name}
            rules={inputs.address.rules}
            render={({ field }) => (
              <WBLocationCompletion
                {...field}
                disabled
                label={inputs.address.label}
                type={inputs.address.type}
                placeholder={inputs.address.placeholder}
                error={!!(errors.address && errors.address.message)}
                helperText={
                  ((errors.address && errors.address.message) as string) || ''
                }
                onChange={(address: AddressResponse) => {
                  field.onChange(address.label);
                  setValue('address.unitNumber', address.unitNumber);
                  setValue('address.postalCode', address.postalCode);
                  setValue('address.city', address.municipality);
                  setValue('address.state', address.region);
                  setValue('address.streetName', address.street);
                  setValue('address.streetNumber', address.addressNumber);
                  setValue('address.country', address.country);
                }}
                margin="dense"
              />
            )}
          />
        </WBFlex>
        <WBFlex>
          <Controller
            control={control}
            name={inputs.email.name}
            rules={inputs.email.rules}
            defaultValue={inputs.email.defaultValue}
            render={({ field: { ref, ...field } }) => (
              <WBBox mt={3} sx={{ width: '100%' }}>
                <InputLabel>{inputs.email.label}</InputLabel>
                <WBFlex
                  sx={{
                    mt: 1,
                    borderBottom: '2px solid #000',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <WBTypography
                    sx={{
                      lineHeight: '48px',
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    {field.value}
                    <WBIconButton
                      size="small"
                      onClick={() => setShowConfirmation(true)}
                    >
                      <RefreshIcon />
                    </WBIconButton>
                    <ConfirmationDlg
                      open={showConfirmation}
                      onClose={() => setShowConfirmation(false)}
                      onOK={() => refreshEmail()}
                      loading={refreshingEmail}
                      title={t('ocrEmailRefresh', { ns: 'settings' })}
                    >
                      {
                        <WBTypography>
                          {t('confirmRefreshEmail', { ns: 'settings' })}
                        </WBTypography>
                      }
                    </ConfirmationDlg>
                  </WBTypography>
                  <WBLink
                    component={'button'}
                    noWrap
                    type="button"
                    variant="body2"
                    underline="always"
                    onClick={copyCode}
                  >
                    {t('copyEmail', { ns: 'settings' })}
                  </WBLink>
                </WBFlex>
              </WBBox>
            )}
          />
        </WBFlex>
        <WBFlex>
          <Controller
            control={control}
            name={inputs.gstRegistered.name}
            rules={inputs.gstRegistered.rules}
            defaultValue={inputs.gstRegistered.defaultValue}
            render={({ field: { ref, ...field } }) => (
              <WBCheckbox
                {...field}
                checked={field.value}
                onChange={async (e) => {
                  field.onChange(e);
                  updateGST(e.target.checked);
                }}
                disabled={!entity?.taxNumber}
                label={inputs.gstRegistered.label}
              />
            )}
          />
        </WBFlex>
      </form>
      {updateError?.message && (
        <WBAlert title={updateError.message} severity="error" sx={{ my: 2 }} />
      )}
    </>
  );
};

export default BusinessForm;
