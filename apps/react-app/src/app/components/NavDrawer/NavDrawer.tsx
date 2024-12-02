import { TaskDirection } from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBButton,
  WBDivider,
  WBFlex,
  WBIcon,
  WBList,
  WBToolbar,
  WBTypography,
  useMediaQuery,
  useTheme,
} from '@admiin-com/ds-web';
import DashboardIcon from '../../../assets/icons/dashboard.svg';
import TemplatesIcon from '../../../assets/icons/templates.svg';
import ToolBoxIcon from '../../../assets/icons/taskbox.svg';
import UserIcon from '../../../assets/icons/contacts.svg';
import ClientsIcon from '../../../assets/icons/clients.svg';
import SettingIcon from '../../../assets/icons/setting.svg';
import RewardsGold from '../../../assets/icons/rewards-gold.svg';
import { PATHS } from '../../navigation/paths';
import { EntitySelector } from '../EntitySelector/EntitySelector';
import { TaskCreation } from '../../pages/TaskCreation/TaskCreation';
import React from 'react';
import { NavItem } from '../NavItem/NavItem';
import { useTranslation } from 'react-i18next';
import { useTasks } from '../../hooks/useTasks/useTasks';
import ReferralBackImage from '../../../assets/icons/referral_back@2x.png?url';
import ReferralIcon from '../../../assets/icons/referral.svg';
import { numberToCurrency, removeTrailingZeros } from '@admiin-com/ds-common';
import { useCurrentUser } from '../../hooks/useCurrentUser/useCurrentUser';
import { useFirmId } from '../../hooks/useClientWorkflow/useClientWorkflow';
export interface NavDrawerProps {
  logo: React.ReactNode;
  onNavigated?: () => void;
}

export function NavDrawer({ logo, onNavigated }: NavDrawerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const islg = useMediaQuery(theme.breakpoints.down('lg'));
  const [open, setOpenModal] = React.useState<boolean>(false);

  const { hasDeclinedPayment } = useTasks({
    direction: TaskDirection.RECEIVING,
  });

  // const { users: clients } = useUserEntities({ onlyAccountant: true });
  // const hasClients = entity?.clientsStatus === EntityClientsStatus.ENABLED;

  const { loading, firmId } = useFirmId();
  const user = useCurrentUser();

  const hasClients = !!firmId;
  return (
    <WBBox
      sx={{
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        display: 'flex',
        flexDirection: 'column',
        height: { xs: undefined, sm: '100%' },
        py: 2,
        flex: 1,
      }}
    >
      <WBToolbar sx={{ py: 4, mx: 1, justifyContent: 'start' }}>
        {logo}
      </WBToolbar>
      {!loading ? (
        <>
          {!hasClients && (
            <WBList>
              <NavItem
                onClick={() => {
                  onNavigated && onNavigated();
                }}
                title={t('dashboardTitle', { ns: 'common' })}
                icon={<DashboardIcon />}
                path={PATHS.dashboard}
              />
            </WBList>
          )}
          {hasClients ? (
            <NavItem
              onClick={() => {
                onNavigated && onNavigated();
              }}
              title={t('clientsTitle', { ns: 'common' })}
              icon={<ClientsIcon />}
              path={PATHS.clients}
            />
          ) : null}
        </>
      ) : (
        <WBList>
          <NavItem
            onClick={() => {
              onNavigated && onNavigated();
            }}
            title={''}
            icon={null}
            path={'#'}
          />
        </WBList>
      )}
      <WBDivider
        sx={{
          mx: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
      <WBList sx={{ flexGrow: 1, marginTop: 2 }}>
        <EntitySelector />
        <NavItem
          onClick={() => {
            onNavigated && onNavigated();
          }}
          title={
            <WBFlex alignItems={'center'}>
              {t('taskboxTitle', { ns: 'common' })}
              {hasDeclinedPayment && (
                <WBBox
                  ml={1}
                  borderRadius="100%"
                  width="10px"
                  height="10px"
                  bgcolor="error.main"
                />
              )}
            </WBFlex>
          }
          icon={<ToolBoxIcon />}
          path={PATHS.tasks}
        />
        <NavItem
          onClick={() => {
            onNavigated && onNavigated();
          }}
          title={t('contactsTitle', { ns: 'common' })}
          icon={<UserIcon />}
          path={PATHS.contacts}
        />
        <NavItem
          onClick={() => {
            onNavigated && onNavigated();
          }}
          title={t('servicesTitle', { ns: 'common' })}
          icon={<TemplatesIcon />}
          path={PATHS.services}
        />

        {/*<NavItem*/}
        {/*  onClick={() => {*/}
        {/*    onNavigated && onNavigated();*/}
        {/*  }}*/}
        {/*  title={t('templatesTitle', { ns: 'common' })}*/}
        {/*  icon={<TemplatesIcon />}*/}
        {/*  path={PATHS.templates}*/}
        {/*/>*/}
      </WBList>
      <WBBox>
        <WBButton
          sx={{
            marginLeft: 3,
            marginBottom: 4,
            p: 0.8,
            pr: 2,
            minWidth: '40px',
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
          }}
          onClick={() => setOpenModal(true)}
        >
          <WBIcon name="Add" color="inherit" size="small" />
          <WBBox ml={1}>Create Task</WBBox>
        </WBButton>
      </WBBox>
      <WBDivider
        sx={{
          mx: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
      <WBDivider
        sx={{
          mx: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
      <NavItem
        title={
          <WBFlex alignItems="center">
            {t('referrals', { ns: 'common' })}
            <WBBox
              sx={{
                display: 'inline-block',
                backgroundImage: `url(${ReferralBackImage})`,
                backgroundSize: 'contain', // Ensures the image covers the entire box
                backgroundPosition: 'center', // Centers the image within the box
                backgroundRepeat: 'no-repeat', // Prevents the image from repeating
              }}
              p={1}
              ml={1}
            >
              <WBTypography
                component={'span'}
                color={'white'}
                variant={'body2'}
                fontWeight={600}
              >
                {removeTrailingZeros(numberToCurrency(50))}
              </WBTypography>
            </WBBox>
          </WBFlex>
        }
        icon={<ReferralIcon />}
        path={PATHS.referrals}
      />
      <WBDivider
        sx={{
          mx: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
      <NavItem
        title={
          <WBFlex alignItems="center">
            {t('rewardPoints', {
              ns: 'common',
              points: (user.pointsBalance || 0).toLocaleString('en-US'),
            })}
          </WBFlex>
        }
        icon={<RewardsGold />}
        path={PATHS.rewards}
      />
      <WBList>
        {/* <NavItem
          title={`xx,xxx ${t('pointsTitle', { ns: 'common' })}`}
          icon={<StarIcon />}
          path={PATHS.rewards}
        /> */}
        <NavItem
          onClick={() => {
            onNavigated && onNavigated();
          }}
          title={t('settingsTitle', { ns: 'common' })}
          icon={<SettingIcon />}
          path={!islg ? PATHS.account : PATHS.settings}
        />
      </WBList>
      <TaskCreation
        open={open}
        handleCloseModal={() => setOpenModal(false)}
        key={open as any}
      />
    </WBBox>
  );
}

export default NavDrawer;
