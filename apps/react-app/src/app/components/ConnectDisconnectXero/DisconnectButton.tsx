import React from 'react';
import {
  WBFlex,
  WBSvgIcon,
  WBBox,
  WBTypography,
  WBChip,
} from '@admiin-com/ds-web';
import { useTheme } from '@mui/material';
import XeroDarkLogo from '../../../assets/icons/xero-dark-logo.svg';
import XeroWhiteLogo from '../../../assets/icons/xero-white-logo.svg';
import { useTranslation } from 'react-i18next';
import ActionDisplay from '../ActionDisplay/ActionDisplay';
import { XeroSyncStatus } from '@admiin-com/ds-graphql';

interface DisconnectButtonProps {
  onDisconnect: () => void;
  xeroContactSyncStatus?: XeroSyncStatus | null;
  onXeroSync: () => void;
}

const DisconnectButton: React.FC<DisconnectButtonProps> = ({
  onXeroSync,
  xeroContactSyncStatus,
  onDisconnect,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <WBFlex
      width="100%"
      py={3}
      justifyContent={'space-between'}
      alignItems={'center'}
      borderBottom={`1px solid ${theme.palette.grey[300]}`}
    >
      <WBFlex>
        <WBSvgIcon viewBox="0 0 6 6" fontSize="large" component={'div'}>
          {theme.palette.mode === 'dark' ? <XeroWhiteLogo /> : <XeroDarkLogo />}
        </WBSvgIcon>
        <WBBox sx={{ ml: 2 }}>
          <WBTypography mb={0} variant="h5" fontWeight={'medium'}>
            {t('software', { ns: 'settings' })}
          </WBTypography>
          <WBTypography mb={0} variant="body1" fontWeight={'medium'}>
            {t('Xero', { ns: 'settings' })}
          </WBTypography>
        </WBBox>
      </WBFlex>
      <WBFlex justifyContent={'space-between'} alignItems={'center'}>
        <WBChip
          label={t('connected', { ns: 'settings' })}
          sx={{
            fontSize: '10px',
            mr: 3,
            mb: 0,
            textTransform: 'uppercase',
            fontWeight: 'bold',
            bgcolor: 'success.main',
            color: 'common.black',
          }}
        />
        <ActionDisplay
          items={[
            {
              title:
                xeroContactSyncStatus !== XeroSyncStatus.PENDING
                  ? t('sync', { ns: 'settings' })
                  : t('syncInProgress', { ns: 'settings' }),
              action: onXeroSync,
              disabled: xeroContactSyncStatus === XeroSyncStatus.PENDING,
            },
            {
              title: t('disconnect', { ns: 'settings' }),
              action: onDisconnect,
            },
          ]}
        />
      </WBFlex>
    </WBFlex>
  );
};

export default DisconnectButton;
