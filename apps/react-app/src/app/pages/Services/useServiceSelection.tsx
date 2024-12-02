import { getService, Service } from '@admiin-com/ds-graphql';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

export const useServiceSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: getServiceData, loading } = useQuery(gql(getService), {
    variables: {
      id,
    },
    skip: !id,
    notifyOnNetworkStatusChange: false,
  });

  const service = React.useMemo(
    () => getServiceData?.getService,
    [getServiceData]
  );
  React.useEffect(() => {
    if (service) {
      handleServiceSelection(service);
    }
  }, [service]);

  const [selectedService, setSelectedService] = React.useState<Service | null>(
    null
  );

  const handleServiceSelection = React.useCallback(
    (newItem: Service | null) => {
      if (newItem) {
        setSelectedService(newItem);
        navigate(`/services/${newItem?.id ?? ''}`);
      } else {
        setSelectedService(null);
        navigate(`/services`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return {
    selected: selectedService,
    loading: loading,
    setSelected: handleServiceSelection,
    detailView: !!id,
  };
};
