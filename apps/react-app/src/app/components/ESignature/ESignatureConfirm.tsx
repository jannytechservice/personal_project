import {
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBTypography,
} from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SignatureForm } from './SignatureForm';
import PdfViewer from '../PdfViewer/PdfViewer';
import React, { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { BottomDrawer } from './BottomDrawer';
import { TaskType } from '@admiin-com/ds-graphql';
import { useTaskCreationContext } from '../../pages/TaskCreation/TaskCreation';

export const ESignatureConfirm = React.forwardRef(
  (
    {
      handleNext,
      handleDraft,
      handleBackToEdit,
    }: {
      handleBackToEdit: () => void;
      handleDraft: () => Promise<void>;
      handleNext: (data: any) => Promise<void>;
    },
    ref
  ) => {
    const {
      setValue,
      handleSubmit,
      formState: { errors },
    } = useFormContext();
    const { t } = useTranslation();
    const documents = useWatch({ name: 'documents' });
    const documentUrl = documents?.[0]?.src;
    const annotations = useWatch({ name: 'annotations' });
    const [loading, setLoading] = useState(false);
    const [loadDrafting, setDraftLoading] = useState(false);
    const { taskDirection } = useTaskCreationContext();
    console.log(errors);
    const onSubmit = async (data: any) => {
      try {
        setLoading(true);
        setValue('type', TaskType.SIGN_ONLY);
        await handleNext(data);
      } finally {
        setLoading(false);
      }
    };
    const onDraft = async () => {
      console.log('draft');
      try {
        setDraftLoading(true);
        setValue('type', TaskType.SIGN_ONLY);
        await handleDraft();
      } finally {
        setDraftLoading(false);
      }
    };
    return (
      <WBForm mt={0} onSubmit={handleSubmit(onSubmit)}>
        <WBTypography variant="h3" sx={{ display: ['none', 'flex'] }}>
          {t('confirmSend', { ns: 'taskbox' })}
        </WBTypography>
        <WBFlex mt={[0, 3]} gap={2} mb={5}>
          <Section sx={{ display: ['none', 'flex'] }}>
            <PdfViewer
              ref={ref}
              documentUrl={documentUrl}
              annotations={annotations}
            />
          </Section>
          <Section>
            <SignatureForm />
          </Section>
        </WBFlex>
        <WBFlex
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          display={['none', 'flex']}
        >
          <WBBox>
            <WBButton
              variant="outlined"
              sx={{ px: 3 }}
              onClick={handleBackToEdit}
            >
              {t('backToEdit', { ns: 'taskbox' })}
            </WBButton>
          </WBBox>
          <WBFlex gap={3} alignItems={'center'}>
            <WBButton
              variant="outlined"
              sx={{ px: 3 }}
              type="button"
              loading={loadDrafting}
              onClick={onDraft}
            >
              {t('saveAsDraft', { ns: 'taskbox' })}
            </WBButton>
            <WBButton
              loading={loading}
              variant="contained"
              sx={{ px: 3 }}
              type="submit"
            >
              {t('send', { ns: 'taskbox' })}
            </WBButton>
          </WBFlex>
        </WBFlex>
        <BottomDrawer>
          <WBFlex flexDirection={'column'} gap={2} my={2} mx={3}>
            <WBFlex width={'100%'} justifyContent={'center'} gap={2}>
              <WBButton
                variant="outlined"
                sx={{ px: 3, flex: 1 }}
                onClick={handleBackToEdit}
              >
                {t('backToEdit', { ns: 'taskbox' })}
              </WBButton>

              <WBButton
                variant="outlined"
                sx={{ px: 3, flex: 1 }}
                type="button"
                loading={loadDrafting}
                onClick={onDraft}
              >
                {t('saveAsDraft', { ns: 'taskbox' })}
              </WBButton>
            </WBFlex>
            <WBFlex
              gap={3}
              alignItems={'center'}
              width={'100%'}
              justifyContent={'center'}
            >
              <WBButton
                fullWidth
                variant="contained"
                loading={loading}
                sx={{ px: 3 }}
                type="submit"
              >
                {t(taskDirection === 'RECEIVING' ? 'create' : 'send', {
                  ns: 'taskbox',
                })}
              </WBButton>
            </WBFlex>
          </WBFlex>
        </BottomDrawer>
      </WBForm>
    );
  }
);

const Section = styled(WBFlex)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  flex: 1,
  minHeight: '600px',
  marginBottom: theme.spacing(0),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(15),
  },
}));
