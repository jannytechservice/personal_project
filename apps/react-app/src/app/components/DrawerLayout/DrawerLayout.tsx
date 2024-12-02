import { LOGO_LARGE_ADMIIN, LOGO_ICON_ADMIIN } from '@admiin-com/ds-common';
import { fetchAuthSession } from 'aws-amplify/auth';
import React, { Suspense, useEffect, useMemo } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Outlet, useNavigate } from 'react-router-dom';
import { CSIsLoggedIn as IS_LOGGED_IN } from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
import { useNotificationService } from '../../hooks/useNotificationService/useNotificationService';
import { SidebarLayout } from '../SidebarLayout/SidebarLayout';
import { DRAWER_WIDTH } from '../../constants/config';
export const DrawerLayout = () => {
  const navigate = useNavigate();
  const [getUser] = useLazyQuery(gql(GET_USER));

  const { data: loggedInData } = useQuery(gql(IS_LOGGED_IN));
  const isLoggedIn = useMemo(() => loggedInData?.isLoggedIn, [loggedInData]);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const curUser = await fetchAuthSession({
          forceRefresh: true,
        });
        if (curUser?.userSub) {
          localStorage.setItem('sub', curUser.userSub);

          await getUser({
            variables: {
              id: curUser.userSub,
            },
          });
        }
      } catch (err) {
        console.log('ERROR: fetchAuthSession', err);
      }

      if (isLoggedIn === false) {
        navigate(PATHS.signIn, { replace: true });
      }
    };

    checkUserSession();
  }, [isLoggedIn]);

  useNotificationService();

  const drawerWidth = DRAWER_WIDTH;

  return (
    <SidebarLayout
      drawerWidth={drawerWidth}
      logoFullSrc={LOGO_LARGE_ADMIIN}
      logoIconSrc={LOGO_ICON_ADMIIN}
    >
      <Suspense fallback={<div />}>
        <Outlet />
      </Suspense>
    </SidebarLayout>
  );
};
