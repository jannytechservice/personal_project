import OnboardingBusinessCreate from './BusinessCreate/OnboardingBusinessCreate';
import OnboardingBusinessAddressLookup from './BusinessAddress/OnboardingBusinessAddress';
import OnboardingBusinessLogo from './BusinessLogo/OnboardingBusinessLogo';
import { BackButton } from '../../components/BackButton/BackButton';
import { WBBox } from '@admiin-com/ds-web';
import {
  OnboardingBusinessStep,
  useOnboardingProcess,
} from '../../components/OnboardingContainer/OnboadringContainer';
import PageSelector from '../../components/PageSelector/PageSelector';
import OnboardingBusinessFirm from './BusinessFirm/OnboardingBusinessFirm';

const OnboardingBusiness = () => {
  const { currentBusinessStep, gotoPrev, isNotOnboarding } =
    useOnboardingProcess();

  return (
    <WBBox sx={{ position: 'relative', height: '100%' }}>
      <PageSelector current={currentBusinessStep}>
        {!isNotOnboarding && (
          <PageSelector.Page value={OnboardingBusinessStep.ACCOUTANT_FIRM}>
            <OnboardingBusinessFirm />
          </PageSelector.Page>
        )}
        <PageSelector.Page value={OnboardingBusinessStep.ADD_BUSINESS}>
          <OnboardingBusinessCreate />
        </PageSelector.Page>
        <PageSelector.Page value={OnboardingBusinessStep.BUSINESS_ADDRESS}>
          <OnboardingBusinessAddressLookup />
        </PageSelector.Page>
        <PageSelector.Page value={OnboardingBusinessStep.BUSINESS_LOGO}>
          <OnboardingBusinessLogo />
        </PageSelector.Page>
      </PageSelector>
      <BackButton onClick={gotoPrev} />
    </WBBox>
  );
};

export default OnboardingBusiness;
