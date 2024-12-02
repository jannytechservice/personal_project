import { WBFlex, WBTypography } from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import AddNewButton from './AddNewButton';
import { AddRecipientSignModal } from './AddRecipientSignModal';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import DragDropField from './DragDropField';

const SIGNATURE_COLORS = [
  { iconColour: '#E5CA4C', backgroundColor: '#F7EDC4' },
  { iconColour: '#9DDC8B', backgroundColor: '#D7F7CE' },
  { iconColour: '#8FCFE7', backgroundColor: '#C4E9F7' },
  { iconColour: '#CEA3FC', backgroundColor: '#DDC4F7' },
  { iconColour: '#FFB48F', backgroundColor: '#F7CEBA' },
];

export const RecipientSignature = (props: { onAddClick?: () => void }) => {
  const { t } = useTranslation();
  const [openAddRecipientModal, setOpenAddRecipientModal] =
    React.useState(false);
  const { control } = useFormContext();
  const signers = useWatch({ control, name: 'signers' });
  const validSigners = signers.filter(
    (signer: any) => signer.name && signer.email
  );
  return (
    <>
      <WBTypography fontWeight={'bold'} color={'text.secondary'}>
        {t('getAnyoneToSign', { ns: 'taskbox' })}
      </WBTypography>
      <WBTypography mb={2} color={'text.secondary'}>
        {t('getAnyoneToSignDescription', { ns: 'taskbox' })}
      </WBTypography>
      {validSigners.map((signer: any, index: number) => (
        <DragDropField
          type="SIGNATURE"
          key={index}
          name={signer.name}
          signer={{ ...signer, color: SIGNATURE_COLORS[index].backgroundColor }}
        />
      ))}
      <AddNewButton
        name={t('addRecipientSignature', { ns: 'taskbox' })}
        onClick={() => {
          if (props.onAddClick) props.onAddClick();
          else setOpenAddRecipientModal(true);
        }}
      />
      <AddRecipientSignModal
        open={openAddRecipientModal}
        onClose={() => setOpenAddRecipientModal(false)}
        onDone={() => {
          console.log('done');
        }}
      />
    </>
  );
};
