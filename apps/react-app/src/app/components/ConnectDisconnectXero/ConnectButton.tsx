import React from 'react';
import { WBButton, WBSvgIcon, WBBox, WBTypography } from '@admiin-com/ds-web';
import XeroLogo from '../../../assets/icons/xero-logo.svg';
import { useTranslation } from 'react-i18next';

interface ConnectButtonProps {
  onClick: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <WBButton
      sx={{
        borderRadius: '999px',
        backgroundColor: '#13B5EA',
        '&:hover': {
          backgroundColor: '#088cb9',
        },
        color: 'white',
        padding: 2,
        display: 'flex',
        justifyContent: 'start',
      }}
      onClick={onClick}
    >
      <WBSvgIcon
        viewBox="0 0 6 6"
        fontSize="large"
        component={'div'}
        sx={{ backgroundColor: `rgba(255,255,255,0)` }}
      >
        <XeroLogo />
      </WBSvgIcon>
      <WBBox ml={1}>
        <WBTypography color={'inherit'} fontWeight={'medium'}>
          {t('syncWithXero', { ns: 'contacts' })}
        </WBTypography>
        <WBTypography variant="body2" color={'inherit'} fontWeight={'regular'}>
          {t('synchronizeXeroContacts', { ns: 'contacts' })}
        </WBTypography>
      </WBBox>
    </WBButton>
  );
};

export default ConnectButton;
