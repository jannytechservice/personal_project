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
  WBFlex,
  WBForm,
  WBIconButton,
  WBLinkButton,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { useCurrentEntityId } from '../../../hooks/useSelectedEntity/useSelectedEntity';
import SignerLookup from '../../AutoCompleteLookup/SignerLookup';
import { REGEX } from '@admiin-com/ds-common';
import { Signer } from '../../../pages/TaskCreation/TaskCreation';

// Types for props and form data
interface RecipientAddFormProps {
  onSubmit: (data: Signer[]) => void;
  onClose: () => void;
}

// Type definition for a single signer field
interface SignerField {
  id: string;
  name: string;
  email: string;
  signerType: string;
  data: any;
}

const NameField = React.memo(
  ({
    index,
    control,
    setValue,
    errors,
    entityId,
  }: {
    index: number;
    control: any;
    setValue: (name: string, value: any) => void;
    errors: any;
    entityId: string;
  }) => {
    const { t } = useTranslation();

    return (
      <Controller
        control={control}
        name={`signers.${index}.data`}
        rules={{
          validate: (value: any) => {
            if (!value || !value.name) {
              return t('signerRequired', { ns: 'taskbox' });
            }
            return true;
          },
        }}
        render={({ field }) => (
          <SignerLookup
            {...field}
            label={t('name', { ns: 'taskbox' })}
            placeholder={t('selectName', { ns: 'taskbox' })}
            type={'Signer'}
            entityId={entityId}
            noLookup={field.value?.noLookup}
            error={!!errors?.signers?.[index]?.data}
            tabIndex={0}
            helperText={
              (errors?.signers?.[index]?.data?.message as string) || ''
            }
            onChange={(data) => {
              field.onChange(data);
              if (data.id) {
                setValue(
                  `signers.${index}.id`,
                  data.searchType === 'CONTACT' ? data.id : data.userId
                );
                setValue(`signers.${index}.name`, data.name);
                setValue(`signers.${index}.email`, data.email);
                setValue(`signers.${index}.signerType`, data.searchType);
              } else {
                setValue(`signers.${index}.id`, uuidv4());
                setValue(`signers.${index}.name`, data.name);
                setValue(`signers.${index}.signerType`, 'GUEST');
              }
              setValue(`signers.${index}.entityId`, data?.entityId ?? entityId);
            }}
          />
        )}
      />
    );
  }
);

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
        name={`signers.${index}.email`}
        rules={{
          required: t('emailRequired', { ns: 'common' }),
          pattern: {
            value: REGEX.EMAIL,
            message: t('invalidEmail', { ns: 'common' }),
          },
        }}
        render={({ field }) => (
          <WBTextField
            {...field}
            label={`${t('email', { ns: 'contacts' })}*`}
            placeholder={t('emailPlaceholder', { ns: 'contacts' })}
            error={!!errors?.signers?.[index]?.email}
            helperText={errors?.signers?.[index]?.email?.message || ''}
            margin="dense"
          />
        )}
      />
    );
  }
);

export const RecipientAddForm: React.FC<RecipientAddFormProps> = (props) => {
  const entityId = useCurrentEntityId();
  const theme = useTheme();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext<{ signers: SignerField[] }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'signers',
  });
  const { t } = useTranslation();

  const onSubmit = useCallback(
    (data: { signers: SignerField[] }) => {
      props.onSubmit(data.signers as any);
    },
    [props]
  );

  const handleAdd = () => {
    if (fields.length < 5)
      append({
        email: '',
        name: '',
        data: null,
        signerType: 'GUEST',
        id: uuidv4(),
      });
  };

  React.useEffect(() => {
    if (fields.length === 0) {
      handleAdd();
    }
  }, [fields]);

  return (
    <WBForm onSubmit={handleSubmit(onSubmit)} mt={0}>
      <DialogContent sx={{ minHeight: '300px', px: 0, py: 0 }}>
        {fields.length === 0 ? (
          <WBTypography mb={2} px={3}>
            {t('createRecepientDescription', { ns: 'taskbox' })}
          </WBTypography>
        ) : (
          fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <WBFlex
                sx={{ display: ['none', 'flex'] }}
                alignItems={'center'}
                gap={5}
              >
                <WBTypography>{index + 1}</WBTypography>
                <NameField
                  index={index}
                  control={control}
                  setValue={setValue as any}
                  errors={errors}
                  entityId={entityId}
                />
                <EmailField index={index} control={control} errors={errors} />

                <WBIconButton
                  icon="Close"
                  color={theme.palette.grey[500] as any}
                  onClick={() => remove(index)}
                />
              </WBFlex>
              <WBFlex
                my={1}
                sx={{ bgcolor: 'background.paper', display: ['flex', 'none'] }}
                gap={1}
                width={'100%'}
                alignItems={'start'}
                justifyContent={'space-between'}
              >
                <WBFlex
                  flex={1}
                  p={2}
                  mx={2}
                  flexDirection={'column'}
                  alignItems={'center'}
                >
                  <NameField
                    index={index}
                    control={control}
                    setValue={setValue as any}
                    errors={errors}
                    entityId={entityId}
                  />
                  <EmailField index={index} control={control} errors={errors} />
                </WBFlex>
              </WBFlex>
            </React.Fragment>
          ))
        )}
        {fields.length <= 5 && (
          <WBFlex justifyContent={'end'} mt={3} color={'primary.main'}>
            <WBLinkButton onClick={() => handleAdd()}>
              {t('addRecipient', { ns: 'taskbox' })}
            </WBLinkButton>
          </WBFlex>
        )}
      </DialogContent>

      <DialogActions>
        <WBButton
          type="button"
          variant="outlined"
          sx={{ px: 4 }}
          onClick={props.onClose}
        >
          {t('cancel', { ns: 'taskbox' })}
        </WBButton>
        <WBButton sx={{ px: 4 }} type="submit">
          {t('done', { ns: 'taskbox' })}
        </WBButton>
      </DialogActions>
    </WBForm>
  );
};
