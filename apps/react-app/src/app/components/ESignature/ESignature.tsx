import { WBBox, WBButton, WBFlex } from '@admiin-com/ds-web';
import { styled, useMediaQuery, useTheme } from '@mui/material';
import React, { forwardRef } from 'react';
import SignatureDropArea from './SignatureDropArea';
import { useFormContext } from 'react-hook-form';
import ESignatureDesktop from './ESignatureDesktop';
import ESignatureMobile from './ESignatureMobile';
import { checkAnnotationDirection } from '../../helpers/signature';
import { useTaskCreationContext } from '../../pages/TaskCreation/TaskCreation';

export interface ESignatureProps {
  documentUrl: string;
  annotations?: any;
  userId?: string;
  onPdfLoad?: () => void;
  handleDraft?: () => Promise<void>;
  handleNext?: () => Promise<void>;
}

export const ESignature = forwardRef(
  (
    {
      documentUrl,
      onPdfLoad,
      annotations,
      userId,
      handleDraft,
      handleNext,
    }: ESignatureProps,
    instanceRef: any
  ) => {
    const { setTaskDirection } = useTaskCreationContext();
    const { setValue } = useFormContext();

    const saveAnnotations = async () => {
      const allAnnotations = await Promise.all(
        Array.from({ length: instanceRef.current?.totalPageCount }).map(
          (_, pageIndex) => instanceRef.current.getAnnotations(pageIndex)
        )
      );

      const flattenedAnnotations = allAnnotations.flat();
      const instantJSON = await instanceRef.current.exportInstantJSON(
        flattenedAnnotations
      );
      const annotationsString = JSON.stringify(instantJSON);
      setValue('annotations', annotationsString);

      const taskDirection = checkAnnotationDirection(annotationsString);
      setTaskDirection(taskDirection);

      return annotationsString;
    };

    const onDraft = async () => {
      await saveAnnotations();
      if (handleDraft) await handleDraft();
    };

    const onNext = async () => {
      await saveAnnotations();
      if (handleNext) await handleNext();
    };

    const [droppedSignature, setDroppedSignature] = React.useState<any>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return !isMobile ? (
      <ESignatureDesktop
        handleDraft={onDraft}
        annotations={annotations}
        userId={userId}
        onPdfLoad={onPdfLoad}
        handleNext={onNext}
        droppedSignature={droppedSignature}
        onDropped={setDroppedSignature}
        ref={instanceRef}
        documentUrl={documentUrl}
      />
    ) : (
      <ESignatureMobile
        handleDraft={onDraft}
        annotations={annotations}
        userId={userId}
        onPdfLoad={onPdfLoad}
        handleNext={onNext}
        droppedSignature={droppedSignature}
        onDropped={setDroppedSignature}
        ref={instanceRef}
        documentUrl={documentUrl}
      />
    );
  }
);
export default ESignature;
