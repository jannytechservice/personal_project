import React, { useCallback } from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from '@mui/material';
import SimpleDrawDlg from '../../SimpleDrawDlg/SimpleDrawDlg';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import {
  WBBox,
  WBButton,
  WBCheckbox,
  WBFlex,
  WBForm,
  WBIconButton,
  WBLinkButton,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { useCurrentEntityId } from '../../../hooks/useSelectedEntity/useSelectedEntity';
import { REGEX } from '@admiin-com/ds-common';
import { OtherRecipientInput } from '@admiin-com/ds-graphql';

const EmailField = React.memo(
  ({
    index,
    control,
    errors,
  }: {
    index: number;
    control: any;
    errors: any;
  }) => {
    const { t } = useTranslation();
    return (
      <Controller
        control={control}
        name={`otherReceipient.${index}.email`}
        rules={{
          required: t('emailRequired', { ns: 'common' }),
          pattern: {
            value: REGEX.EMAIL,
            message: t('invalidEmail', { ns: 'common' }),
          },
        }}
        render={({ field }) => (
          <WBBox flex={1}>
            <WBTextField
              {...field}
              label={`${t('email', { ns: 'contacts' })}*`}
              placeholder={t('emailPlaceholder', { ns: 'contacts' })}
              error={!!errors?.otherReceipient?.[index]?.email}
              helperText={
                errors?.otherReceipient?.[index]?.email?.message || ''
              }
              margin="dense"
            />
          </WBBox>
        )}
      />
    );
  }
);

export const OtherRecipientAddForm = () => {
  const entityId = useCurrentEntityId();
  const theme = useTheme();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext<{ otherReceipient: OtherRecipientInput[] }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'otherReceipient',
  });
  const { t } = useTranslation();

  const handleAdd = () => {
    if (fields.length < 5)
      append({
        email: '',
        sendOnCompletion: false,
      });
  };

  const onSubmit = () => {
    console.log('data');
  };

  return (
    <WBForm onSubmit={handleSubmit(onSubmit)} mt={0}>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <WBFlex
            sx={{ display: ['none', 'flex'] }}
            alignItems={'center'}
            gap={5}
          >
            <EmailField index={index} control={control} errors={errors} />
            <Controller
              control={control}
              name={`otherReceipient.${index}.sendOnCompletion`}
              render={({ field }) => (
                <WBBox flex={1}>
                  <WBCheckbox
                    {...field}
                    label={t('sendOnCompletion', { ns: 'taskbox' })}
                  />
                </WBBox>
              )}
            />
          </WBFlex>
          <WBFlex
            my={1}
            sx={{ bgcolor: 'background.paper', display: ['flex', 'none'] }}
            gap={1}
            width={'100%'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <WBFlex flex={1} flexDirection={'column'} alignItems={'center'}>
              <EmailField index={index} control={control} errors={errors} />
            </WBFlex>
            <Controller
              control={control}
              name={`otherReceipient.${index}.sendOnCompletion`}
              render={({ field }) => <WBCheckbox {...field} />}
            />
          </WBFlex>
        </React.Fragment>
      ))}
      {fields.length <= 5 && (
        <WBFlex justifyContent={'start'} mt={3} color={'primary.main'}>
          <WBLinkButton onClick={() => handleAdd()}>
            {t('addOtherRecipient', { ns: 'taskbox' })}
          </WBLinkButton>
        </WBFlex>
      )}
    </WBForm>
  );
};
