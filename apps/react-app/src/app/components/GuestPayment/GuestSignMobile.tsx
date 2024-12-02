import { TaskGuest } from '@admiin-com/ds-graphql';
import { WBBox, WBButton, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getName } from '../../helpers/contacts';
import { DateTime } from 'luxon';
import { getDocumentName, getDueDateFromTask } from '../../helpers/tasks';
import OnboardingMessage from '../InvoiceCreateForm/OnboardingMessage';
import React from 'react';
import { BottomDrawer } from '../ESignature/BottomDrawer';
import PdfSign from '../PdfSign/PdfSign';
import { useDocumentUrl } from '../../hooks/useDocumentUrl/useDocumentUrl';
import { SignatureFieldMobileContainer } from '../ESignature/DragDropField';
import { DownloadIcon, EmailIcon, ShareIcon } from './GuestSignDesktop';
import { usePdfScroll } from '../PdfSign/PdfScrollContext';
import { downloadPdf } from '../../helpers/signature';
import { isCompositeComponent } from 'react-dom/test-utils';
import PageSelector from '../PageSelector/PageSelector';

interface Props {
  taskGuest: TaskGuest;
}
export const GuestSignMobile = (props: Props) => {
  const { t } = useTranslation();
  const documentUrl = useDocumentUrl(props.taskGuest);

  const [started, setStarted] = React.useState<'Start' | 'Sign' | 'Finish'>(
    'Start'
  );
  const {
    ref,
    isFinish,
    disableNextButton,
    totalSignatures,
    handleMoveIndicator: handleNext,
    completed,
    submitted,
  } = usePdfScroll();

  React.useEffect(() => {
    if (completed || submitted) {
      setStarted('Finish');
    }
  }, [completed, submitted]);
  const downloadDocument = async () => {
    try {
      await downloadPdf(ref, getDocumentName(props.taskGuest));
    } catch (err) {
      console.log('ERROR CREATING DOCUMENT URL', err);
    }
  };

  return (
    <>
      <Header>
        <WBTypography variant="body2">
          <b>{t('from', { ns: 'taskbox' })}</b>&nbsp;
          {getName(props.taskGuest.fromEntity)}
        </WBTypography>

        <WBTypography variant="body2">
          <b>{t('to', { ns: 'taskbox' })}</b>&nbsp;
          {getName(props.taskGuest.toContact) ||
            props.taskGuest?.to?.name ||
            ''}
        </WBTypography>

        <WBTypography variant="body2">
          <b>{t('dueAt', { ns: 'taskbox' })}</b>&nbsp;
          {DateTime.fromISO(
            getDueDateFromTask(props.taskGuest as any) ?? ''
          ).toLocaleString(DateTime.DATE_SHORT)}
        </WBTypography>
      </Header>
      <WBBox p={2} height="100%">
        <PageSelector current={started}>
          <PageSelector.Page value="Start">
            <OnboardingMessage
              title={t('guestSignTitle', { ns: 'taskbox' })}
              description={t('guestSignDescription', {
                name: getName(props.taskGuest.fromEntity),
                ns: 'taskbox',
                number: totalSignatures,
              })}
              onGetStarted={() => {
                setStarted('Sign');
              }}
              buttonTitle={t('start', { ns: 'taskbox' })}
            />
          </PageSelector.Page>
          <PageSelector.Page value={'Sign'}>
            <>
              <Container>
                <RowContainer>
                  <PdfContainer>
                    <PdfSign
                      ref={ref}
                      height={'100%'}
                      documentUrl={documentUrl}
                      annotations={props.taskGuest.annotations}
                    />
                  </PdfContainer>
                </RowContainer>
              </Container>
              <BottomDrawer>
                <WBFlex
                  flexDirection={['column']}
                  p={1}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <WBFlex padding={2}>
                    <SignatureFieldMobileContainer
                      icon={DownloadIcon}
                      label={t('Download', { ns: 'taskbox' })}
                      onClick={(e: any) => {
                        downloadDocument();
                      }}
                    />
                    {/* <SignatureFieldMobileContainer
                    icon={EmailIcon}
                    label={t('Email', { ns: 'taskbox' })}
                    onClick={(e: any) => {
                      console.log('download');
                    }}
                  />
                  <SignatureFieldMobileContainer
                    icon={ShareIcon}
                    label={t('Share', { ns: 'taskbox' })}
                    onClick={(e: any) => {
                      console.log('download');
                    }}
                  /> */}
                  </WBFlex>
                  <WBFlex gap={3} justifyContent={'center'}>
                    <WBButton
                      fullWidth
                      variant="contained"
                      sx={{
                        px: 3,
                        flex: 1,
                        backgroundColor: completed
                          ? 'success.dark'
                          : 'primary.main',
                      }}
                      onClick={completed ? undefined : handleNext}
                      // color={completed ? "success" : "primary"}
                      disabled={disableNextButton}
                    >
                      {t(
                        completed
                          ? 'signed'
                          : isFinish
                          ? 'finishSignature'
                          : 'nextSignature',
                        {
                          ns: 'taskbox',
                        }
                      )}
                    </WBButton>
                  </WBFlex>
                </WBFlex>
              </BottomDrawer>
            </>
          </PageSelector.Page>
          <PageSelector.Page value={'Finish'}>
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
        </PageSelector>
      </WBBox>
    </>
  );
};

const Header = styled(WBFlex)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexDirection: 'column',
  background: theme.palette.background.paper,
  gap: theme.spacing(1),
  ...theme.typography.body2,
}));

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const Container = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  paddingBottom: theme.spacing(isSafari ? 46 : 35),
}));
const RowContainer = styled(WBFlex)(({ theme }) => ({
  gap: theme.spacing(2),
  flexDirection: 'column',
  flex: 1,
}));

const PdfContainer = styled(WBBox)(({ theme }) => ({
  flex: 1,
}));
