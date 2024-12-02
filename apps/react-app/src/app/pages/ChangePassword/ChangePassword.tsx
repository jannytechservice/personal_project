import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';

const ChangePassword = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <WBTypography variant="h1">
        {t('changePasswordTitle', { ns: 'common' })}
      </WBTypography>
      <ChangePasswordForm />
    </PageContainer>
  );
};

export default ChangePassword;
