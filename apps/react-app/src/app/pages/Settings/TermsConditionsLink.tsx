import { useApolloClient } from '@apollo/client';
import { isLoggedInVar } from '@admiin-com/ds-graphql';
import { signOut } from 'aws-amplify/auth';
import { Cache } from 'aws-amplify/utils';
import { useCallback } from 'react';
import { WBBox, WBFlex, WBLink } from '@admiin-com/ds-web';
import { PATHS } from '../../navigation/paths';
import { useTranslation } from 'react-i18next';

export const TermsConditionsLink = () => {
  const client = useApolloClient();
  const { t } = useTranslation();

  const onLogOut = useCallback(async () => {
    client.cache.evict({ fieldName: 'me' });
    client.cache.gc();
    await client.cache.reset();
    client.clearStore();
    try {
      localStorage.clear(); //TODO: ensure doesnt break anything clearing all of local storage
      await Cache.clear();
      await signOut();
      isLoggedInVar(false);
      localStorage.removeItem('sub');
    } catch (err) {
      console.log('ERROR log out: ', err);
    }
  }, [client]);
  return (
    <WBFlex flexDirection={['column', 'row']}>
      <WBBox flexGrow={1} />
      <WBLink
        onClick={onLogOut}
        underline="always"
        noWrap
        m={1}
        variant="body2"
        sx={{
          color: 'inherit',
          fontWeight: 'inherit',
          display: { xs: 'block', sm: 'inline' },
          width: { xs: '100%', sm: 'auto' },
          textAlign: { xs: 'center', sm: 'left' },
        }}
        color="text.primary"
        href={PATHS.signIn}
      >
        {t('logOut', { ns: 'common' })}
      </WBLink>
    </WBFlex>
  );
};
