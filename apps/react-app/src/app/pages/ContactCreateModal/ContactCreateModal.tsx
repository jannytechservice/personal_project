import React from 'react';
import { WBFullScreenModal } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { Contact } from '@admiin-com/ds-graphql';
import { ContactsCreateForm } from '../ContactDetail/ContactsCreateForm';
interface BulkImportProps {
  open: boolean;
  entityId?: string;
  onSuccess?: (contact: Contact) => void;
  handleCloseModal: () => void;
  selected?: any;
}

export function ContactCreateModal({
  open,
  onSuccess,
  entityId,
  handleCloseModal,
  selected,
}: BulkImportProps) {
  const { t } = useTranslation();

  return (
    <WBFullScreenModal
      leftToolbarIconProps={{
        onClick: () => handleCloseModal(),
      }}
      leftToolbarIconTitle={t('back', { ns: 'contacts' })}
      onClose={handleCloseModal}
      title={t(selected ? 'updateContact' : 'createContact', {
        ns: 'contacts',
      })}
      open={open}
    >
      <ContactsCreateForm
        entityId={entityId}
        selected={selected}
        onSubmitted={(contact) => {
          onSuccess && onSuccess(contact);
          handleCloseModal();
        }}
      />
    </WBFullScreenModal>
  );
}
