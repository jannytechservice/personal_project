import {
  WBBox,
  WBFlex,
  WBSvgIcon,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { InputLabel, styled, useTheme } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import AutoCompleteLookup, {
  AutoCompleteDataType,
} from '../../AutoCompleteLookup/AutoCompleteLookup';
import {
  useCurrentEntityId,
  useSelectedEntity,
} from '../../../hooks/useSelectedEntity/useSelectedEntity';
import DueDateSelector from '../../DueDateSelector/DueDateSelector';
import { DATE_FORMATS } from '@admiin-com/ds-common';
import React from 'react';
import {
  Signer,
  useTaskCreationContext,
} from '../../../pages/TaskCreation/TaskCreation';
import UserIcon from '../../../../assets/icons/user.svg';
import { TaskDirection } from '@admiin-com/ds-graphql';
import { useContactSelection } from '../../../hooks/useContactSelection/useContactSelection';
import { OtherRecipientAddForm } from './OtherRecipientAddForm';

export const SignatureForm = () => {
  const { control, setValue } = useFormContext();
  const { entity } = useSelectedEntity();
  const entityId = useCurrentEntityId();
  const { t } = useTranslation();
  const { taskDirection } = useTaskCreationContext();
  const inputs = React.useMemo(
    () => ({
      from: {
        label: t('from', { ns: 'taskbox' }),
        name: 'from' as const,
        type: 'text',
        defaultValue: undefined,
        placeholder: t('entitySearchPlaceholder', { ns: 'taskbox' }),
        rules: { required: t('fromRequired', { ns: 'taskbox' }) },
      },
      to: {
        label: t('to', { ns: 'taskbox' }),
        name: 'to' as const,
        type: 'text',
        defaultValue: undefined,
        placeholder: t('selectContact', { ns: 'taskbox' }),
        rules: { required: t('toRequired', { ns: 'taskbox' }) },
      },
      dueAt: {
        label: t('dueAt', { ns: 'taskbox' }),
        name: 'dueAt' as const,
        type: 'date',
        placeholder: DATE_FORMATS.USER_DATE,
        defaultValue: '',
        rules: { required: t('dueAtRequired', { ns: 'taskbox' }) },
      },
      note: {
        label: t('comments', { ns: 'taskbox' }),
        name: 'notes' as const,
        type: 'text',
        placeholder: `${t('writeCommentsAboutSignature', { ns: 'taskbox' })}`,
        defaultValue: undefined,
        rules: {},
      },
    }),
    [t, entity, taskDirection]
  );

  const signers = useWatch({ name: 'signers' });
  let fromType: AutoCompleteDataType = 'Entity';
  let toType: AutoCompleteDataType = 'Entity';
  const { selectedContact } = useContactSelection();

  React.useEffect(() => {
    if (taskDirection === TaskDirection.SENDING) {
      setValue('to', null);
      setValue('from', null);
      if (entity) {
        setValue('from', entity);
      }
    } else if (taskDirection === TaskDirection.RECEIVING) {
      setValue('from', null);
      if (selectedContact) {
        setValue('from', selectedContact);
      }
      if (entity) {
        setValue('to', entity);
      }
    }
  }, [taskDirection, entity, selectedContact]);

  switch (taskDirection) {
    case TaskDirection.SENDING:
      fromType = 'Entity';
      toType = 'Contact';
      break;
    case TaskDirection.RECEIVING:
      fromType = 'ContactsAndVerifiedEntity';
      toType = 'Entity';
      break;
  }
  return (
    <Container>
      {/* <TextFormField
          label={t('documentName', { ns: 'taskbox' })}
          value={name}
        /> */}
      <Controller
        control={control}
        name="reference"
        defaultValue={''}
        rules={{ required: t('referenceRequired', { ns: 'taskbox' }) }}
        render={({ field, formState: { errors } }) => (
          <WBTextField
            {...field}
            label={t('documentName', { ns: 'taskbox' })}
            fullWidth
            helperText={(errors[field.name]?.message as string) ?? ''}
            error={!!errors[field.name]}
          />
        )}
      />
      <Controller
        control={control}
        name={'from'}
        rules={inputs.from.rules}
        defaultValue={inputs.from.defaultValue}
        render={({ field, formState: { errors } }) => (
          <AutoCompleteLookup
            {...field}
            noPopupIcon
            label={inputs.from.label}
            placeholder={inputs.from.placeholder}
            entityId={entityId}
            type={fromType}
            helperText={(errors[field.name]?.message as string) ?? ''}
            // disabled={!!task}
            error={!!errors[field.name]}
          />
        )}
      />
      {taskDirection === 'RECEIVING' && (
        <Controller
          control={control}
          name={'to'}
          rules={inputs.to.rules}
          defaultValue={inputs.to.defaultValue}
          render={({ field, formState: { errors } }) => (
            <AutoCompleteLookup
              {...field}
              noPopupIcon
              label={inputs.to.label}
              placeholder={inputs.to.placeholder}
              entityId={entityId}
              type={toType}
              helperText={(errors[field.name]?.message as string) ?? ''}
              // disabled={!!task}
              error={!!errors[field.name]}
            />
          )}
        />
      )}
      <Controller
        control={control}
        name={'dueAt'}
        rules={inputs.dueAt.rules}
        defaultValue={inputs.dueAt.defaultValue}
        render={({ field, formState: { errors } }) => (
          <DueDateSelector
            {...field}
            type={inputs.dueAt.type}
            placeholder={inputs.dueAt.placeholder}
            label={inputs.dueAt.label}
            fullWidth
            sx={{ flex: 1 }}
            helperText={(errors[field.name]?.message as string) ?? ''}
            error={!!errors[field.name]}
          />
        )}
      />
      <Controller
        control={control}
        name={'notes' as const}
        rules={inputs.note.rules}
        render={({ field }) => (
          <WBTextField
            {...field}
            type={inputs.note.type}
            placeholder={inputs.note.placeholder}
            label={inputs.note.label}
            key={field.name}
            multiline
            fullWidth
          />
        )}
      />
      {signers.length > 0 && (
        <WBTypography variant="h5" mt={5}>
          {t('documentWillBeSentTo', { ns: 'taskbox' })}
        </WBTypography>
      )}
      <WBFlex flexDirection={'column'} gap={2}>
        {signers.map((signer: Signer, index: number) => (
          <React.Fragment key={index}>
            <WBFlex gap={3} alignItems={'center'} display={['none', 'flex']}>
              <WBTypography>{index + 1}</WBTypography>
              <WBFlex flex={1}>
                <WBBox flex={1} minWidth="50%" pr={2}>
                  <TextFormField
                    label={t('name', { ns: 'taskbox' })}
                    value={signer.name}
                    icon={
                      <WBSvgIcon fontSize="small" color="#000">
                        <UserIcon />
                      </WBSvgIcon>
                    }
                  />
                </WBBox>
                <WBBox flex={1} minWidth="50%" pr={2}>
                  <TextFormField
                    label={t('email', { ns: 'taskbox' })}
                    value={signer.email}
                  />
                </WBBox>
              </WBFlex>
            </WBFlex>
            <WBFlex gap={3} key={index} display={['flex', 'none']}>
              <WBTypography>{index + 1}</WBTypography>
              <WBBox>
                <WBTypography fontWeight={'bold'}> {signer.name}</WBTypography>
                <WBTypography color={'text.secondary'}>
                  {signer.email}
                </WBTypography>
              </WBBox>
            </WBFlex>
          </React.Fragment>
        ))}
      </WBFlex>
      <WBTypography variant="h5" mt={5}>
        {t('otherRecipientOptional', { ns: 'taskbox' })}
      </WBTypography>
      <WBTypography color={'text.secondary'}>
        {t('otherRecipientDescription', { ns: 'taskbox' })}
      </WBTypography>
      <OtherRecipientAddForm />
    </Container>
  );
};

const Container = styled(WBBox)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
}));

export const TextFormField = ({
  label,
  value,
  icon,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) => {
  const theme = useTheme();
  return (
    <WBBox width="100%" maxWidth="100%">
      <InputLabel>{label}</InputLabel>
      <WBFlex
        sx={{
          borderBottom: `2px solid ${theme.palette.divider}`,
          alignItems: 'center',
          gap: 1,
          minHeight: '50px',
          maxWidth: '100%',
        }}
      >
        {icon}
        <WBTypography noWrap sx={{ lineHeight: '48px' }}>
          {value ?? 'pdf'}
        </WBTypography>
      </WBFlex>
    </WBBox>
  );
};
