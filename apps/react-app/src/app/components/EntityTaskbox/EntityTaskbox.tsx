import styled from '@emotion/styled';
import { Outlet, useParams } from 'react-router-dom';

import { selectedEntityIdInVar } from '@admiin-com/ds-graphql';
import React from 'react';
/* eslint-disable-next-line */
export interface EntityTaskboxProps {}
export function EntityTaskbox(props: EntityTaskboxProps) {
  const { entityId } = useParams();

  React.useEffect(() => {
    if (entityId) localStorage.setItem('selectedEntityId', entityId);

    selectedEntityIdInVar(entityId);
  }, [entityId]);
  return <Outlet />;
}

export default EntityTaskbox;
