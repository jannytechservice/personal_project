import {
  WBBox,
  WBDrawer,
  WBFlex,
  WBIconButton,
  WBTypography,
} from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import { RecipientSignature } from './RecipientSignature';
import { MySignatures } from './MySignatures';
import React, { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RecipientAddForm } from './AddRecipientSignModal/RecipientAddForm';
import { AddSignatureForm } from '../AddSignatureModal/AddSignatureForm';

interface Props {
  open: boolean;
  onClose: () => void;
}
export const SignatureDrawer = (props: Props) => {
  const [viewState, setViewState] = useState<'ALL' | 'ADD_MY' | 'ADD_OTHER'>(
    'ALL'
  );
  const { t } = useTranslation();
  return (
    <WBDrawer
      anchor={'bottom'}
      open={props.open}
      onClose={props.onClose}
      sx={{
        zIndex: 1400,
        display: { xs: 'block', sm: 'none' },
        pointerEvents: 'auto', // Allow events to pass through
      }}
      PaperProps={{
        sx: {
          width: '100%',
          display: 'flex',
          p: 0,
          backgroundColor: 'background.default',
          pointerEvents: 'auto', // Ensure children get events
        },
      }}
    >
      {viewState === 'ALL' ? (
        <SignatureDragContainer>
          <SignatureSection>
            <MySignatures onAddClick={() => setViewState('ADD_MY')} />
          </SignatureSection>
          <SignatureSection>
            <RecipientSignature onAddClick={() => setViewState('ADD_OTHER')} />
          </SignatureSection>
        </SignatureDragContainer>
      ) : (
        <WBFlex m={1} flexDirection={'column'} my={2}>
          <WBFlex alignItems={'center'}>
            <WBIconButton
              onClick={() => setViewState('ALL')}
              icon="ArrowBack"
            />
            <WBTypography variant="h3">
              {viewState === 'ADD_OTHER'
                ? t('addRecipientSignatureTitle', { ns: 'taskbox' })
                : t('addMySignatureTitle', { ns: 'taskbox' })}
            </WBTypography>
          </WBFlex>
          <WBBox>
            {viewState === 'ADD_OTHER' ? (
              <RecipientAddForm
                onSubmit={() => {
                  setViewState('ALL');
                }}
                onClose={() => setViewState('ALL')}
              />
            ) : (
              <AddSignatureForm
                handleSave={() => {
                  setViewState('ALL');
                }}
              />
            )}
          </WBBox>
        </WBFlex>
      )}
    </WBDrawer>
  );
};
const SignatureDragContainer = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'column',
}));
const SignatureSection = styled(WBFlex)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  gap: theme.spacing(0.5),
  background: theme.palette.background.paper,
  flexDirection: 'column',
}));
