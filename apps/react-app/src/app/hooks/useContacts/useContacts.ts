import { gql, useQuery } from '@apollo/client';
import {
  contactsByEntity as CONTACT_BY_ENTITY,
  Contact,
  ContactType,
} from '@admiin-com/ds-graphql';
import { useState, useEffect } from 'react';
import { CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID } from '@admiin-com/ds-graphql';

interface useContactsProps {
  searchName?: string;
  contactType?: ContactType;
}

export const useContacts = ({
  searchName = '',
  contactType = ContactType.NORMAL,
}: useContactsProps) => {
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const entityId = selectedEntityIdData?.selectedEntityId;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [from, setFrom] = useState(0);
  const pageSize = 20; // Define your page size

  const { data, error, loading, fetchMore } = useQuery(gql(CONTACT_BY_ENTITY), {
    variables: {
      entityId,
      searchName,
      from,
      size: pageSize,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data?.contactsByEntity?.items) {
      if (from === 0) {
        setContacts(data.contactsByEntity.items);
      } else {
        setContacts((prevContacts) => [
          ...prevContacts,
          ...data.contactsByEntity.items,
        ]);
      }
    }
  }, [data, from]);

  useEffect(() => {
    setFrom(0);
  }, [searchName]);

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        from: contacts.length,
        size: pageSize,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;
        return {
          contactsByEntity: {
            ...fetchMoreResult.contactsByEntity,
            items: [
              ...prevResult.contactsByEntity.items,
              ...fetchMoreResult.contactsByEntity.items,
            ],
          },
        };
      },
    });
    setFrom((prevFrom) => prevFrom + pageSize);
  };

  const hasNextPage = data?.contactsByEntity?.total > from + pageSize;

  return {
    contacts,
    error,
    handleLoadMore,
    loading,
    hasNextPage,
  };
};
