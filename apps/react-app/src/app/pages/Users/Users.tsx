import React, { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { WBBox, WBButton, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import {
  entityUsersByEntityId as ENTITY_USERS_BY_ENTITY_ID,
  EntityUser,
} from '@admiin-com/ds-graphql';
import AddUserModal from '../../components/AddUserModal/AddUserModal';
import EntityUserTable from '../../components/EntityUserTable/EntityUserTable';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';

const Users = () => {
  const { t } = useTranslation();
  const entityId = useCurrentEntityId();
  const { data: usersData, loading } = useQuery(
    gql(ENTITY_USERS_BY_ENTITY_ID),
    {
      variables: {
        entityId,
      },
    }
  );
  const users: EntityUser[] = useMemo(
    () => usersData?.entityUsersByEntityId?.items || [],
    [usersData]
  );
  const [showModal, setShowModal] = React.useState<boolean>(false);

  //const parentRef = React.useRef<HTMLDivElement>(null);

  //const rowVirtualizer = useVirtualizer({
  //  count: adminList.length,
  //  getScrollElement: () => parentRef.current,
  //  estimateSize: () => 125,
  //});
  return (
    <WBFlex
      p={[3, 5, 8]}
      flexDirection={'column'}
      position={'relative'}
      pt={{ xs: 10, sm: 10, md: 10, lg: 8 }}
      minHeight="100%"
    >
      <WBFlex
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{ backgroundColor: 'background.paper', maxWidth: '100%' }}
      >
        <WBTypography variant="h2">
          {t('users', { ns: 'settings' })}
        </WBTypography>
        <WBButton
          type="button"
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
          onClick={() => setShowModal(true)}
        >
          {`+ ${t('addUser', { ns: 'settings' })}`}
        </WBButton>
        {/*<WBLink*/}
        {/*  variant="body2"*/}
        {/*  underline="always"*/}
        {/*  fontWeight={'bold'}*/}
        {/*  // color={!isIndividualEntity ? 'primary.main' : 'action.disabled'}*/}
        {/*  display={{ xs: 'none', sm: 'block' }}*/}
        {/*  onClick={() => setShowModal(true)}*/}
        {/*>*/}
        {/*  {`+ ${t('addUser', { ns: 'settings' })}`}*/}
        {/*</WBLink>*/}
      </WBFlex>

      <WBBox pt={0} mt={3}>
        <EntityUserTable users={users} loading={loading} />
      </WBBox>
      <WBBox mt={[5, 0]}>
        <WBButton
          fullWidth
          type="submit"
          sx={{
            mb: 7,
            display: { xs: 'block', sm: 'none' },
          }}
          // disabled={isIndividualEntity}
          onClick={() => setShowModal(true)}
        >
          {`+ ${t('addUser', { ns: 'settings' })}`}
        </WBButton>
      </WBBox>
      <AddUserModal open={showModal} handleClose={() => setShowModal(false)} />
    </WBFlex>
  );
};

export default Users;
