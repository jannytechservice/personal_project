import { gql, useLazyQuery, useQuery } from '@apollo/client';
import {
  Entity,
  EntityUser,
  EntityUserRole,
  entityUsersByUser as LIST_ENTITY_USERS_BY_USER,
} from '@admiin-com/ds-graphql';
import React, { useLayoutEffect, useMemo } from 'react';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { useCurrentEntityId } from '../useSelectedEntity/useSelectedEntity';
import { mergeUniqueItems } from '@admiin-com/ds-common';

interface UseEntitiesProps {
  onlyAccountant?: boolean;
  searchName?: string;
  notAccountant?: boolean;
}

interface UserEntitiesReturn {
  userEntities: Entity[];
  users: EntityUser[];
  error: Error | undefined;
  hasNextPage: boolean;
  handleLoadMore: () => void;
  loading: boolean;
}
export const useClients = (props?: UseEntitiesProps): UserEntitiesReturn => {
  const { searchName } = props ?? {};
  const { data: subData } = useQuery(gql(GET_SUB));
  const sub = subData?.sub;

  const [
    listEntityUsers,
    { data: entityUsersData, fetchMore, error: listEntitiesError, loading },
  ] = useLazyQuery(gql(LIST_ENTITY_USERS_BY_USER), {
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'network-only', // Used for subsequent executions
    fetchPolicy: 'cache-first', // Used for first execution
  });
  const hasNextPage = entityUsersData?.entityUsersByUser?.nextToken != null;

  const handleLoadMore = React.useCallback(() => {
    const nextToken = entityUsersData?.entityUsersByUser?.nextToken;
    if (nextToken) {
      fetchMore({
        variables: {
          limit: 50,
          nextToken: nextToken,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          return {
            ...fetchMoreResult,
            entityUsersByUser: {
              ...fetchMoreResult.entityUsersByUser,
              items: mergeUniqueItems(
                prevResult.entityUsersByUser?.items ?? [],
                fetchMoreResult.entityUsersByUser?.items ?? [],
                ['id', 'entityId'] // Assuming 'id' is the unique key
              ),
              nextToken: fetchMoreResult.entityUsersByUser.nextToken, // Ensure the new token is updated
            },
          };
        },
      });
    }
  }, [entityUsersData]);

  const users = useMemo(() => {
    return entityUsersData?.entityUsersByUser?.items;
  }, [entityUsersData]);

  const userEntities = useMemo(() => {
    return (
      users
        ?.map((users: EntityUser) => users.entity)
        .filter((entity: Entity) => entity !== null) || []
    );
  }, [users]);
  const limit = 50;

  useLayoutEffect(() => {
    const listEntities = async () => {
      try {
        await listEntityUsers({
          variables: {
            limit: limit,
            filter: {
              role: {
                eq: 'ACCOUNTANT',
              },
              ...(searchName
                ? {
                    or: [
                      {
                        entitySearchName: {
                          contains: searchName.toLowerCase(),
                        },
                      },
                      {
                        searchName: {
                          contains: searchName.toLowerCase(),
                        },
                      },
                    ],
                  }
                : {}),
            },
          },
        });
      } catch (err) {
        console.log('ERROR listing entities: ', err);
      }
    };
    if (sub?.sub) listEntities();
  }, [searchName, sub]);

  React.useEffect(() => {
    if (
      hasNextPage &&
      handleLoadMore &&
      entityUsersData?.length === 0 &&
      !loading
    ) {
      handleLoadMore();
    }
  }, [hasNextPage, loading, entityUsersData]);
  return {
    userEntities,
    users,
    handleLoadMore,
    error: listEntitiesError,
    hasNextPage,
    loading,
  };
};
