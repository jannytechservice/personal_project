import { Service, TaxType } from '@admiin-com/ds-graphql';
import { WBBox, WBSelect, WBTextField } from '@admiin-com/ds-web';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import ServicesLookup from '../ServicesLookup';
import { useTranslation } from 'react-i18next';
import { InputAdornment, InputLabel } from '@mui/material';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import React from 'react';

export default function LineItemsCreateForm() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();

  const preFillFormFields = (service: Service) => {
    setValue('unitAmount', service.amount);
    setValue('taxType', service.taxType);
  };

  const [quantity, unitAmount, taxType] = useWatch({
    control,
    name: ['quantity', 'unitAmount', 'taxType'],
    defaultValue: { quantity: 1, unitAmount: 0, taxType: '' },
  });

  React.useEffect(() => {
    setValue('lineAmount', (quantity ?? 1) * (unitAmount ?? 0));
  }, [quantity, unitAmount, taxType]);

  return (
    <>
      <Controller
        name="description"
        control={control}
        defaultValue={''}
        rules={{
          validate: (value) => {
            if (!value || !value?.description)
              return t('descriptionRequired', { ns: 'taskbox' });
            return true;
          },
        }}
        render={({ field }) => (
          <ServicesLookup
            isFormField
            {...field}
            onChange={(value) => {
              field.onChange(value);
              if (value.id) {
                preFillFormFields(value);
              }
            }}
            helperText={(errors[field.name]?.message as string) ?? ''}
            error={!!errors[field.name]}
          />
        )}
      />
      <Controller
        name="quantity"
        defaultValue={1}
        control={control}
        render={({ field }) => (
          <WBTextField
            {...field}
            label={t('qty', { ns: 'taskbox' })}
            type="number"
            helperText={(errors[field.name]?.message as string) ?? ''}
            error={!!errors[field.name]}
          />
        )}
      />
      <Controller
        name="unitAmount"
        defaultValue={0}
        control={control}
        render={({ field }) => (
          <WBTextField
            {...field}
            label={t('price', { ns: 'taskbox' })}
            type="number"
            leftIcon={<InputAdornment position="start">$</InputAdornment>}
            helperText={(errors[field.name]?.message as string) ?? ''}
            error={!!errors[field.name]}
          />
        )}
      />

      <Controller
        name="taxType"
        defaultValue={''}
        control={control}
        rules={{ required: t('gstRequired', { ns: 'taskbox' }) }}
        render={({ field }) => (
          <WBSelect
            {...field}
            placeholder={t('selectGST', { ns: 'taskbox' })}
            label={t('gst', { ns: 'taskbox' })}
            options={Object.keys(TaxType).map((key) => ({
              value: key,
              label: t(key, { ns: 'taskbox' }),
            }))}
            helperText={(errors[field.name]?.message as string as string) ?? ''}
            error={!!errors[field.name]}
          />
        )}
      />
      <Controller
        name="lineAmount"
        control={control}
        defaultValue={0}
        render={({ field }) => (
          <WBBox mt={2}>
            <InputLabel>{t('amount', { ns: 'taskbox' })}</InputLabel>
            <CurrencyNumber
              py={1}
              sx={{ borderBottom: `2px solid black` }}
              fontWeight={'normal'}
              sup={false}
              number={field.value ?? 0}
            />
          </WBBox>
        )}
      />
    </>
  );
}
