import { gql, useMutation } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core/types';
import {
  xeroGetConnectionStatus,
  xeroCreateContactSync,
} from '@admiin-com/ds-graphql';
import { useSnackbar, WBTypography } from '@admiin-com/ds-web';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useClientContext } from '../../components/ApolloClientProvider/ApolloClientProvider';
import { configureAppSyncClient } from '../../helpers/appsync';
import { getXeroEnv } from '../../helpers/xero';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';

export function XeroRedirect() {
  const { output } = useClientContext();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const entityId = useCurrentEntityId();

  const showSnackbar = useSnackbar();
  const [xeroCreateTokenSet] = useMutation(gql(xeroCreateContactSync), {
    onCompleted: (data) => {
      console.log('onCompleted: ', data);
      showSnackbar({
        message: t('xeroConnected', { ns: 'settings' }),
        severity: 'success',
        horizontal: 'right',
        vertical: 'top',
      });
    },
    onError: (err) => {
      console.log('onError: ', err);
      showSnackbar({
        message: t('xeroError', { ns: 'settings' }),
        severity: 'error',
        horizontal: 'right',
        vertical: 'top',
      });
    },
    refetchQueries: [{ query: gql(xeroGetConnectionStatus) }],
    awaitRefetchQueries: true,
  });

  const errorCode = searchParams.get('error');

  const navigate = useNavigate();

  useEffect(() => {
    const createTokenSet = async (url: string) => {
      let user;
      try {
        user = await fetchAuthSession({ forceRefresh: true });
      } catch (err) {
        console.log('ERROR refresh user session: ', err);
      }

      console.log('user: ', user);

      const options: OperationVariables = {
        variables: {
          input: {
            url,
            entityId,
            xeroEnv: getXeroEnv(window.location.href),
          },
        },
      };

      if (!user) {
        options.client = configureAppSyncClient({
          authType: 'API_KEY',
          graphQLAPIURL: output.graphQLAPIURL,
        });
      }

      try {
        const { data } = await xeroCreateTokenSet(options);
        console.log('data: ', data);
      } catch (err) {
        console.log('ERROR create xero token set', err);
      }
    };

    createTokenSet(window.location.href);
    navigate('/settings/account');
  }, [output, xeroCreateTokenSet]);

  return (
    <>
      {errorCode && (
        <WBTypography color="error">
          {t('xeroError', { ns: 'xero' })} ({errorCode})
        </WBTypography>
      )}
      {/*{!errorCode && <WBButton onClick={createTokenSet}>Create token set</WBButton> }*/}
    </>
  );
}

export default XeroRedirect;
