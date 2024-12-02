import { WBBox, WBButton, WBFlex } from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import React, { forwardRef } from 'react';
import DragDropField from './DragDropField';
import SignatureDropArea from './SignatureDropArea';
import { useTranslation } from 'react-i18next';
import { RecipientSignature } from './RecipientSignature';
import { MySignatures } from './MySignatures';

export interface ESignatureDesktopProps {
  documentUrl: string;
  annotations?: any;
  userId?: string;
  onPdfLoad?: () => void;
  handleDraft?: () => void;
  handleNext?: () => void;
  onDropped?: (signature: any) => void;
  droppedSignature?: any;
}

export const ESignatureDesktop = forwardRef(
  (
    {
      documentUrl,
      onPdfLoad,
      annotations,
      userId,
      droppedSignature,
      onDropped,
      handleDraft,
      handleNext,
    }: ESignatureDesktopProps,
    instanceRef: any
  ) => {
    const { t } = useTranslation();

    return (
      <Container height="100%">
        <RowContainer>
          <SignatureDragContainer>
            <SignatureSection>
              <MySignatures />
            </SignatureSection>
            <SignatureSection>
              <RecipientSignature />
            </SignatureSection>
          </SignatureDragContainer>
          <PdfContainer>
            <DragDropContainer>
              <DragDropField type="DATE" signer={droppedSignature} />
              <DragDropField type="NAME" signer={droppedSignature} />
            </DragDropContainer>
            <SignatureDropArea
              documentUrl={documentUrl}
              ref={instanceRef}
              userId={userId}
              annotations={annotations}
              onPdfLoad={onPdfLoad}
              onDrop={onDropped}
            />
          </PdfContainer>
        </RowContainer>
        <WBFlex gap={3} justifyContent={'end'} mt={3}>
          {/* <WBButton variant="outlined" sx={{ px: 3 }} onClick={handleDraft}>
            {t('saveAsDraft', { ns: 'taskbox' })}
          </WBButton> */}
          <WBButton variant="contained" sx={{ px: 3 }} onClick={handleNext}>
            {t('next', { ns: 'taskbox' })}
          </WBButton>
        </WBFlex>
      </Container>
    );
  }
);
const Container = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'column',
  height: '100%',
}));
const RowContainer = styled(WBFlex)(({ theme }) => ({
  height: '100%',
  gap: theme.spacing(2),
  // height:"400px"
}));
const SignatureDragContainer = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(2),
  overflowY: 'scroll',
}));

const DragDropContainer = styled(WBFlex)(({ theme }) => ({
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  background: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.grey[400]}`,
}));

const PdfContainer = styled(WBBox)(({ theme }) => ({
  flex: 1,
  // height: '100%',
  height: '600px',
}));

const SignatureSection = styled(WBFlex)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  gap: theme.spacing(0.5),
  background: theme.palette.background.paper,
  flexDirection: 'column',
}));

export default ESignatureDesktop;
