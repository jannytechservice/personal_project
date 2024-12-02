import {
  CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID,
  EntityUser,
  Entity,
  Contact,
  AutocompleteResult,
  ContactStatus,
  AutocompleteType,
  servicesByEntity as SERVICES_BY_ENTITY,
  ServiceStatus,
} from '@admiin-com/ds-graphql';

import {
  autocompleteResultsByType as AUTOCOMPLETE_RESULTS_BY_TYPE,
  contactsByEntity as CONTACTS_BY_ENTITY,
  entityUsersByEntityId as LIST_ENTITY_USERS_BY_ENTITY,
  entityUsersByUser as LIST_ENTITIES_BY_USER,
} from '@admiin-com/ds-graphql';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React from 'react';
import { AutoCompleteDataType } from './AutoCompleteLookup';
import { useUserId } from '../../hooks/useCurrentUser/useCurrentUser';

export const GET_SIGNERS = `
  query GetSigner(
  $entityId: ID!
  $sortDirectionContact: ModelSortDirection
  $sortDirectionEntityUser: ModelSortDirection
  $searchName: String
  $from: Int
  $filterEntityUser: ModelEntityUserFilterInput
  $nextToken: String
) {
  contactsByEntity(
    entityId: $entityId
    searchName: $searchName
    sortDirection: $sortDirectionContact
    from: $from
  ) {
    items {
      id
      entityId
      firstName
      lastName
      email
      phone
      companyName
      searchName
      status
      createdAt
      updatedAt
      contactType
      owner
    }
    total
  }
  entityUsersByEntityId(
    entityId: $entityId
    sortDirection: $sortDirectionEntityUser
    filter: $filterEntityUser
    limit: 10
    nextToken: $nextToken
  ) {
    items {
      id
      entityId
      userId
      invitedEmail
      referredBy
      invitedEntityId
      firmEntityId
      firstName
      lastName
      role
      paymentsEnabled
      entitySearchName
    }
    nextToken
  }
}
`;

