import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import AddNewButton from './AddNewButton';
import AddSignatureModal from '../AddSignatureModal/AddSignatureModal';
import React from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser/useCurrentUser';
import DragDropField from './DragDropField';
import { useTheme, useMediaQuery } from '@mui/material';
import { Signature } from '@admiin-com/ds-graphql';

export const MySignatures = (props: { onAddClick?: () => void }) => {
  const { t } = useTranslation();
  const [showAddSignatureModal, setShowAddSignatureModal] =
    React.useState(false);
  const user = useCurrentUser();
  const signatures = user?.signatures?.items || [];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <WBTypography fontWeight={'bold'} color="text.secondary">
        {t('signADocumentYourself', { ns: 'taskbox' })}
      </WBTypography>
      <WBTypography color="text.secondary">
        {t('signADocumentYourselfDescription', { ns: 'taskbox' })}
      </WBTypography>
      <AddNewButton
        name={t('addYourSignature', { ns: 'taskbox' })}
        onClick={() => {
          if (props.onAddClick) props.onAddClick();
          else setShowAddSignatureModal(true);
        }}
      />
      <WBTypography fontWeight={'bold'}>
        {t('savedSignatures', { ns: 'taskbox' })}
      </WBTypography>
      {signatures.length > 0 ? (
        signatures.map(
          (signature: Signature | null, index: number) =>
            signature && (
              <DragDropField
                type="SIGNATURE"
                key={index}
                name={`${user.firstName} ${user.lastName}`}
                signature={signature}
                signer={{
                  email: user.email ?? '',
                  signerType: 'ENTITY_USER',
                  id: user.id ?? signature.userId,
                  name: `${user.firstName} ${user.lastName}`,
                }}
              />
            )
        )
      ) : (
        <WBTypography>{t('noSavedSignature', { ns: 'taskbox' })}</WBTypography>
      )}

      {!isMobile && (
        <AddSignatureModal
          open={showAddSignatureModal}
          handleClose={() => setShowAddSignatureModal(false)}
        />
      )}
    </>
  );
};
