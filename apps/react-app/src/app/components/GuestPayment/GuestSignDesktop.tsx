import { TaskGuest } from '@admiin-com/ds-graphql';
import { useDocumentUrl } from '../../hooks/useDocumentUrl/useDocumentUrl';
import { styled } from '@mui/material';
import {
  WBBox,
  WBButton,
  WBFlex,
  WBIconButton,
  WBSvgIcon,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import PdfSign from '../PdfSign/PdfSign';
import { getName } from '../../helpers/contacts';
import { TextFormField } from '../ESignature/SignatureForm';
import { DateTime } from 'luxon';
import { getDocumentName, getDueDateFromTask } from '../../helpers/tasks';
import { useTranslation } from 'react-i18next';
import { transform } from 'lodash';
import { usePdfScroll } from '../PdfSign/PdfScrollContext';
import { downloadPdf } from '../../helpers/signature';
import React from 'react';
import PageSelector from '../PageSelector/PageSelector';
import OnboardingMessage from '../InvoiceCreateForm/OnboardingMessage';

interface Props {
  taskGuest: TaskGuest;
}
export const GuestSignDesktop = (props: Props) => {
  const documentUrl = useDocumentUrl(props.taskGuest);
  const { t } = useTranslation();
  const { ref, submitted } = usePdfScroll();
  const [page, setPage] = React.useState<'Sign' | 'Confirm'>('Sign');
  const downloadDocument = async () => {
    try {
      await downloadPdf(ref, getDocumentName(props.taskGuest));
    } catch (err) {
      console.log('ERROR CREATING DOCUMENT URL', err);
    }
  };

  React.useEffect(() => {
    if (submitted) {
      setPage('Confirm');
    }
  }, [submitted]);

  return (
    <PageSelector current={page}>
      <PageSelector.Page value={'Confirm'}>
        <OnboardingMessage
          title={t('documentSigned', { ns: 'taskbox' })}
          description={t('documentSignedDescription', {
            ns: 'taskbox',
          })}
          onGetStarted={() => {
            downloadDocument();
          }}
          buttonTitle={t('downloadDocument', { ns: 'taskbox' })}
        />
      </PageSelector.Page>
      <PageSelector.Page value={'Sign'}>
        <>
          <Header>
            <TextFormField
              label={t('from', { ns: 'taskbox' })}
              value={getName(props.taskGuest.fromEntity)}
            />

            <TextFormField
              label={t('to', { ns: 'taskbox' })}
              value={
                getName(props.taskGuest.toContact) ||
                props.taskGuest?.to?.name ||
                ''
              }
            />
            <TextFormField
              label={t('dueAt', { ns: 'taskbox' })}
              value={DateTime.fromISO(
                getDueDateFromTask(props.taskGuest as any) ?? ''
              ).toLocaleString(DateTime.DATE_SHORT)}
            />
          </Header>
          <WBFlex gap={3} width={'100%'} mt={5} px={4} flex={1}>
            <WBFlex flex={1}>
              <WBFlex flexDirection={'column'} gap={3} width={'100%'}>
                <Section>
                  <StyledIconButton onClick={downloadDocument}>
                    <WBSvgIcon fontSize="small">{DownloadIcon}</WBSvgIcon>
                  </StyledIconButton>
                  {/* <StyledIconButton>
                <WBSvgIcon fontSize="small">{EmailIcon}</WBSvgIcon>
              </StyledIconButton>
              <StyledIconButton>
                <WBSvgIcon fontSize="small">{ShareIcon}</WBSvgIcon>
              </StyledIconButton> */}
                </Section>
                {/* <Section flexDirection={'column'}>
              <WBTypography fontWeight={'bold'}>
                {t('leaveComments', { ns: 'taskbox' })}
              </WBTypography>
              <WBTypography>
                {t('leaveCommentsDescription', { ns: 'taskbox' })}
              </WBTypography>
              <WBTextField multiline rows={5} variant="filled" />
            </Section> */}
              </WBFlex>
            </WBFlex>
            <PdfContainer maxHeight={'100%'}>
              {documentUrl && (
                <PdfSign
                  ref={ref}
                  height={650}
                  documentUrl={documentUrl}
                  annotations={props.taskGuest.annotations}
                />
              )}
            </PdfContainer>
          </WBFlex>
        </>
      </PageSelector.Page>
    </PageSelector>
  );
};

export const DownloadIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM0 16V11H2V14H14V11H16V16H0Z"
      fill="#8C52FF"
    />
  </svg>
);

