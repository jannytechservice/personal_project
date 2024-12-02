import {
  EntityUser,
  EntityUserRole,
  EntityUserStatus,
  updateEntityUser as UPDATE_ENTITY_USER,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBChip,
  WBFlex,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ActionDisplay from '../ActionDisplay/ActionDisplay';
import React from 'react';
import RemoveEntityUserModal from '../RemoveEntityUserModal/RemoveEntityUserModal';
import InformationIcon from 'libs/design-system-web/src/lib/components/primatives/InformationIcon/InformationIcon';
import { gql, useMutation } from '@apollo/client';
import {
  useCurrentUser,
  useUserId,
} from '../../hooks/useCurrentUser/useCurrentUser';

/* eslint-disable-next-line */
export interface EntityUserTableProps {
  users: EntityUser[];
  loading: boolean;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.default,
    fontWeight: 'bold',
    boxShadow: 'none',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.root}`]: {
    borderBottom: 0,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  borderBottom: 0,
}));

export function EntityUserTable({ users, loading }: EntityUserTableProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [updateEntityUser] = useMutation(gql(UPDATE_ENTITY_USER));

  const handlePaymentSwitchChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    user: EntityUser
  ) => {
    await updateEntityUser({
      variables: {
        input: {
          userId: user.userId,
          entityId: user.entityId,
          paymentsEnabled: e.target.checked,
        },
      },
      optimisticResponse: {
        updateEntityUser: {
          ...user,
          paymentsEnabled: e.target.checked,
        },
      },
    });
  };

  const userId = useUserId();

  const isOwner = users.some(
    (user) => user.userId === userId && user.role === 'OWNER'
  );

  const statusTitle = (user: EntityUser) =>
    user.status === 'PENDING'
      ? t('pendingInvitation', {
          ns: 'settings',
          name: user.firstName,
          email: user.invitedEmail,
        })
      : user.status === 'DECLINED'
      ? t('declinedInvitation', {
          ns: 'settings',
          name: user.firstName,
          email: user.invitedEmail,
        })
      : null;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ textAlign: 'left' }}>
              {t('firstName', { ns: 'settings' })}
            </StyledTableCell>
            <StyledTableCell>
              {t('lastName', { ns: 'settings' })}
            </StyledTableCell>
            {/*<StyledTableCell>{t('email', { ns: 'settings' })}</StyledTableCell>*/}
            <StyledTableCell>{t('role', { ns: 'settings' })}</StyledTableCell>
            <StyledTableCell>
              <WBBox sx={{ display: 'inline-flex' }}>
                {t('payments', { ns: 'settings' })}{' '}
                <InformationIcon title={t('paymentInfo', { ns: 'settings' })} />
              </WBBox>
            </StyledTableCell>
            <StyledTableCell>{t('status', { ns: 'settings' })}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ '& .MuiTableCell-root': { border: 0 } }}>
          {loading ? (
            <>
              <TableRow>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                {/*<TableCell>*/}
                {/*  <Skeleton width={'100%'} />*/}
                {/*</TableCell>*/}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                {/*<TableCell>*/}
                {/*  <Skeleton width={'100%'} />*/}
                {/*</TableCell>*/}
              </TableRow>
            </>
          ) : null}
          {users?.map((user) => (
            <StyledTableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              {/* <TableCell>{'sdaf.com'}</TableCell> */}
              <TableCell>
                <WBChip
                  label={t(user.role ?? '', { ns: 'settings' })}
                  sx={{
                    margin: 0,
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    bgcolor: 'common.black',
                    color: 'common.white',
                  }}
                />
              </TableCell>
              <TableCell>
                <Switch
                  inputProps={{ 'aria-label': 'controlled' }}
                  checked={
                    user.role === EntityUserRole.OWNER ||
                    (user?.paymentsEnabled ?? false)
                  }
                  onChange={(e) => {
                    handlePaymentSwitchChange(e, user);
                  }}
                  disabled={user.role === EntityUserRole.OWNER || !isOwner}
                />
              </TableCell>
              <TableCell>
                <WBFlex justifyContent={'space-between'} alignItems={'center'}>
                  <WBTooltip title={statusTitle(user)}>
                    <WBTypography
                      bgcolor={
                        user.status === 'ACCEPTED'
                          ? 'success.main'
                          : user.status === 'DECLINED'
                          ? 'error.main'
                          : user.status === 'PENDING'
                          ? 'warning.main'
                          : 'success.main'
                      }
                      color="common.black"
                      sx={{
                        paddingX: 2,
                        paddingY: 1,
                        borderRadius: '20px',
                        fontWeight: 'medium',
                      }}
                      component={'div'}
                    >
                      {t(user.status ?? EntityUserStatus.ACCEPTED, {
                        ns: 'settings',
                      })}
                    </WBTypography>
                  </WBTooltip>
                  {user.role !== EntityUserRole.OWNER ? (
                    <ActionDisplay
                      sx={{
                        ml: 1,
                      }}
                      items={[
                        {
                          title: t('removeEntityUser', { ns: 'settings' }),
                          color: 'error.main',
                          action: () => {
                            handleClickOpen();
                          },
                        },
                      ]}
                    >
                      <RemoveEntityUserModal
                        entityUser={user}
                        open={open}
                        handleClose={handleClose}
                      />
                    </ActionDisplay>
                  ) : null}
                </WBFlex>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EntityUserTable;
