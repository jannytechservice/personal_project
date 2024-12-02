import { WBBox, WBButton, WBFlex } from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SMSNumber } from './SMSNumber';
import InvoiceRenderer from './InvoiceRenderer';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTaskCreationContext } from '../../pages/TaskCreation/TaskCreation';
import { TaskType } from '@admiin-com/ds-graphql';

interface Props {
  onDraft: () => Promise<void>;
  onSend: () => Promise<void>;
}

export default function InvoiceConfirm(props: Props) {
  const { t } = useTranslation();
  const [draftLoading, setDraftLoading] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const { setTaskDirection } = useTaskCreationContext();
  const { setValue } = useFormContext();
  const handleConfirm = async () => {
    if (draftLoading || confirmLoading) return;
    setTaskDirection('SENDING');
    setValue('type', TaskType.PAY_ONLY);
    setConfirmLoading(true);
    try {
      await props.onSend();
    } finally {
      setConfirmLoading(false);
    }
  };
  const handleDraft = async () => {
    if (draftLoading || confirmLoading) return;
    setDraftLoading(true);
    setTaskDirection('SENDING');
    setValue('type', TaskType.PAY_ONLY);
    try {
      await props.onDraft();
    } finally {
      setDraftLoading(false);
    }
  };
  const to = useWatch({ name: 'to' });
  const smsSend = useWatch({ name: 'smsSend' });
  return (
    <Container>
      <PreviewConatiner flex={7}>
        <InvoiceRenderer />
      </PreviewConatiner>
      <ButtonsContainer flex={5}>
        <WBButton onClick={handleConfirm} loading={confirmLoading} fullWidth>
          {t('confirmSend', { ns: 'taskbox' })}
        </WBButton>
        <WBBox>
          <SMSNumber
            onAdd={() => {
              props.onSend();
            }}
            checked={smsSend}
            contact={to}
            onCheck={(value) => {
              setValue('smsSend', value);
            }}
          />
        </WBBox>
        <WBButton
          variant="outlined"
          onClick={handleDraft}
          loading={draftLoading}
          fullWidth
          type="button"
        >
          {t('saveAsDraft', { ns: 'taskbox' })}
        </WBButton>
      </ButtonsContainer>
    </Container>
  );
}
const Container = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'row',
  flex: 1,
  width: '100%',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const PreviewConatiner = styled(WBFlex)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
}));

const ButtonsContainer = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(1),
}));
