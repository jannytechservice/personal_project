import {
  Entity,
  EntityUserRole,
  CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID,
  selectedEntityIdInVar,
} from '@admiin-com/ds-graphql';
import { useUserEntities } from '../../hooks/useUserEntities/useUserEntities';
import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { FormControl, ListSubheader, styled, useTheme } from '@mui/material';
import {
  WBListItem,
  WBListItemIcon,
  WBMenuItem,
  WBSelect,
  WBTypography,
} from '@admiin-com/ds-web';
import { gql, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser/useCurrentUser';
import { useTranslation } from 'react-i18next';
import { PATHS } from '../../navigation/paths';

export function EntitySelector() {
  const { userEntities, users } = useUserEntities();
  const theme = useTheme();
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const [entityId, setEntityId] = React.useState<string>(
    selectedEntityIdData?.selectedEntityId || ''
  );

  // const match = useMatch();
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const user = useCurrentUser();
  const hasClients = !!user.firmId;

  useEffect(() => {
    if (
      (selectedEntityIdData?.selectedEntityId === 'null' ||
        selectedEntityIdData?.selectedEntityId === null) &&
      userEntities?.length > 0
    ) {
      //console.log('entities: ', entities);
      //console.log('selectedEntityIdData?.selectedEntityId: ', selectedEntityIdData?.selectedEntityId);
      //setEntityId(selectedEntityIdData.selectedEntityId);
      setEntityId(userEntities[0].id);
      selectedEntityIdInVar(userEntities[0].id);
      localStorage.setItem('selectedEntityId', userEntities[0].id);
    } else if (
      selectedEntityIdData &&
      selectedEntityIdData?.selectedEntityId !== entityId
    ) {
      changeEntityId(selectedEntityIdData?.selectedEntityId);
    } else if (userEntities?.length > 0) {
      if (
        !userEntities.find(
          (entity) => entity.id === selectedEntityIdData?.selectedEntityId
        )
      )
        changeEntityId(userEntities[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEntityIdData, userEntities]);

  const onEntityChange = (selectedEntityId: string) => {
    if (selectedEntityId !== entityId) changeEntityId(selectedEntityId);

    if (id) navigate(pathname.replace(`/${id}`, ''));
  };

  const changeEntityId = (selectedId: string) => {
    setEntityId(selectedId);
    selectedEntityIdInVar(selectedId);
    localStorage.setItem('selectedEntityId', selectedId);
  };
  const normalEntities: Entity[] = React.useMemo(
    () =>
      (users ?? [])
        .filter(
          (user) => user.entity && user.role !== EntityUserRole.ACCOUNTANT
        )
        .map((user) => user.entity as Entity)
        .filter((entity) => !!entity)
        .filter((entity) => entity),
    [users]
  );
  const clientEntites: Entity[] = React.useMemo(
    () =>
      (users ?? [])
        .filter(
          (user) => user.entity && user.role === EntityUserRole.ACCOUNTANT
        )
        .map((user) => user.entity as Entity)
        .filter((entity) => !!entity)
        .filter((entity) => entity),
    [users]
  );
  const { t } = useTranslation();

  return userEntities ? (
    <WBListItem sx={{ pr: 0 }}>
      <FormControl
        sx={{
          backgroundColor: theme.palette.common.white,
          height: '70%',
          width: '90%',
          fontSize: theme.typography.body1,
          fontWeight: 'bold',
        }}
      >
        <WBSelect
          sx={{ px: 2 }}
          value={userEntities.length > 0 ? entityId : ''}
          SelectProps={{
            renderValue: undefined,
            SelectDisplayProps: {
              style: {
                display: 'flex',
                color: theme.palette.common.black,
                alignItems: 'center',
              },
            },
          }}
          InputProps={{
            disableUnderline: true,
          }}
          options={userEntities.map((entity) => ({
            value: entity.id,
            label: entity.name,
          }))}
        >
          {hasClients && (
            <WBListSubheader>
              {t('myEntities', { ns: 'dashboard' })}
            </WBListSubheader>
          )}
          {normalEntities.map((entity) => (
            <WBMenuItem
              value={entity.id}
              key={entity.id}
              onClick={() => onEntityChange(entity.id)}
            >
              <WBListItemIcon>
                <WBS3Avatar
                  sx={{
                    borderRadius: '3px',
                    width: '20px',
                    height: '20px',
                  }}
                  imgKey={entity.logo?.key}
                  fontSize="h4.fontSize"
                  identityId={entity.logo?.identityId}
                  level={entity.logo?.level}
                  companyName={entity.name}
                  key={entity?.id}
                />
              </WBListItemIcon>
              <WBTypography
                variant="body2"
                color="light"
                noWrap
                fontWeight="bold"
              >
                {entity.name}
              </WBTypography>
            </WBMenuItem>
          ))}
          {hasClients && clientEntites?.length > 0 && (
            <WBListSubheader>
              {t('clients', { ns: 'dashboard' })}
            </WBListSubheader>
          )}
          {hasClients &&
            clientEntites?.length > 0 &&
            clientEntites.map((entity) => (
              <WBMenuItem
                key={entity.id}
                value={entity.id}
                onClick={() => onEntityChange(entity.id)}
              >
                <WBListItemIcon>
                  <WBS3Avatar
                    sx={{
                      borderRadius: '3px',
                      width: '20px',
                      height: '20px',
                    }}
                    imgKey={entity.logo?.key}
                    fontSize="h4.fontSize"
                    identityId={entity.logo?.identityId}
                    level={entity.logo?.level}
                    companyName={entity.name}
                    key={entity?.id}
                  />
                </WBListItemIcon>
                <WBTypography
                  variant="body2"
                  color="light"
                  noWrap
                  fontWeight="bold"
                >
                  {entity.name}
                </WBTypography>
              </WBMenuItem>
            ))}
          {hasClients && (
            <WBMenuItem
              value="newClient"
              onClick={() => {
                navigate(PATHS.clients);
              }}
              sx={{
                mt: 2,
                px: 0,
                mx: 2,
                borderTop: `1px solid ${theme.palette.grey[300]}`,
              }}
            >
              <WBTypography
                sx={{
                  textDecoration: 'underline',
                }}
                color={'primary'}
                fontWeight={'bold'}
              >
                {t('newClient', { ns: 'dashboard' })}
              </WBTypography>
            </WBMenuItem>
          )}
        </WBSelect>
      </FormControl>
    </WBListItem>
  ) : null;
}

export const EntityItem = ({
  entity,
  onClick,
}: {
  entity: Entity;
  onClick: (id: string) => void;
}) => {
  return (
    <WBMenuItem value={entity.id} onClick={() => onClick(entity.id)}>
      <WBListItemIcon>
        <WBS3Avatar
          sx={{
            borderRadius: '3px',
            width: '20px',
            height: '20px',
          }}
          imgKey={entity.logo?.key}
          fontSize="h4.fontSize"
          identityId={entity.logo?.identityId}
          level={entity.logo?.level}
          companyName={entity.name}
          key={entity?.id}
        />
      </WBListItemIcon>
      <WBTypography variant="body2" color="light" noWrap fontWeight="bold">
        {entity.name}
      </WBTypography>
    </WBMenuItem>
  );
};
export const WBListSubheader = styled(ListSubheader)(({ theme }) => ({
  backgroundColor: 'inherit',
  color: theme.palette.text.primary,
  ...theme.typography.h5,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  paddingLeft: 0,
  position: 'initial',
}));
