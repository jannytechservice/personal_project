import { gql, useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import { WBBox } from '@admiin-com/ds-web';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { isLoggedInVar } from '@admiin-com/ds-graphql';
import { CSIsLoggedIn as IS_LOGGED_IN } from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
import { BusinessProcessProvider } from '../OnboardingContainer/OnboadringContainer';
export const OnboardingLayout = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [getUser] = useLazyQuery(gql(GET_USER));
  const { data: loggedInData } = useQuery(gql(IS_LOGGED_IN));
  const isLoggedIn = useMemo(() => loggedInData?.isLoggedIn, [loggedInData]);

  // const prePath = useMemo(()=>getNextOnboardingStep)

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const curUser = await fetchAuthSession({
          forceRefresh: true,
        });
        if (curUser?.userSub) {
          localStorage.setItem('sub', curUser.userSub as string);

          await getUser({
            variables: {
              id: curUser.userSub,
            },
          });
        }
      } catch (err) {
        console.log('ERROR fetchAuthSession: ', err);
        localStorage.removeItem('sub');
        isLoggedInVar(false);
        client.cache.evict({ fieldName: 'me' });
        client.cache.gc();
      }

      if (isLoggedIn === false) {
        navigate(PATHS.signIn, { replace: true });
      }
    };

    checkUserSession();
  }, [client, navigate, isLoggedIn, getUser]);

  return (
    <WBBox sx={{ overflowY: 'scroll', height: '100%' }}>
      {/* <NavBar homePath={path} navRight={<ChangeLanguage />} /> */}
      <BusinessProcessProvider>
        <Outlet />
      </BusinessProcessProvider>
    </WBBox>
  );
};