export const GET_CONTACTS_AND_VERIFIED_ENTITY = /* GraphQL */ `
  query GetContactsAndVerifiedEntity(
    $entityId: ID!
    $type: AutocompleteType!
    $searchName: String!
    $sortDirectionContact: ModelSortDirection
    $sortDirectionAutoComplete: ModelSortDirection
    $filterAutoComplete: ModelEntityFilterInput
    $limitAutoComplete: Int
    $nextToken: String
  ) {
    contactsByEntity(
      entityId: $entityId
      searchName: $searchName
      sortDirection: $sortDirectionContact
    ) {
      items {
        id
        entityId
        firstName
        lastName
        email
        phone
        companyName
        searchName
        status
        createdAt
        updatedAt
        contactType
        owner
      }
      total
    }
    autocompleteResultsByType(
      type: $type
      searchName: $searchName
      sortDirection: $sortDirectionAutoComplete
      filter: $filterAutoComplete
      limit: $limitAutoComplete
      nextToken: $nextToken
    ) {
      items {
        id
        value
        label
        info
        type
        searchName
        metadata {
          subCategory
          payoutMethod
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

interface useLookupServiceProps {
  type: AutoCompleteDataType;
  entityId?: string;
}
export const useLookupService = ({
  type,
  entityId: entityIdProp,
}: useLookupServiceProps) => {
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const currentEntityId = selectedEntityIdData?.selectedEntityId;

  const entityId = entityIdProp ?? currentEntityId;

  const [getContacts, { loading: loadingContacts }] = useLazyQuery(
    gql(CONTACTS_BY_ENTITY)
  );
  const [getEntityUsers, { loading: loadingEntityUsers }] = useLazyQuery(
    gql(LIST_ENTITY_USERS_BY_ENTITY)
  );
  const [getEntities, { loading: loadingEntities }] = useLazyQuery(
    gql(LIST_ENTITIES_BY_USER)
  );

  const [servicesByEntity, { loading: loadingServices }] = useLazyQuery(
    gql(SERVICES_BY_ENTITY)
  );

  const [getSigners, { loading: loadingSigner }] = useLazyQuery(
    gql(GET_SIGNERS)
  );

  const userId = useUserId();
  // TODO: Add label for each item

  const [
    getContactsAndVerifiedEntity,
    { loading: loadingContactsAndVerifiedEntity },
  ] = useLazyQuery(gql(GET_CONTACTS_AND_VERIFIED_ENTITY));

  const [getAutocompleteResults, { loading: loadingAutocompleteResults }] =
    useLazyQuery(gql(AUTOCOMPLETE_RESULTS_BY_TYPE));

  const searchContactsAndVerifiedEntities = React.useCallback(
    async (value: string) => {
      const data = await getContactsAndVerifiedEntity({
        variables: {
          entityId,
          type: AutocompleteType.ENTITY,
          searchName: value.toLowerCase(),
        },
      });
      return [
        ...(
          data?.data?.contactsByEntity?.items?.filter(
            (contact: Contact) => contact.status !== ContactStatus.ARCHIVED
          ) ?? []
        )
          .map((item: Contact) => ({
            ...item,
            searchType: 'Contacts',
          }))
          .slice(0, 5),
        ...(data?.data?.autocompleteResultsByType?.items ?? []).map(
          (item: AutocompleteResult) => ({
            ...item,
            searchType: 'AutoCompleteResults',
          })
        ),
      ];
    },
    [entityId, getContactsAndVerifiedEntity]
  );
  const searchSigners = React.useCallback(async (value: string) => {
    const data = await getSigners({
      variables: {
        entityId,
        searchName: value,
        filterEntityUser: {
          searchName: {
            contains: value?.toLowerCase() ?? '',
          },
        },
      },
    });

    return [
      ...(
        data?.data?.contactsByEntity?.items?.filter(
          (contact: Contact) => contact.status !== ContactStatus.ARCHIVED
        ) ?? []
      )
        .map((item: Contact) => ({
          ...item,
          searchType: 'CONTACT',
          name: `${item.firstName} ${item.lastName}`,
        }))
        .slice(0, 3),
      ...(data?.data?.entityUsersByEntityId?.items ?? [])
        .map((item: EntityUser) => ({
          ...item,
          searchType: 'ENTITY_USER',
          email: item.invitedEmail,
          name: `${item.firstName} ${item.lastName}`,
        }))
        .filter((item: EntityUser) => item.userId !== userId)
        .slice(0, 3),
    ];
  }, []);

  const searchContacts = React.useCallback(
    async (value: string) => {
      const data = await getContacts({
        variables: {
          entityId,
          searchName: value,
          //filter: {
          //  searchName: {
          //    contains: value.toLowerCase(),
          //  },
          //  status: {
          //    eq: ContactStatus.ACTIVE,
          //  },
          //},
        },
      });
      return (
        data?.data?.contactsByEntity?.items
          ?.filter(
            (contact: Contact) => contact.status !== ContactStatus.ARCHIVED
          )
          .slice(0, 5) ?? []
      );
    },
    [entityId, getContacts]
  );

  const searchEntityUsers = React.useCallback(
    async (value: string) => {
      const data = await getEntityUsers({
        variables: {
          entityId,
          filter: {
            searchName: {
              contains: value.toLowerCase(),
            },
          },
        },
      });
      return data?.data?.entityUsersByEntityId?.items ?? [];
    },
    [entityId, getEntityUsers]
  );

  const searchServices = React.useCallback(
    async (value: string) => {
      const data = await servicesByEntity({
        variables: {
          entityId,
          filter: {
            searchName: {
              contains: value?.toLowerCase(),
            },
            status: {
              eq: ServiceStatus.ACTIVE,
            },
          },
        },
      });
      return data?.data?.servicesByEntity?.items ?? [];
    },
    [entityId, servicesByEntity]
  );

  const searchEntities = React.useCallback(
    async (value: string) => {
      const data = await getEntities({
        variables: {
          limit: 50,
          filter: {
            entitySearchName: {
              contains: value.toLowerCase(),
            },
          },
        },
      });
      return (
        data?.data?.entityUsersByUser?.items
          ?.map((entityUser: EntityUser) => entityUser.entity)
          .filter((entity: Entity) => entity !== null) || []
      );
    },
    [getEntities]
  );

  const searchAutocompleteResults = React.useCallback(
    async (value: string) => {
      const data = await getAutocompleteResults({
        variables: {
          type: AutocompleteType.ENTITY,
          searchName: value.toLowerCase(),
        },
      });
      return data?.data?.autocompleteResultsByType?.items ?? [];
    },
    [getAutocompleteResults]
  );

  if (type === 'Contact') {
    return { lookup: searchContacts, loading: loadingContacts };
  }
  if (type === 'ContactsAndVerifiedEntity') {
    return {
      lookup: searchContactsAndVerifiedEntities,
      loading: loadingContactsAndVerifiedEntity,
    };
  } else if (type === 'Entity') {
    return { lookup: searchEntities, loading: loadingEntities };
  } else if (type === 'EntityUser') {
    return { lookup: searchEntityUsers, loading: loadingEntityUsers };
  } else if (type === 'AutocompleteResults') {
    return {
      lookup: searchAutocompleteResults,
      loading: loadingAutocompleteResults,
    };
  } else if (type === 'Service') {
    return {
      lookup: searchServices,
      loading: loadingServices,
    };
  } else if (type === 'Signer') {
    return {
      lookup: searchSigners,
      loading: loadingSigner,
    };
  }
  return { lookup: undefined, loading: false };
};
