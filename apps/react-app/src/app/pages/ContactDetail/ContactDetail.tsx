import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import {
  Contact,
  ContactStatus,
  updateContact as UPDATE_CONTACT,
  tasksByEntityByIdContactId as TASKS_BY_ENTITY_BY_CONTACT_ID,
  Task,
  TaskStatus,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBFlex,
  WBIconButton,
  WBMenu,
  WBMenuItem,
  WBSkeleton,
  WBStack,
  WBSvgIcon,
  WBTypography,
  useSnackbar,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import DotIcon from '../../../assets/icons/tripledot.svg';
import { useTheme } from '@mui/material';
import { ContactsCreateForm } from './ContactsCreateForm';
import React from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';
import ContactFiles from '../../components/ContactFiles/ContactFiles';
import { useNavigate } from 'react-router-dom';
import { useContactsContext } from '../Contacts/Contacts';
import ConfirmationDlg from '../../components/ConfirmationDlg/ConfirmationDlg';

export const cloneContactWithSearchName = (contact: Contact) => ({
  ...contact,
  searchName: `${
    contact.companyName || `${contact.firstName} ${contact.lastName}`
  }`,
});
export function ContactDetail() {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    selectedContact: contact,
    isCreateFormView,
    setSelectedContact: setContact,
  } = useContactsContext();

  // React.useEffect(() => {
  //   if (selectedContact) {
  //     setContact(cloneContactWithSearchName(selectedContact));
  //   } else setContact(null);
  // }, [selectedContact]);

  const entityId = useCurrentEntityId();
  const [filesType, setFilesType] = React.useState<'Outstanding' | 'Complete'>(
    'Outstanding'
  );

  const [tasksByEntityByIdContactId, { data, error }] = useLazyQuery(
    gql(TASKS_BY_ENTITY_BY_CONTACT_ID)
  );
  React.useLayoutEffect(() => {
    if (entityId && contact?.id) {
      tasksByEntityByIdContactId({
        variables: {
          entityIdBy: entityId,
          contactId: contact.id,
        },
      });
    }
  }, [filesType, contact?.id, entityId]);

  const navigate = useNavigate();

  const tasks = React.useMemo(() => {
    if (data?.tasksByEntityByIdContactId?.items) {
      return data?.tasksByEntityByIdContactId?.items;
    } else {
      return [null, null];
    }
  }, [data]);

  const totalReceivable = tasks?.reduce(
    (amount: number, task: Task) =>
      amount +
      ((task?.status === TaskStatus.INCOMPLETE ? task?.amount : 0) || 0),
    0
  );
  const totalPayable = tasks?.reduce(
    (amount: number, task: Task) =>
      amount +
      ((task?.status === TaskStatus.COMPLETED ? task?.amount : 0) || 0),
    0
  );
  const filteredTasks = React.useMemo(() => {
    if (filesType === 'Outstanding') {
      return tasks?.filter(
        (task: Task | null) =>
          task === null || task?.status === TaskStatus.INCOMPLETE
      );
    } else {
      return tasks?.filter(
        (task: Task | null) =>
          task === null || task?.status === TaskStatus.COMPLETED
      );
    }
  }, [filesType, tasks]);

  const handleFormSubmitted = (updatedContact: Contact) => {
    if (!contact) {
      navigate(`/contacts/${updatedContact.id}`);
      // onCreated && onCreated(updatedContact);
    } else {
      console.log('updatedContact', updatedContact);
      setContact(cloneContactWithSearchName(updatedContact));
    }
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [updateContact, { loading: archiving }] = useMutation(
    gql(UPDATE_CONTACT)
  );

  const showSnackbar = useSnackbar();
  const handleArchiveContact = async () => {
    handleMenuClose();
    if (contact) {
      try {
        await updateContact({
          variables: {
            input: {
              id: contact.id,
              entityId,
              status: ContactStatus.ARCHIVED,
            },
          },

          update: (cache, { data: { updateContact } }) => {
            cache.modify({
              id: cache.identify({ ...updateContact }),
              fields: {
                status(oldValue) {
                  return ContactStatus.ARCHIVED;
                },
              },
            });
          },
        });
        navigate(`/contacts`);
        // onCreated && onCreated(null);
        showSnackbar({
          message: t('contactArchived', { ns: 'contacts' }),
          severity: 'success',
          horizontal: 'center',
          vertical: 'bottom',
        });
      } catch (error: any) {
        showSnackbar({
          title: t('contactArchivedFailed', { ns: 'contacts' }),
          message: error?.message,
          severity: 'error',
          horizontal: 'center',
          vertical: 'bottom',
        });
      }
    }
  };

  return (
    <WBFlex
      flexDirection="column"
      justifyContent={'start'}
      mt={2}
      maxWidth="100%"
    >
      {!isCreateFormView ? (
        <>
          <WBFlex justifyContent={'space-between'}>
            <WBFlex alignItems={'center'}>
              {contact ? (
                <WBS3Avatar
                  sx={{
                    borderRadius: '3px',
                    minWidth: 56,
                    height: 56,
                  }}
                  companyName={contact.searchName ?? ''}
                  fontSize="h6.fontSize"
                />
              ) : (
                <WBSkeleton
                  variant="rectangular"
                  animation={'wave'}
                  width={56}
                  height={56}
                />
              )}
              {contact ? (
                <WBTypography
                  variant="h2"
                  mb={0}
                  ml={2}
                  component="div"
                  fontSize={{ xs: 'h3.fontSize', md: 'h2.fontSize' }}
                  color="dark"
                >
                  {contact.searchName ?? ''}
                </WBTypography>
              ) : (
                <WBSkeleton
                  sx={{ borderRadius: '10px', ml: 2 }}
                  width={100}
                  animation={'wave'}
                  height={50}
                ></WBSkeleton>
              )}
            </WBFlex>
            {contact && (
              <WBFlex
                alignItems={'center'}
                sx={{ mt: { xs: -20, lg: 0 }, ml: { xs: -6, lg: 0 } }}
              >
                <WBIconButton onClick={handleOpenMenu}>
                  <WBSvgIcon fontSize="small">
                    <DotIcon />
                  </WBSvgIcon>
                </WBIconButton>
              </WBFlex>
            )}
          </WBFlex>
          <WBBox mt={{ md: 7, xs: 4 }}>
            {contact ? (
              <WBStack direction={'row'} spacing={3}>
                <WBBox>
                  <WBTypography variant="h5">
                    {t('totalReceivable', { ns: 'contacts' })}
                  </WBTypography>
                  <CurrencyNumber
                    color="primary"
                    // fontFamily="Nexa"
                    number={totalReceivable / 100}
                    sup={false}
                  />
                </WBBox>
                <WBBox>
                  <WBTypography variant="h5">
                    {t('totalPayable', { ns: 'contacts' })}
                  </WBTypography>

                  <CurrencyNumber
                    color="primary"
                    // fontFamily="Nexa"
                    number={totalPayable / 100}
                    sup={false}
                  />
                </WBBox>
              </WBStack>
            ) : (
              <WBSkeleton variant="rectangular" width="100%" height="500px" />
            )}
          </WBBox>

          {contact ? (
            <ContactFiles
              tasks={filteredTasks}
              hasTasks={tasks?.length > 0}
              contact={contact}
              filesType={filesType}
              setFilesType={setFilesType}
            />
          ) : null}
          <WBMenu
            sx={{ mt: -2 }}
            id="customized-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <WBMenuItem
              onClick={() => setConfirmDialogOpen(true)}
              sx={{
                ...theme.typography.body2,
                fontWeight: 'bold',
                color: 'error.main',
              }}
            >
              {t('archiveContact', { ns: 'contacts' })}
            </WBMenuItem>
          </WBMenu>
        </>
      ) : null}
      <ContactsCreateForm
        key={contact?.id}
        selected={contact}
        onSubmitted={handleFormSubmitted}
      />

      <ConfirmationDlg
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        title={t('archiveContact', { ns: 'contacts' })}
        onOK={handleArchiveContact}
        loading={archiving}
      >
        <WBTypography variant="body1" mt={1}>
          {t('archiveContactConfirmation', { ns: 'contacts' })}
        </WBTypography>
      </ConfirmationDlg>
    </WBFlex>
  );
}

export default ContactDetail;
