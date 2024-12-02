import {
  WBTypography,
  WBFlex,
  WBGrid,
  WBButton,
  WBSvgIcon,
  useTheme,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../../components';
import { BillDirectionCard } from '../../BillDirection/BillDirection';
import IndividualBusinessIcon from '../../../../assets/icons/individual_business.svg';
import AccountingFirmIcon from '../../../../assets/icons/accounting_firm.svg';
import { useState } from 'react';
import { useOnboardingProcess } from '../../../components/OnboardingContainer/OnboadringContainer';
import { useFormContext } from 'react-hook-form';

const OnboardingBusinessFirm = () => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [isFirm, setIsFirm] = useState(false);
  const { nextBusiness } = useOnboardingProcess();
  const { setValue } = useFormContext();

  return (
    <PageContainer
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingY: 6,
      }}
    >
      <WBTypography variant="h3">
        {t('onboardingBusinessFirmTitle', { ns: 'onboarding' })}
      </WBTypography>

      <WBTypography variant="body1" mb={[5, 15]} textAlign="center">
        {t('onboardingBusinessFirmBody', { ns: 'onboarding' })}
      </WBTypography>
      <WBFlex
        flexDirection="column"
        alignItems="center"
        width={{
          xs: '100%',
          sm: '80%',
          md: '60%',
          lg: '40%',
        }}
      >
        <WBGrid
          container
          spacing={[2, 4]}
          alignItems={'stretch'}
          justifyContent={'center'}
          direction="row"
          width={'100%'}
        >
          <WBGrid xs={12} sm={8} md={6}>
            <BillDirectionCard
              icon={
                <WBSvgIcon fontSize="small" color={palette.text.primary}>
                  <IndividualBusinessIcon />
                </WBSvgIcon>
              }
              title={t('individualTitle', { ns: 'onboarding' })}
              selected={!isFirm}
              subTitle={t('individualSubTitle', { ns: 'onboarding' })}
              onClick={() => {
                setIsFirm(false);
              }}
            />
          </WBGrid>

          <WBGrid xs={12} sm={8} md={6}>
            <BillDirectionCard
              icon={
                <WBSvgIcon fontSize="small" color={palette.text.primary}>
                  <AccountingFirmIcon />
                </WBSvgIcon>
              }
              title={t('accountingFirmTitle', { ns: 'onboarding' })}
              selected={isFirm}
              onClick={() => {
                setIsFirm(true);
              }}
              subTitle={t('accountingFirmSubTitle', { ns: 'onboarding' })}
            />
          </WBGrid>
        </WBGrid>
        <WBButton
          sx={{
            mt: {
              xs: 6,
              sm: 10,
            },
            mx: [2, 10],
          }}
          fullWidth
          onClick={() => {
            nextBusiness();
            setValue('entity.isFirm', isFirm);
          }}
        >
          {t('nextTitle', { ns: 'common' })}
        </WBButton>
      </WBFlex>
    </PageContainer>
  );
};
export default OnboardingBusinessFirm;
