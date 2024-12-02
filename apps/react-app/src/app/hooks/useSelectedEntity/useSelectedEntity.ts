import {
  selectedEntityIdInVar,
  getEntity as GET_ENTITY,
  PaymentMethod,
  PaymentMethodType,
  Entity,
  TaskDirection,
} from '@admiin-com/ds-graphql';

import { gql, useApolloClient, useQuery, NetworkStatus } from '@apollo/client';
import { CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID } from '@admiin-com/ds-graphql';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { cloneDeep } from 'lodash';

export const useSelectedEntity = () => {
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const entityId = selectedEntityIdData?.selectedEntityId;

  const { data, loading, networkStatus } = useQuery(gql(GET_ENTITY), {
    variables: { id: entityId },
    skip: !entityId,
    notifyOnNetworkStatusChange: true, // This is important to notify when network status changes
  });

  const entity: Entity | undefined = React.useMemo(
    () => data?.getEntity,
    [data]
  );

  // const updatedEntity = React.useMemo(() => {
  //   if (entity) {
  //     const updatedEntity = cloneDeep(entity);
  //     const paymentMethods = updatedEntity.paymentMethods?.items ?? [];

  //     // Sort paymentMethods by a certain condition
  //     paymentMethods.sort(
  //       (
  //         a: PaymentMethod | undefined | null,
  //         b: PaymentMethod | undefined | null
  //       ) => {
  //         // Replace 'order' with your condition for sorting

  //         if (!a || !b) return 0;
  //         if (
  //           a?.paymentMethodType !== PaymentMethodType.CARD ||
  //           b?.paymentMethodType !== PaymentMethodType.CARD
  //         )
  //           return 0;
  //         if (a.id === entity.paymentMethodId) return -1;
  //         else if (b.id === entity.paymentMethodId) return 1;
  //         return 0;
  //       }
  //     );
  //     return updatedEntity;
  //   } else return entity;
  // }, [entity]);

  // const resultEntity = React.useMemo(() => {
  //   // Return updatedEntity if data is fetched from the network, otherwise return entity
  //   if (networkStatus === NetworkStatus.ready) {
  //     return entity;
  //   }
  //   return entity;
  // }, [networkStatus, entity]);

  return { entity, loading };
};

export const useCurrentEntityId = () => {
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const entityId = selectedEntityIdData?.selectedEntityId;

  return entityId;
};

export const useGotoTaskBox = () => {
  const apolloClient = useApolloClient();
  const navigate = useNavigate();
  const gotoTaskBox = React.useCallback(
    (id: string, direction: TaskDirection = TaskDirection.RECEIVING) => {
      selectedEntityIdInVar(id);
      apolloClient.cache.evict({ fieldName: 'selectedEntityId' });
      apolloClient.cache.gc();
      localStorage.setItem('selectedEntityId', id);
      navigate(`/taskbox?direction=${direction}`);
    },
    []
  );
  return gotoTaskBox;
};
