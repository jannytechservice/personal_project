import {
  WBBox,
  WBCollapse,
  WBFlex,
  WBTextField,
  WBTypography,
  useMediaQuery,
  useTheme,
  WBLink,
} from '@admiin-com/ds-web';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { ContactCreateFormData } from '../../pages/ContactDetail/ContactsCreateForm';

export interface ContactBankFormProps {
  selected?: any;
}

export function ContactBankForm({ selected }: ContactBankFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const islg = useMediaQuery(theme.breakpoints.down('lg'));
  const {
    control,
    formState: { errors },
  } = useFormContext<ContactCreateFormData>();

  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showBpayDetails, setShowBpayDetails] = useState(false);

  const bank = useWatch({
    control,
    name: 'bank',
  });
  const isbankEmpty =
    !bank ||
    (bank &&
      Object.entries(bank).every(([key, value]) => {
        return (
          key === 'accountType' ||
          key === 'holderType' ||
          key === 'bankName' ||
          (key !== 'accountType' &&
            key !== 'holderType' &&
            key !== 'bankName' &&
            (value === '' || value === null))
        );
      }));
  // Object.values(bank).every((value) => value === ''));

  console.log(isbankEmpty);
  const bpayReferenceNumber = useWatch({
    control,
    name: 'bpay.referenceNumber',
  });

  const inputs = React.useMemo(
    () => ({
      bank: {
        //bankName: {
        //  label: t('bankName', { ns: 'contacts' }),
        //  name: 'bankName' as const,
        //  type: 'text',
        //  placeholder: t('bankNamePlaceholder', { ns: 'contacts' }),
        //  defaultValue: '',
        //  rules: !isbankEmpty
        //    ? {
        //        required: t('bankNameRequired', { ns: 'contacts' }),
        //        minLength: {
        //          value: 3,
        //          message: t('bankNameMinLength', { ns: 'contacts' }),
        //        },
        //        maxLength: {
        //          value: 50,
        //          message: t('bankNameMaxLength', { ns: 'contacts' }),
        //        },
        //      }
        //    : {},
        //},
        accountName: {
          label: t('accountName', { ns: 'contacts' }),
          name: 'accountName' as const,
          type: 'text',
          placeholder: t('accountNamePlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: !isbankEmpty
            ? {
                required: t('accountNameRequired', { ns: 'contacts' }),
                minLength: {
                  value: 3,
                  message: t('accountNameMinLength', { ns: 'contacts' }),
                },
                maxLength: {
                  value: 50,
                  message: t('accountNameMaxLength', { ns: 'contacts' }),
                },
              }
            : {},
        },
        routingNumber: {
          label: t('bsb', { ns: 'contacts' }),
          name: 'bsb' as const,
          type: 'text',
          placeholder: t('bsbPlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: !isbankEmpty
            ? {
                required: t('bsbRequired', { ns: 'contacts' }),
                pattern: {
                  value: /^\d{6}$/,
                  message: t('bsbPattern', { ns: 'contacts' }),
                },
              }
            : {},
        },
        accountNumber: {
          label: t('accountNumber', { ns: 'contacts' }),
          name: 'accountNumber' as const,
          type: 'text',
          placeholder: t('accountNumberPlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: !isbankEmpty
            ? {
                required: t('accountNumberRequired', { ns: 'contacts' }),
                minLength: {
                  value: 6,
                  message: t('accountNumberMinLength', {
                    ns: 'contacts',
                    count: 6,
                  }),
                },
                maxLength: {
                  value: 12,
                  message: t('accountNumberMaxLength', {
                    ns: 'contacts',
                    count: 12,
                  }),
                },
              }
            : {},
        },
      },
      bpay: {
        billerCode: {
          label: t('billerCode', { ns: 'contacts' }),
          name: 'bpay.billerCode' as const,
          type: 'number',
          placeholder: t('billerCodePlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: bpayReferenceNumber
            ? { required: t('billerCodeRequired', { ns: 'contacts' }) }
            : {},
        },

        referenceNumber: {
          label: t('referenceNumber', { ns: 'contacts' }),
          name: 'bpay.referenceNumber' as const,
          type: 'text',
          placeholder: t('referenceNumberPlaceholder', { ns: 'contacts' }),
          defaultValue: '',
          rules: {},
        },
      },
    }),
    [t, isbankEmpty, bpayReferenceNumber]
  );
  // console.log(bpayReferenceNumber, !!bpayReferenceNumber, inputs.bpay.billerCode.rules
  // );

  return (
    <WBBox mt={5}>
      <WBTypography
        variant={islg ? 'h3' : 'h2'}
        noWrap
        component="div"
        color="dark"
        sx={{ flexGrow: 1, textAlign: 'left' }}
      >
        {t('bankDetails', { ns: 'contacts' })}
      </WBTypography>
      <WBTypography>
        {t('bpayDetailsDescription', { ns: 'contacts' })}
      </WBTypography>
      <WBCollapse in={showBankDetails}>
        <WBBox flex={1}>
          <Controller
            control={control}
            name={`bank.accountName`}
            rules={inputs.bank.accountName.rules}
            defaultValue={inputs.bank.accountName.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type="text"
                variant="standard"
                label={inputs.bank.accountName.label}
                placeholder={inputs.bank.accountName.placeholder}
                error={!!errors?.bank?.accountName}
                helperText={errors?.bank?.accountName?.message || ''}
                margin="dense"
              />
            )}
          />
        </WBBox>
        <WBFlex flexDirection={['column', 'row']} mt={[0, 4]}>
          <WBBox flex={1} pr={[0, 3]}>
            <Controller
              control={control}
              name={`bank.routingNumber`}
              rules={inputs.bank.routingNumber.rules}
              defaultValue={inputs.bank.routingNumber.defaultValue}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type="text"
                  variant="standard"
                  label={inputs.bank.routingNumber.label}
                  placeholder={inputs.bank.routingNumber.placeholder}
                  error={!!errors?.bank?.routingNumber}
                  helperText={errors?.bank?.routingNumber?.message || ''}
                  margin="dense"
                />
              )}
            />
          </WBBox>
          <WBBox flex={1} pl={[0, 3]}>
            <Controller
              control={control}
              name="bank.accountNumber"
              defaultValue={inputs.bank.accountNumber.defaultValue}
              rules={inputs.bank.accountNumber.rules}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type="text"
                  variant="standard"
                  label={inputs.bank.accountNumber.label}
                  placeholder={inputs.bank.accountNumber.placeholder}
                  error={!!errors?.bank?.accountNumber}
                  helperText={errors?.bank?.accountNumber?.message || ''}
                  margin="dense"
                />
              )}
            />
          </WBBox>
        </WBFlex>
      </WBCollapse>

      <WBLink
        variant="body2"
        color="primary.main"
        mr={2}
        underline="always"
        onClick={() => setShowBankDetails(!showBankDetails)}
      >
        {t(showBankDetails ? 'hideBankDetails' : 'showBankDetails', {
          ns: 'contacts',
        })}
      </WBLink>

      <WBTypography
        mt={5}
        variant={islg ? 'h3' : 'h2'}
        noWrap
        component="div"
        color="dark"
        sx={{ flexGrow: 1, textAlign: 'left' }}
      >
        {t('bpayDetails', { ns: 'contacts' })}
      </WBTypography>
      <WBTypography>
        {t('bpayDetailsDescription', { ns: 'contacts' })}
      </WBTypography>
      <WBCollapse in={showBpayDetails}>
        <WBFlex flexDirection={['column', 'row']} mt={[0, 4]}>
          <WBBox flex={1} pr={[0, 3]}>
            <Controller
              control={control}
              name={inputs.bpay.billerCode.name}
              //@ts-ignore
              defaultValue={inputs.bpay.billerCode.defaultValue}
              rules={inputs.bpay.billerCode.rules}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type={inputs.bpay.billerCode.type}
                  variant="standard"
                  label={inputs.bpay.billerCode.label}
                  placeholder={inputs.bpay.billerCode.placeholder}
                  error={!!errors?.bpay?.billerCode}
                  helperText={errors?.bpay?.billerCode?.message || ''}
                  margin="dense"
                />
              )}
            />
          </WBBox>
          <WBBox flex={1} pl={[0, 3]}>
            <Controller
              control={control}
              name={inputs.bpay.referenceNumber.name}
              defaultValue={inputs.bpay.referenceNumber.defaultValue}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type={inputs.bpay.referenceNumber.type}
                  variant="standard"
                  label={inputs.bpay.referenceNumber.label}
                  placeholder={inputs.bpay.referenceNumber.placeholder}
                  error={!!errors?.bpay?.referenceNumber}
                  helperText={errors?.bpay?.referenceNumber?.message || ''}
                  margin="dense"
                />
              )}
            />
          </WBBox>
        </WBFlex>
      </WBCollapse>
      <WBLink
        variant="body2"
        color="primary.main"
        mr={2}
        underline="always"
        onClick={() => setShowBpayDetails(!showBpayDetails)}
      >
        {t(showBpayDetails ? 'hideBpayDetails' : 'showBpayDetails', {
          ns: 'contacts',
        })}
      </WBLink>
    </WBBox>
  );
}

export default ContactBankForm;
