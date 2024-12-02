import {
  WBBox,
  WBButton,
  WBDrawer,
  WBFlex,
  WBSvgIcon,
  WBTypography,
} from '@admiin-com/ds-web';
import { styled, useTheme } from '@mui/material';
import React, { forwardRef } from 'react';
import DragDropField from './DragDropField';
import SignatureDropArea from './SignatureDropArea';
import { useTranslation } from 'react-i18next';
import { RecipientSignature } from './RecipientSignature';
import { MySignatures } from './MySignatures';
import SignatureIcon from '../../../assets/icons/signature.svg';
import TextIcon from '../../../assets/icons/text.svg';
import DateIcon from '../../../assets/icons/date.svg';
import { SignatureDrawer } from './SignatureDrawer';
import { BottomDrawer } from './BottomDrawer';

export interface ESignatureMobileProps {
  documentUrl: string;
  annotations?: any;
  userId?: string;
  onPdfLoad?: () => void;
  handleDraft?: () => Promise<void>;
  handleNext?: () => Promise<void>;
  onDropped?: (signature: any) => void;
  droppedSignature?: any;
}
export const DropContext = React.createContext<any>(null);

export const ESignatureMobile = forwardRef(
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
    }: ESignatureMobileProps,
    instanceRef: any
  ) => {
    const { t } = useTranslation();
    const [showSignatureDrawer, setShowSignatureDrawer] =
      React.useState<boolean>(false);
    const handleDrop = (e: any, clickEvent: any) => {
      instanceRef?.current?.handleDrop(e, clickEvent);
      setShowSignatureDrawer(false);
    };

    const [loading, setLoading] = React.useState(false);
    const onNext = async () => {
      try {
        setLoading(true);
        if (handleNext) await handleNext();
      } finally {
        setLoading(false);
      }
    };
    const onDraft = async () => {
      try {
        setLoading(true);
        if (handleDraft) await handleDraft();
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <Container>
          <RowContainer>
            <PdfContainer>
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
        </Container>
        <DropContext.Provider
          value={{
            handleDrop,
          }}
        >
          <BottomDrawer>
            <WBFlex
              flexDirection={['column']}
              p={1}
              sx={{ bgcolor: 'background.paper' }}
            >
              <WBFlex padding={2}>
                <DragDropField
                  type="SIGNATURE"
                  isMobile
                  onClick={() => setShowSignatureDrawer(true)}
                />
                <DragDropField type="NAME" isMobile signer={droppedSignature} />
                <DragDropField type="DATE" isMobile signer={droppedSignature} />
              </WBFlex>
              <WBFlex gap={3} justifyContent={'center'}>
                {/* <WBButton
                  variant="outlined"
                  sx={{ px: 3, flex: 1 }}
                  onClick={onDraft}
                  loading={loading}
                >
                  {t('saveAsDraft', { ns: 'taskbox' })}
                </WBButton> */}
                <WBButton
                  variant="contained"
                  sx={{ px: 3, flex: 1 }}
                  onClick={onNext}
                  loading={loading}
                >
                  {t('next', { ns: 'taskbox' })}
                </WBButton>
              </WBFlex>
            </WBFlex>
          </BottomDrawer>

          <SignatureDrawer
            open={showSignatureDrawer}
            onClose={() => setShowSignatureDrawer(false)}
          />
        </DropContext.Provider>
      </>
    );
  }
);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const Container = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  paddingBottom: theme.spacing(isSafari ? 24 : 24),
}));
const RowContainer = styled(WBFlex)(({ theme }) => ({
  gap: theme.spacing(2),
  flexDirection: 'column',
  flex: 1,
}));

const PdfContainer = styled(WBBox)(({ theme }) => ({
  flex: 1,
}));

export default ESignatureMobile;
