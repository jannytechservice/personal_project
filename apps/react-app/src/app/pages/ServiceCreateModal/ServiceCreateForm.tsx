import {
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBSelect,
  WBTextField,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import {
  CreateServiceInput,
  FeeType,
  Service,
  TaxType,
} from '@admiin-com/ds-graphql';
import { Controller, useForm } from 'react-hook-form';
import { InputAdornment } from '@mui/material';
import { REGEX } from '@admiin-com/ds-common';

export interface ServiceCreateFormProps {
  entityId: string;
  defaultService?: Service | null;
  loading: boolean;
  createService: (input: CreateServiceInput) => Promise<void>;
}

type CreateServerInputForm = Omit<CreateServiceInput, 'entityId'>;
export function ServiceCreateForm({
  loading,
  createService,
  entityId,
  defaultService,
}: ServiceCreateFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateServerInputForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: defaultService
      ? { ...defaultService, amount: defaultService.amount / 100 }
      : {},
  });
  const onSubmit = async (data: CreateServerInputForm) => {
    await createService({ entityId, ...data });
  };

  return (
    <WBForm onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="description"
        rules={{
          required: t('serviceDescriptionRequired', { ns: 'services' }),
        }}
        defaultValue=""
        render={({ field }) => (
          <WBTextField
            {...field}
            label={t('description', { ns: 'services' })}
            placeholder={t('descriptionPlaceholder', { ns: 'services' })}
            error={!!errors.description}
            helperText={errors.description?.message}
            margin="dense"
          />
        )}
      />
      {/* <Controller
                control={control}
                name="description"
                rules={{}}
                defaultValue={undefined}
                render={({ field }) => (
                    <FormControl sx={{ mt: 3 }} onBlur={field.onBlur}>
                        <FormLabel sx={{ verticalAlign: 'center' }}>
                            {t('description', { ns: 'services' })}
                        </FormLabel>
                        <RichTextEditor
                            {...field}
                            onChange={(value) => field.onChange({ target: { value } })}
                            onFocus={() => console.log('d')}
                        />
                    </FormControl>
                )}
            /> */}
      <WBFlex flexDirection={['column', 'row']}>
        <WBBox flex={[1, 3]} mr={[0, 3]}>
          <Controller
            control={control}
            name="amount"
            rules={{
              validate: {
                pattern: (value: any) =>
                  REGEX.AMOUNT.test(value) ||
                  t('amountInValid', { ns: 'taskbox' }),

                greaterThanZero: (value: any) =>
                  parseFloat(value) > 0 ||
                  t('amountMustBeGreaterThanZero', { ns: 'taskbox' }),
              },
            }}
            //@ts-ignore
            defaultValue={''}
            render={({ field }) => (
              <WBTextField
                {...field}
                type="number"
                label={t('amount', { ns: 'services' })}
                placeholder={'1000'}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                margin="dense"
                leftIcon={<InputAdornment position="start">$</InputAdornment>}
              />
            )}
          />
        </WBBox>
        <WBBox flex={[1, 3]} ml={[0, 3]}>
          <Controller
            control={control}
            name="feeType"
            rules={{ required: t('feeTypeRequired', { ns: 'services' }) }}
            //@ts-ignore
            defaultValue={''}
            render={({ field }) => (
              <WBSelect
                options={Object.values(FeeType).map((value) => ({
                  value,
                  label: t(value, { ns: 'services' }),
                }))}
                {...field}
                label={t('feeType', { ns: 'services' })}
                placeholder={t('feeTypePlaceholder', { ns: 'services' })}
                error={!!errors.feeType}
                helperText={errors.feeType?.message}
                margin="dense"
              />
            )}
          />
        </WBBox>
      </WBFlex>

      <WBFlex flexDirection={['column', 'row']}>
        <WBBox flex={[1, 3]} mr={[0, 3]}>
          <Controller
            control={control}
            name="taxType"
            rules={{ required: t('taxTypeRequired', { ns: 'services' }) }}
            //@ts-ignore
            defaultValue={''}
            render={({ field }) => (
              <WBSelect
                options={Object.values(TaxType).map((value) => ({
                  value,
                  label: t(value, { ns: 'common' }),
                }))}
                {...field}
                label={t('taxType', { ns: 'services' })}
                placeholder={t('taxTypePlaceholder', { ns: 'services' })}
                error={!!errors.feeType}
                helperText={errors.feeType?.message}
                margin="dense"
              />
            )}
          />
        </WBBox>
        <WBBox flex={[1, 3]} ml={[0, 3]} />
      </WBFlex>
      <WBButton loading={loading} sx={{ mt: 5 }} fullWidth>
        {t('save', { ns: 'services' })}
      </WBButton>
    </WBForm>
  );
}

export default ServiceCreateForm;
