import {
  HELP_CENTER_URL,
  PRIVACY_POLICY_URL,
  ROADMAP_URL,
  TERMS_CONDITIONS_URL,
} from '@admiin-com/ds-common';
import {
  WBFlex,
  WBLink,
  WBLinkButton,
  WBList,
  WBListItem,
  WBListItemText,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import Gleap from 'gleap';

const Support = () => {
  const { t } = useTranslation();
  return (
    <WBFlex
      p={[3, 5, 8]}
      flexDirection={'column'}
      position={'relative'}
      pt={{ xs: 10, sm: 10, md: 10, lg: 8 }}
      minHeight="100%"
    >
      <WBTypography variant="h2">
        {t('supportTitle', { ns: 'settings' })}
      </WBTypography>

      <WBList>
        <WBListItem
          secondaryAction={
            <WBLinkButton
              color="primary.main"
              onClick={() => {
                const isOpened = Gleap.isOpened();
                if (!isOpened) Gleap.open();
                else Gleap.close();
                Gleap.showFeedbackButton(true);
              }}
            >
              {t('viewTitle', { ns: 'common' })}
            </WBLinkButton>
          }
        >
          <WBListItemText>{t('chatTitle', { ns: 'settings' })}</WBListItemText>
        </WBListItem>
        <WBListItem
          secondaryAction={
            <WBLink
              href={HELP_CENTER_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('viewTitle', { ns: 'common' })}
            </WBLink>
          }
        >
          <WBListItemText>
            {t('helpCenterTitle', { ns: 'settings' })}
          </WBListItemText>
        </WBListItem>
        <WBListItem
          secondaryAction={
            <WBLink
              href={ROADMAP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('viewTitle', { ns: 'common' })}
            </WBLink>
          }
        >
          <WBListItemText>
            {t('roadmapTitle', { ns: 'settings' })}
          </WBListItemText>
        </WBListItem>

        <WBListItem
          secondaryAction={
            <WBLink
              href={PRIVACY_POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('viewTitle', { ns: 'common' })}
            </WBLink>
          }
        >
          <WBListItemText>
            {t('privacyPolicyTitle', { ns: 'common' })}
          </WBListItemText>
        </WBListItem>

        <WBListItem
          secondaryAction={
            <WBLink
              href={TERMS_CONDITIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('viewTitle', { ns: 'common' })}
            </WBLink>
          }
        >
          <WBListItemText>
            {t('termsConditionsTitle', { ns: 'common' })}
          </WBListItemText>
        </WBListItem>
      </WBList>
      {/*<WBBox>*/}
      {/*  <WBLink href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">*/}
      {/*    {t('privacyPolicyTitle', { ns: 'common' })}*/}
      {/*  </WBLink>*/}
      {/*  <br/>*/}
      {/*  <WBLink href={TERMS_CONDITIONS_URL} target="_blank" rel="noopener noreferrer">*/}
      {/*    {t('termsConditionsTitle', { ns: 'common' })}*/}
      {/*  </WBLink>*/}
      {/*</WBBox>*/}
    </WBFlex>
  );
};

export default Support;
