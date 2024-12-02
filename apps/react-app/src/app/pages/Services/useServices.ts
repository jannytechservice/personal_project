import { gql, useQuery } from '@apollo/client';
import {
  Service,
  ServiceStatus,
  servicesByEntity,
} from '@admiin-com/ds-graphql';
import { useMemo } from 'react';
import { CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID } from '@admiin-com/ds-graphql';
import { mergeUniqueItems } from '@admiin-com/ds-common';

interface useServicesProps {
  searchName?: string;
}

export const useServices = ({ searchName = '' }: useServicesProps) => {
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const entityId = selectedEntityIdData?.selectedEntityId;

  const handleLoadMore = () => {
    const currentToken = servicesData?.servicesByEntity?.nextToken;

    if (currentToken) {
      fetchMore({
        variables: {
          nextToken: currentToken,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          return {
            ...fetchMoreResult,
            servicesByEntity: {
              ...fetchMoreResult.servicesByEntity,

              items: mergeUniqueItems(
                prevResult.servicesByEntity?.items ?? [],
                fetchMoreResult.servicesByEntity?.items ?? [],
                ['id'] // Assuming 'id' is the unique key
              ),
              nextToken: fetchMoreResult.servicesByEntity.nextToken, // Ensure the new token is updated
            },
          };
        },
      });
    }
  };

  const {
    data: servicesData,
    fetchMore,
    error: searchContactsError,
    loading,
  } = useQuery(gql(servicesByEntity), {
    variables: {
      entityId,
      filter: {
        searchName: {
          contains: searchName,
        },
        status: { eq: ServiceStatus.ACTIVE },
      },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const services: Service[] = useMemo(
    () =>
      servicesData?.servicesByEntity?.items?.filter(
        (service: Service) => service.status !== ServiceStatus.ARCHIVED
      ) || [],
    [servicesData]
  );

  const hasNextPage = servicesData?.servicesByEntity?.nextToken != null;
  return {
    services,
    error: searchContactsError,
    handleLoadMore, // Use this function to load more items
    loading,
    hasNextPage,
  };
};
