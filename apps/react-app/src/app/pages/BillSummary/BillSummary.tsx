import { useMediaQuery, WBFlex, WBForm } from '@admiin-com/ds-web';
import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import {
  BillCreateFormData,
  TaskCreation,
  useTaskCreationContext,
} from '../TaskCreation/TaskCreation';

import PdfViewer from '../../components/PdfViewer/PdfViewer';
import TaskSummaryCard from '../../components/TaskSummaryCard/TaskSummaryCard';
import PdfPotraitContainer from '../../components/PdfPotraitContainer/PdfPotraitContainer';
import { useTheme } from '@mui/material';
export const BillSummary = React.memo(function () {
  const { handleSubmit: onSubmit, pdfSignatureRef } = useTaskCreationContext();
  const values = useWatch<BillCreateFormData>();
  const { handleSubmit, control } = useFormContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <WBFlex
      flexDirection={['column', 'row']}
      justifyContent={'center'}
      mt={[2]}
    >
      <Controller
        control={control}
        name="documents"
        render={({ field }) =>
          field.value?.[0]?.src ? (
            <WBFlex
              flexDirection={'column'}
              height={['550px', '630px']}
              flex={1}
              // px={[0, 5, 10]}
              mb={[3, 10]}
            >
              {isMobile ? (
                <PdfPotraitContainer>
                  <PdfViewer
                    ref={pdfSignatureRef}
                    height={'100%'}
                    documentUrl={field.value?.[0]?.src}
                    annotations={values?.annotations}
                  />
                </PdfPotraitContainer>
              ) : (
                <PdfViewer
                  ref={pdfSignatureRef}
                  documentUrl={field.value?.[0]?.src}
                  annotations={values?.annotations}
                />
              )}
            </WBFlex>
          ) : (
            <WBFlex />
          )
        }
      />
      <WBForm
        flex={1}
        onSubmit={handleSubmit(onSubmit)}
        alignItems={'start'}
        display="flex"
        flexDirection={'column'}
        justifyContent={'center'}
        mt={0}
        pl={[0, 4, 6]}
        mb={3}
      >
        <TaskSummaryCard task={values as any} />
        <TaskCreation.SubmitButtons />
      </WBForm>
    </WBFlex>
  );
});
