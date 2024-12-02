import { WBBox, WBFlex, WBImage, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';
import TemplatesDemo from '../../../assets/images/templates-demo.png';
import { SidebarLayout } from '../../components/SidebarLayout/SidebarLayout';

export function Templates() {
  const { t } = useTranslation();
  return (
    <PageContainer sx={{ px: [5] }}>
      <WBFlex flex={1} mt={1} alignItems={'center'} width={'100%'}>
        <WBBox>
          <SidebarLayout.MenuButton />
        </WBBox>

        <WBTypography variant={'h3'}>
          {t('templatesComingSoon', { ns: 'common' })}
        </WBTypography>
      </WBFlex>
      <WBTypography>
        {t('templatesComingSoonText', { ns: 'common' })}
      </WBTypography>
      <WBImage
        src={TemplatesDemo}
        alt="Admiin templates Demo"
        sx={{ px: [0, 0, 5], mt: 3 }}
      />
    </PageContainer>
  );
}

export default Templates;