export const EmailIcon = (
  <svg
    width="20"
    height="16"
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM17.6 4.25L10.53 8.67C10.21 8.87 9.79 8.87 9.47 8.67L2.4 4.25C2.29973 4.19371 2.21192 4.11766 2.14189 4.02645C2.07186 3.93525 2.02106 3.83078 1.99258 3.71937C1.96409 3.60796 1.9585 3.49194 1.97616 3.37831C1.99381 3.26468 2.03434 3.15581 2.09528 3.0583C2.15623 2.96079 2.23632 2.87666 2.33073 2.811C2.42513 2.74533 2.53187 2.69951 2.6445 2.6763C2.75712 2.65309 2.87328 2.65297 2.98595 2.67595C3.09863 2.69893 3.20546 2.74453 3.3 2.81L10 7L16.7 2.81C16.7945 2.74453 16.9014 2.69893 17.014 2.67595C17.1267 2.65297 17.2429 2.65309 17.3555 2.6763C17.4681 2.69951 17.5749 2.74533 17.6693 2.811C17.7637 2.87666 17.8438 2.96079 17.9047 3.0583C17.9657 3.15581 18.0062 3.26468 18.0238 3.37831C18.0415 3.49194 18.0359 3.60796 18.0074 3.71937C17.9789 3.83078 17.9281 3.93525 17.8581 4.02645C17.7881 4.11766 17.7003 4.19371 17.6 4.25Z"
      fill="#8C52FF"
    />
  </svg>
);

export const ShareIcon = (
  <svg
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 20C14.1667 20 13.4583 19.7083 12.875 19.125C12.2917 18.5417 12 17.8333 12 17C12 16.9 12.025 16.6667 12.075 16.3L5.05 12.2C4.78333 12.45 4.475 12.646 4.125 12.788C3.775 12.93 3.4 13.0007 3 13C2.16667 13 1.45833 12.7083 0.875 12.125C0.291667 11.5417 0 10.8333 0 10C0 9.16667 0.291667 8.45833 0.875 7.875C1.45833 7.29167 2.16667 7 3 7C3.4 7 3.775 7.071 4.125 7.213C4.475 7.355 4.78333 7.55067 5.05 7.8L12.075 3.7C12.0417 3.58333 12.021 3.471 12.013 3.363C12.005 3.255 12.0007 3.134 12 3C12 2.16667 12.2917 1.45833 12.875 0.875C13.4583 0.291667 14.1667 0 15 0C15.8333 0 16.5417 0.291667 17.125 0.875C17.7083 1.45833 18 2.16667 18 3C18 3.83333 17.7083 4.54167 17.125 5.125C16.5417 5.70833 15.8333 6 15 6C14.6 6 14.225 5.929 13.875 5.787C13.525 5.645 13.2167 5.44933 12.95 5.2L5.925 9.3C5.95833 9.41667 5.97933 9.52933 5.988 9.638C5.99667 9.74667 6.00067 9.86733 6 10C5.99933 10.1327 5.99533 10.2537 5.988 10.363C5.98067 10.4723 5.95967 10.5847 5.925 10.7L12.95 14.8C13.2167 14.55 13.525 14.3543 13.875 14.213C14.225 14.0717 14.6 14.0007 15 14C15.8333 14 16.5417 14.2917 17.125 14.875C17.7083 15.4583 18 16.1667 18 17C18 17.8333 17.7083 18.5417 17.125 19.125C16.5417 19.7083 15.8333 20 15 20Z"
      fill="#8C52FF"
    />
  </svg>
);

const Section = styled(WBFlex)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3, 4),
  gap: theme.spacing(2),
}));

const StyledIconButton = styled(WBBox)(({ theme }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  border: `1px solid ${theme.palette.primary.main}`,
}));

const PdfContainer = styled(WBFlex)(({ theme }) => ({
  width: '100%',
  flex: 3,
  position: 'relative',
  maxHeight: '100%',
  flexDirection: 'row',
}));

const Header = styled(WBFlex)(({ theme }) => ({
  background: theme.palette.background.paper,
  width: '100%',
  padding: theme.spacing(3, 10),
  gap: theme.spacing(3),
}));

const FlexSpacer = styled(WBBox)({
  flex: 1,
});