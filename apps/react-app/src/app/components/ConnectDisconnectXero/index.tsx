import React from 'react';
import {
  gql,
  OnDataOptions,
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client';
import {
  xeroCreateConsentUrl as XERO_CREATE_CONSENT_URL,
  xeroCreateContactSync,
  xeroDisconnect,
  xeroGetConnectionStatus,
  XeroScopeSet,
  onUpdateEntity as ON_UPDATE_ENTITY,
  OnUpdateEntitySubscription,
} from '@admiin-com/ds-graphql';
import { getXeroEnv } from '../../helpers/xero';
import ConnectButton from './ConnectButton';
import DisconnectButton from './DisconnectButton';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { useSnackbar } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';

export const ConnectDisconnectXero = () => {
  const { data, loading } = useQuery(gql(xeroGetConnectionStatus));
  const [xeroCreateConsentUrl] = useMutation(gql(XERO_CREATE_CONSENT_URL));

  const { entity } = useSelectedEntity();
  const [disConnect] = useMutation(gql(xeroDisconnect), {
    variables: {
      input: {
        entityId: entity?.id,
      },
    },
    refetchQueries: [{ query: gql(xeroGetConnectionStatus) }],
  });
  const [xeroCreateSync] = useMutation(gql(xeroCreateContactSync));

  const xeroContactSyncStatus = entity?.xeroContactSyncStatus;
  const xeroLastContactSyncAt = entity?.xeroLastContactSyncAt;

  const onSignUpXero = async () => {
    try {
      const { data } = await xeroCreateConsentUrl({
        variables: {
          input: {
            scopeSet: XeroScopeSet.ACCOUNTING,
            xeroEnv: getXeroEnv(window.location.href),
          },
        },
      });
      if (data?.xeroCreateConsentUrl) {
        window.location.replace(data?.xeroCreateConsentUrl);
      }
    } catch (err) {
      console.log('ERROR create xero token set', err);
    }
  };

  const onDisconnect = async () => {
    await disConnect();
  };

  const startXeroSync = async () => {
    if (xeroContactSyncStatus === 'PENDING') {
      return;
    }
  };

  const loggedIn = data?.xeroGetConnectionStatus?.isConnected;

  const showSnackbar = useSnackbar();

  const [subscriptionErrorCount, setSubscriptionErrorCount] = React.useState(0);
  const [init, setInit] = React.useState(false);
  const onSubscriptionError = React.useCallback((err: any) => {
    console.log('ERROR subscription: ', err);
    setInit(false);
    setTimeout(() => {
      setInit(true);
      setSubscriptionErrorCount((prev) => prev + 1);
    }, 500);
  }, []);

  const { t } = useTranslation();
  const client = useApolloClient();
  useSubscription(
    gql`
      ${ON_UPDATE_ENTITY}
    `,
    {
      variables: {
        entityId: entity?.id,
      },
      skip: !entity?.id || !init,
      onData: (data: OnDataOptions<OnUpdateEntitySubscription>) => {
        const onUpdateEntity = data?.data?.data?.onUpdateEntity;
        if (onUpdateEntity) {
          if (onUpdateEntity.xeroContactSyncStatus === 'PENDING') {
            showSnackbar({
              title: t('entitySyncingTitle', { ns: 'common' }),
              message: t('entitySyncingDescription', { ns: 'common' }),
            });
          } else if (onUpdateEntity.xeroContactSyncStatus === 'SYNCED') {
            showSnackbar({
              title: t('entitySyncedTitle', { ns: 'common' }),
              message: t('entitySyncedDescription', { ns: 'common' }),
            });
          }
          client.cache.modify({
            id: client.cache.identify(onUpdateEntity),
            fields: {
              xeroContactSyncStatus() {
                return onUpdateEntity?.xeroContactSyncStatus ?? null;
              },
              xeroLastContactSyncAt() {
                return onUpdateEntity?.xeroLastContactSyncAt ?? null;
              },
            },
          });
        }
      },
      onError: (err) => onSubscriptionError(err),
      shouldResubscribe: true,
    }
  );

  return loading ? null : !loggedIn ? (
    <ConnectButton onClick={onSignUpXero} />
  ) : (
    <DisconnectButton
      onXeroSync={startXeroSync}
      onDisconnect={onDisconnect}
      xeroContactSyncStatus={xeroContactSyncStatus}
    />
  );
};
