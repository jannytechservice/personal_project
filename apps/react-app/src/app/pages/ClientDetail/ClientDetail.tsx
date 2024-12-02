import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import {
  Contact,
  tasksByEntityFrom as TASKS_BY_ENTITY_BY_FROM,
  tasksByEntityTo as TASKS_BY_ENTITY_BY_To,
  TaskSearchStatus,
  TaskDirection,
  Task,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBButton,
  WBFlex,
  WBIconButton,
  WBMenu,
  WBMenuItem,
  WBStack,
  WBSvgIcon,
  WBTypography,
  useSnackbar,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import DotIcon from '../../../assets/icons/tripledot.svg';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';
import { useTheme } from '@mui/material';
import { ClientsCreateForm } from './ClientsCreateForm';
import React, { useEffect } from 'react';
import ClientFiles from '../../components/ClientFiles/ClientFiles';
import { gql, useMutation, useQuery } from '@apollo/client';
import { deleteEntityUser as DELETE_ENTITY_USER } from '@admiin-com/ds-graphql';
import { useNavigate } from 'react-router-dom';
export interface ClientDetailProps {
  contact: Contact | null;
  onCreated?: (contact: Contact | null) => void;
}
export const cloneContactWithSearchName = (contact: Contact) => ({
  ...contact,
  searchName: `${
    contact.companyName || `${contact.firstName} ${contact.lastName}`
  }`,
});
export function ClientDetail({
  contact: selectedContact,
  onCreated,
}: ClientDetailProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();

  const [contact, setContact] = React.useState<Contact | null>();
  useEffect(() => {
    setContact(
      selectedContact ? cloneContactWithSearchName(selectedContact) : null
    );
  }, [selectedContact]);

  const [deleteEntityUser] = useMutation(gql(DELETE_ENTITY_USER), {
    update(cache, { data: { deleteEntityUser } }) {
      cache.modify({
        fields: {
          entityUsersByUser(existingEntityUsers = []) {
            console.log(existingEntityUsers);
            return {
              items: [
                existingEntityUsers.items.filter(
                  (item: any) => item?.id !== (deleteEntityUser as any)?.id
                ),
              ],
            };
          },
        },
      });
    },
  });
  const [filesType, setFilesType] = React.useState<'Outstanding' | 'Complete'>(
    'Outstanding'
  );

  const { data: tasksToData, loading: loadingTo } = useQuery(
    gql(TASKS_BY_ENTITY_BY_To),
    {
      variables: {
        entityId: contact?.entityId,
        status:
          filesType === 'Outstanding'
            ? TaskSearchStatus.INCOMPLETE
            : TaskSearchStatus.COMPLETED,
        limit: 20,
      },
      skip: !contact?.entityId,
      fetchPolicy: 'cache-and-network',
    }
  );

  const { data: tasksFromData, loading: LoadingFrom } = useQuery(
    gql(TASKS_BY_ENTITY_BY_FROM),
    {
      variables: {
        entityId: contact?.entityId,
        status:
          filesType === 'Outstanding'
            ? TaskSearchStatus.INCOMPLETE
            : TaskSearchStatus.COMPLETED,
        limit: 20,
      },
      fetchPolicy: 'cache-and-network',
      skip: !contact?.entityId,
    }
  );
  const tasksTo =
    tasksToData?.tasksByEntityTo?.items ?? (loadingTo ? [null] : []);
  const tasksFrom =
    tasksFromData?.tasksByEntityFrom?.items ?? (LoadingFrom ? [null] : []);

  const { data: tasksToCompletedData, loading: loadingToCompleted } = useQuery(
    gql(TASKS_BY_ENTITY_BY_To),
    {
      variables: {
        entityId: contact?.entityId,
        status:
          filesType === 'Outstanding'
            ? TaskSearchStatus.INCOMPLETE
            : TaskSearchStatus.COMPLETED,
        limit: 20,
      },
      skip: !contact?.entityId,
      fetchPolicy: 'cache-and-network',
    }
  );

  const { data: tasksFromCompletedData, loading: LoadingFromCompleted } =
    useQuery(gql(TASKS_BY_ENTITY_BY_FROM), {
      variables: {
        entityId: contact?.entityId,
        status:
          filesType === 'Outstanding'
            ? TaskSearchStatus.INCOMPLETE
            : TaskSearchStatus.COMPLETED,
        limit: 20,
      },
      fetchPolicy: 'cache-and-network',
      skip: !contact?.entityId,
    });
  const tasksToCompleted =
    tasksToCompletedData?.tasksByEntityTo?.items ?? (loadingTo ? [null] : []);
  const tasksFromCompleted =
    tasksFromData?.tasksByEntityFrom?.items ?? (LoadingFrom ? [null] : []);

  const tasks = [...tasksTo, ...tasksFrom];
  const totalReceivable = tasks?.reduce(
    (amount: number, task: Task) =>
      amount +
      ((task?.direction === TaskDirection.RECEIVING ? task?.amount : 0) || 0),
    0
  );
  const totalPayable = tasks?.reduce(
    (amount: number, task: Task) =>
      amount +
      ((task?.direction === TaskDirection.SENDING ? task?.amount : 0) || 0),
    0
  );

  const handleFormSubmitted = (updatedContact: Contact) => {
    if (!contact) {
      onCreated && onCreated(updatedContact);
    } else {
      setContact(null);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const showSnackbar = useSnackbar();

  const handleRemove = async () => {
    if (!contact) return;
    try {
      await deleteEntityUser({
        variables: {
          input: {
            entityId: contact.entityId,
            //@ts-ignore
            userId: contact.userId,
          },
        },
      });
      handleMenuClose();

      onCreated && onCreated(null);
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
  };

  return (
    <WBFlex
      flexDirection="column"
      justifyContent={'start'}
      mt={4}
      maxWidth="100%"
    >
      {contact ? (
        <>
          <WBFlex justifyContent={'space-between'}>
            <WBFlex alignItems={'center'}>
              <WBS3Avatar
                sx={{
                  borderRadius: '3px',
                  minWidth: 56,
                  height: 56,
                }}
                companyName={contact.searchName ?? ''}
                fontSize="h6.fontSize"
              />
              <WBTypography
                variant="h2"
                mb={0}
                ml={2}
                component="div"
                color="dark"
                fontSize={{ xs: 'h3.fontSize', md: 'h2.fontSize' }}
              >
                {contact.searchName ?? ''}
              </WBTypography>
            </WBFlex>
            <WBFlex
              alignItems={'center'}
              sx={{ mt: { xs: -9, lg: 0 }, ml: { xs: -6, lg: 0 } }}
            >
              <WBIconButton onClick={handleOpenMenu}>
                <WBSvgIcon fontSize="small">
                  <DotIcon />
                </WBSvgIcon>
              </WBIconButton>
            </WBFlex>
          </WBFlex>
          <WBStack direction={'row'} spacing={3} mt={{ md: 7, xs: 4 }}>
            <WBBox sx={{ display: 'flex', gap: '16px' }}>
              <WBBox
                sx={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate(`/${contact.entityId}/taskbox/?direction=RECEIVING`)
                }
              >
                <WBTypography variant="h5">
                  {t('RECEIVING', { ns: 'taskbox' })}
                </WBTypography>
                <CurrencyNumber
                  color={'primary'}
                  number={totalReceivable / 100}
                  sup={false}
                />
              </WBBox>
              <WBBox
                sx={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate(`/${contact.entityId}/taskbox/?direction=SENDING`)
                }
              >
                <WBTypography variant="h5">
                  {t('SENDING', { ns: 'taskbox' })}
                </WBTypography>
                <CurrencyNumber
                  color={'primary'}
                  number={totalPayable / 100}
                  sup={false}
                />
              </WBBox>
            </WBBox>
          </WBStack>

          {contact ? (
            <ClientFiles
              tasks={tasks}
              client={contact}
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
              onClick={handleRemove}
              sx={{ ...theme.typography.body2, fontWeight: 'bold' }}
            >
              {t('archiveClient', { ns: 'contacts' })}
            </WBMenuItem>
          </WBMenu>
        </>
      ) : null}
      <ClientsCreateForm selected={contact} onSubmitted={handleFormSubmitted} />
    </WBFlex>
  );
}

export default ClientDetail;
