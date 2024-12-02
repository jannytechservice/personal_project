import { WBBox, WBFlex } from '@admiin-com/ds-web';
import { Step, StepContent, StepLabel, Stepper, styled } from '@mui/material';
import React from 'react';
import InvoiceDetail from '../InvoiceDetail';
import { useTranslation } from 'react-i18next';
import { InvoiceNumberEdit } from '../InvoiceDetail/components/InvoiceNumberEdit';
import InvoiceLineItems from '../InvoiceLineItems';
import InvoiceConfirm from '../InvoiceConfirm';
import { useTaskCreationContext } from '../../pages/TaskCreation/TaskCreation';
import XModal from '../XModal';
import InvoiceRenderer from '../InvoiceConfirm/InvoiceRenderer';

export const InvoiceCreateForm = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const { t } = useTranslation();

  const handleNext = React.useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handlePreview = () => {
    setPreviewModalOpen(true);
  };

  const { handleConfirm, handleDraft } = useTaskCreationContext();
  const [preivewModalOpen, setPreviewModalOpen] = React.useState(false);

  const steps = React.useMemo(
    () => [
      {
        label: t('detail', { ns: 'taskbox' }),
        description: (
          <InvoiceDetail
            handleNext={handleNext}
            onDraft={handleDraft}
            onPreview={handlePreview}
          />
        ),
      },
      {
        label: t('itemsTitle', { ns: 'taskbox' }),
        description: (
          <InvoiceLineItems
            handleNext={handleNext}
            onDraft={handleDraft}
            onPreview={handlePreview}
          />
        ),
      },
      {
        label: t('confirm', { ns: 'taskbox' }),
        description: (
          <InvoiceConfirm onDraft={handleDraft} onSend={handleConfirm} />
        ),
      },
    ],
    []
  );

  return (
    <WBBox width="100%">
      <Stepper activeStep={activeStep} orientation="vertical" connector={<></>}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StyledLabel
              onClick={() => {
                if (index < activeStep) setActiveStep(index);
              }}
            >
              <WBFlex alignItems={'center'} justifyContent={'space-between'}>
                {step.label}
                {activeStep !== 0 && index == 0 && (
                  <InvoiceNumberEdit hideToolbar />
                )}
              </WBFlex>
            </StyledLabel>

            <StepContent TransitionProps={{ style: { width: '100%' } }}>
              {step.description}
            </StepContent>
          </Step>
        ))}
      </Stepper>
      <XModal
        open={preivewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
        }}
      >
        <InvoiceRenderer />
      </XModal>
    </WBBox>
  );
};
const StyledLabel = styled(StepLabel)(({ theme }) => ({
  cursor: 'pointer',
}));

//const StyledStepContent = styled(StepContent)(({ theme }) => ({
//  borderTop: `1px solid ${theme.palette.divider}`,
//  borderLeft: 0,
//  marginLeft: 0,
//  marginTop: theme.spacing(1),
//  padding: 0,
//  paddingTop: theme.spacing(2),
//}));
//
//const StyledStep = styled(Step)(({ theme }) => ({
//  marginTop: theme.spacing(1),
//}));
