import { Contact, getContact } from '@admiin-com/ds-graphql';
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { cloneContactWithSearchName } from '../../pages/ContactDetail/ContactDetail';

export const useContactSelection = () => {
  const { id } = useParams();
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const { data: getContactData, loading } = useQuery(gql(getContact), {
    variables: {
      id,
    },
    skip: !id || !pathname.includes('contacts'),
    notifyOnNetworkStatusChange: false,
  });

  const contact = React.useMemo(
    () => getContactData?.getContact,
    [getContactData]
  );
  React.useEffect(() => {
    if (contact) {
      handleContactSelection(cloneContactWithSearchName(contact));
    }
  }, [contact]);

  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(
    null
  );

  const handleContactSelection = React.useCallback(
    (contact: Contact | null) => {
      if (contact) {
        setSelectedContact(cloneContactWithSearchName(contact));
        navigate(`/contacts/${contact?.id ?? ''}`);
      } else {
        setSelectedContact(null);
        navigate(`/contacts`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    selectedContact,
    loadingContact: loading,
    setSelectedContact: handleContactSelection,
    detailView: !!id,
  };
};
