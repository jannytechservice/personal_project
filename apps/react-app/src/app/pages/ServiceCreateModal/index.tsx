import { useSnackbar, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import {
  CreateServiceInput,
  createService as CREATE_SERVICE,
  updateService as UPDATE_SERVICE,
  Service,
} from '@admiin-com/ds-graphql';

import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import SimpleDrawDlg, {
  SimpleDrawDlgProps,
} from '../../components/SimpleDrawDlg/SimpleDrawDlg';
import ServiceCreateForm from './ServiceCreateForm';

/* eslint-disable-next-line */
export interface CreateServiceModalProps
  extends Omit<SimpleDrawDlgProps, 'children' | 'handleClose'> {
  open: boolean;
  onClose: () => void;
  service?: Service | null;
  onSuccess?: (service: Service) => void;
}

type CreateServerInputForm = Omit<CreateServiceInput, 'entityId' | 'fee'>;
export function CreateServiceModal(props: CreateServiceModalProps) {
  const { t } = useTranslation();

  const entityId = useCurrentEntityId();

  const [createService, { loading: creating }] = useMutation(
    gql(CREATE_SERVICE),
    {
      update(cache, { data }) {
        cache.modify({
          fields: {
            servicesByEntity(existingServices = { items: [] }) {
              const newServiceRef = cache.writeFragment({
                data: data.createService,
                fragment: gql`
                  fragment NewService on Service {
                    id
                    entityId
                    description
                    amount
                    feeType
                    taxType
                    createdAt
                    updatedAt
                  }
                `,
              });
              return {
                ...existingServices,
                items: existingServices.items.concat(newServiceRef),
              };
            },
          },
        });
      },
    }
  );

  const [updateService, { loading: updating }] = useMutation(
    gql(UPDATE_SERVICE)
  );
  const [error, setError] = React.useState<Error | null>(null);
  const handleCreateService = async (data: CreateServerInputForm) => {
    const newAmount = Math.round(Number(data.amount) * 100);
    const createdServiceData = await createService({
      variables: {
        input: {
          entityId: entityId,
          title: data.title,
          description: data.description,
          amount: newAmount,
          feeType: data.feeType,
          taxType: data.taxType,
        },
      },
    });
    setError(null);
    if (props.onSuccess) props.onSuccess(createdServiceData.data.createService);
  };

  const handleUpdateService = async (data: CreateServerInputForm) => {
    const newAmount = Math.round(Number(data.amount) * 100);
    await updateService({
      variables: {
        input: {
          id: props.service?.id,
          title: data.title,
          description: data.description,
          amount: newAmount,
          feeType: data.feeType,
          taxType: data.taxType,
        },
      },
    });
    setError(null);
  };

  const onSubmit = async (data: CreateServerInputForm) => {
    try {
      if (props.service) {
        await handleUpdateService(data);
      } else await handleCreateService(data);
      props.onClose();
    } catch (error: any) {
      setError(error);
    }
  };

  return (
    <SimpleDrawDlg
      defaultZIndex
      {...props}
      open={props.open}
      handleClose={props.onClose}
      maxWidth="sm"
    >
      <WBTypography variant="h3" fontWeight={'bold'}>
        {t('addServiceTitle', { ns: 'services' })}
      </WBTypography>
      <ServiceCreateForm
        loading={creating || updating}
        entityId={entityId}
        createService={onSubmit}
        defaultService={props.service}
      />
      <ErrorHandler errorMessage={error?.message} />
    </SimpleDrawDlg>
  );
}

export default CreateServiceModal;
