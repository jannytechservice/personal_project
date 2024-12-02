import {
  ContactStatus,
  updateService as UPDATE_SERVICE,
  ServiceStatus,
  Service,
} from '@admiin-com/ds-graphql';
import { useSnackbar, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import ServiceDetail from './ServiceDetail';
import { usePageContext } from '../Services';
import ConfirmationDlg from '../../components/ConfirmationDlg/ConfirmationDlg';
import CreateServiceModal from '../ServiceCreateModal';

export function ServiceDetailContainer() {
  const { t } = useTranslation();

  const { selected: service, loading } = usePageContext();
  const navigate = useNavigate();
  const [updateService, { loading: updating }] = useMutation(
    gql(UPDATE_SERVICE)
  );

  const showSnackbar = useSnackbar();
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState(false);
  const handleArchive = async () => {
    if (service) {
      try {
        await updateService({
          variables: {
            input: {
              id: service.id,
              status: ContactStatus.ARCHIVED,
            },
          },

          update: (cache, { data: { updateContact } }) => {
            cache.modify({
              id: cache.identify({ ...updateContact }),
              fields: {
                status() {
                  return ServiceStatus.ARCHIVED;
                },
              },
            });
          },
        });
        navigate(`/services`);
        showSnackbar({
          message: t('servicesArchived', { ns: 'services' }),
          severity: 'success',
          horizontal: 'center',
          vertical: 'bottom',
        });
      } catch (error: any) {
        showSnackbar({
          title: t('servicesArchivedFailed', { ns: 'services' }),
          message: error?.message,
          severity: 'error',
          horizontal: 'center',
          vertical: 'bottom',
        });
      }
    }
  };
  const [createModalOpen, setCreateModalOpen] = React.useState<boolean>(false);
  const [editingService, setEditingService] = React.useState<Service | null>(
    null
  );
  return (
    <>
      <ServiceDetail
        loading={loading}
        handleArchive={() => setConfirmationModalOpen(true)}
        service={service}
        onEdit={() => {
          setCreateModalOpen(true);
          setEditingService(service);
        }}
      />
      <CreateServiceModal
        open={createModalOpen}
        service={editingService}
        onClose={() => setCreateModalOpen(false)}
      />
      <ConfirmationDlg
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        title={t('archiveService', { ns: 'services' })}
        onOK={handleArchive}
        loading={updating}
      >
        <WBTypography variant="body1" mt={1}>
          {t('archiveServiceDescription', { ns: 'services' })}
        </WBTypography>
      </ConfirmationDlg>
    </>
  );
}

export default ServiceDetailContainer;
