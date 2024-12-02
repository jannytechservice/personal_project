import React from 'react';
import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import {
  WBBox,
  WBFlex,
  WBIconButton,
  WBMenu,
  WBMenuItem,
  WBSkeleton,
  WBStack,
  WBSvgIcon,
  WBTypography,
  useSnackbar,
  WBTooltip,
} from '@admiin-com/ds-web';
import DotIcon from '../../../assets/icons/tripledot.svg';
import ChatIcon from '../../../assets/icons/chat-icon.svg';
import { Paper, Skeleton, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';

import { frontDateFromBackendDate } from '@admiin-com/ds-common';
import { TaskDraft } from './TaskDraft';
import { BreakDownContainer } from '../../components/BreakDownContainer/BreakDownContainer';
import { useTaskBoxContext } from '../TaskBox/TaskBox';
import TaskInstallmentsTimeline from '../../components/TaskInstallmentsTimeline/TaskInstallmentsTimeline';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';
import TaskPdfSignature from '../../components/TaskPdfSignature/TaskPdfSignature';
import {
  TaskDirection,
  TaskPaymentStatus,
  TaskStatus,
  TaskType,
} from '@admiin-com/ds-graphql';
import { downloadPdf } from '../../helpers/signature';
import { useTaskToContactName } from '../../hooks/useTaskToName/useTaskToName';
import { useUpdateTask } from '../../hooks/useUpdateTask/useUpdateTask';
import TaskBreakDownBody from '../../components/TaskBreakDownBody/TaskBreakDownBody';
import { useSentTaskOptions } from '../../hooks/useSentTaskOptions/useSentTaskOptions';
import BackModal from '../../components/BackModal/BackModal';
import PdfPotraitContainer from '../../components/PdfPotraitContainer/PdfPotraitContainer';
import ConfirmationDlg from '../../components/ConfirmationDlg/ConfirmationDlg';
import { getDocumentName } from '../../helpers/tasks';

export default function TaskDetail() {
  const taskboxContext = useTaskBoxContext();
  const {
    selectedTask: task,
    setSelectedTask,
    loading,
    pdfSignatureRef,
  } = taskboxContext ?? {};
  const { contactName, contactLoading } = useTaskToContactName(task);

  const {
    isInstallments,
    isAchivable,
    isPayable,
    isCreatedBy,
    isDownloadable,
  } = useTaskProperty(task);
  const theme = useTheme();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [updateTask, { loading: archiving }] = useUpdateTask(task);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const showSnackbar = useSnackbar();
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  const handleArchiveTask = async () => {
    handleMenuClose();
    if (task) {
      try {
        await updateTask({
          variables: {
            input: {
              id: task.id,
              entityId: task.entityId,
              status: TaskStatus.ARCHIVED,
            },
          },
        });
        showSnackbar({
          message: t('taskArchived', { ns: 'taskbox' }),
          severity: 'success',
          horizontal: 'center',
          vertical: 'bottom',
        });
        setSelectedTask(null);
      } catch (error: any) {
        showSnackbar({
          title: t('taskArchivedFailed', { ns: 'taskbox' }),
          message: error?.message,
          severity: 'error',
          horizontal: 'center',
          vertical: 'bottom',
        });
      }
    }
  };

  const handleMarkAsPaidTask = async () => {
    handleMenuClose();
    if (task) {
      try {
        await updateTask({
          variables: {
            input: {
              id: task.id,
              entityId: task.entityId,
              paymentStatus: TaskPaymentStatus.MARKED_AS_PAID,
            },
          },
        });
        // setStatusFilter('Completed');
        showSnackbar({
          message: t('markAsPaidSuccess', { ns: 'taskbox' }),
          severity: 'success',
          horizontal: 'center',
          vertical: 'bottom',
        });
      } catch (error: any) {
        showSnackbar({
          title: t('markAsPaidFailed', { ns: 'taskbox' }),
          message: error?.message,
          severity: 'error',
          horizontal: 'center',
          vertical: 'bottom',
        });
      }
    }
  };

  const downloadDocument = () => {
    downloadPdf(pdfSignatureRef, getDocumentName(task));
  };

  // const amount = task?.amount ?? 0;
  // const paymentContext = usePaymentContext();
  // const { getFees } = paymentContext ?? {};
  // const { totalAmount: payableAmount = 0 } = getFees ? getFees([task]) : {};
  // const totalAmount = isPaid ? payableAmount : amount;

  const noOptions =
    task?.direction === TaskDirection.RECEIVING &&
    !(
      isAchivable ||
      isDownloadable ||
      (isCreatedBy && task?.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT)
    );

  const { handleCopyTaskLink, QRCodeComponent } = useSentTaskOptions({ task });
  const handleCopyLink = async () => {
    handleCopyTaskLink();
    handleMenuClose();
  };
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  return (
    <WBFlex
      height="100%"
      //minHeight={task?.documents?.length > 0 ? '100vh' : undefined}
      mt={3}
      key={task?.id}
      flexDirection={'column'}
    >
      <WBFlex
        height="100%"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <WBFlex justifyContent={'center'} alignItems={'center'}>
          {contactName ? (
            <WBS3Avatar
              sx={{ width: '52px', height: '52px' }}
              companyName={contactName}
              fontSize="h6.fontSize"
            />
          ) : contactLoading || task === null ? (
            <WBSkeleton
              animation={loading ? 'wave' : false}
              variant="rectangular"
              width={52}
              height={52}
            />
          ) : null}
          <WBBox ml={3}>
            <>
              {contactName && task ? (
                <WBTypography
                  fontSize={{ xs: 'h5.fontSize', sm: 'h3.fontSize' }}
                  fontWeight="bold"
                  mb={0}
                >
                  {contactName}
                </WBTypography>
              ) : (
                <WBSkeleton
                  sx={{ borderRadius: '10px' }}
                  width={100}
                  animation={loading ? 'wave' : false}
                  height={25}
                ></WBSkeleton>
              )}
              {contactName && task ? (
                <WBTypography fontWeight={'medium'}>
                  {task?.reference}
                </WBTypography>
              ) : (
                <WBSkeleton
                  sx={{ borderRadius: '10px' }}
                  width={150}
                  height={25}
                  animation={loading ? 'wave' : false}
                />
              )}
            </>
          </WBBox>
        </WBFlex>
        {task ? (
          <WBStack
            direction={'row'}
            spacing={1}
            sx={{
              position: { xs: 'absolute', lg: 'relative' },
              right: { xs: '24px', md: '64px', lg: '0px' },
              top: { xs: '32px', lg: '0px' },
              // ...(contact
              //   ? { mt: { xs: -32, lg: 0 }, ml: { xs: -14, lg: 0 } }
              //   : { mt: { xs: -10, lg: 0 }, ml: { xs: -6, lg: 0 } }),
            }}
          >
            <WBTooltip title={t('chatComingSoon', { ns: 'taskbox' })}>
              <WBBox>
                <WBIconButton disabled>
                  <WBSvgIcon
                    fontSize="small"
                    color={theme.palette.text.primary}
                  >
                    <ChatIcon />
                  </WBSvgIcon>
                </WBIconButton>
              </WBBox>
            </WBTooltip>

            <WBIconButton disabled={noOptions} onClick={handleOpenMenu}>
              <WBSvgIcon fontSize="small" color={theme.palette.text.primary}>
                <DotIcon />
              </WBSvgIcon>
            </WBIconButton>
          </WBStack>
        ) : null}
      </WBFlex>
      {task &&
      task.payments &&
      //(isInstallments || task.numberOfPayments > 1) ? (
      (isInstallments || task?.payments?.items?.length >= 1) ? (
        <TaskInstallmentsTimeline task={task} />
      ) : null}
      <WBBox
        sx={{
          mt: { xs: 3, sm: 4 },
          mb: 5,
        }}
      >
        {task ? (
          <Paper
            sx={{
              p: { xs: 2, md: 3, lg: 3, xl: 9 },
              fontWeight: 'bold',
              fontSize: 'body2.fontSize',
              bgcolor: theme.palette.background.default,
              boxShadow: '0 41px 45px -35.5px #636363',
            }}
          >
            <BreakDownContainer>
              <WBFlex
                justifyContent={'space-between'}
                flexDirection={['column', 'column', 'row']}
                alignItems={'start'}
                width={'100%'}
              >
                <WBFlex
                  mt={{ xs: 1, sm: 0 }}
                  mr={2}
                  alignSelf={{ xs: 'start', md: 'end' }}
                >
                  <WBBox>
                    <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
                      {t('dueAt', { ns: 'taskbox' })}
                    </WBTypography>
                    <WBTypography
                      fontWeight={'inherit'}
                      fontSize={'inherit'}
                      bgcolor={'background.paper'}
                      p={1}
                      px={2}
                      noWrap
                      mt={2}
                    >
                      {frontDateFromBackendDate(task.dueAt)}
                    </WBTypography>
                  </WBBox>

                  {isPayable ? (
                    <WBBox ml={{ xs: 2 }}>
                      <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
                        {t('frequency', { ns: 'taskbox' })}
                      </WBTypography>
                      {task.paymentFrequency ? (
                        <WBTypography
                          noWrap
                          fontWeight={'inherit'}
                          fontSize={'inherit'}
                          bgcolor={'background.paper'}
                          p={1}
                          px={2}
                          mt={2}
                        >
                          {t(task.paymentFrequency, { ns: 'taskbox' })}{' '}
                          {task.numberOfPayments
                            ? `(${task.numberOfPayments})`
                            : ''}
                        </WBTypography>
                      ) : null}
                    </WBBox>
                  ) : null}
                </WBFlex>
                {isPayable ? (
                  <WBBox
                    ml={2}
                    mt={{ xs: 3, md: 0, textAlign: { xs: 'start', md: 'end' } }}
                  >
                    <WBTypography
                      textAlign={{ xs: 'start', md: 'end' }}
                      fontWeight={'inherit'}
                      textTransform={'uppercase'}
                    >
                      {t('billAmount', { ns: 'taskbox' })}
                    </WBTypography>
                    <CurrencyNumber
                      sup={false}
                      number={task.amount}
                      textAlign={{ xs: 'start', md: 'end' }}
                      fontSize={{ xs: 'h2.fontSize' }}
                    />
                    {/*{isPaid && (*/}
                    {/*  <WBFlex*/}
                    {/*    justifyContent={{ xs: 'start', md: 'end' }}*/}
                    {/*    width={'100%'}*/}
                    {/*  >*/}
                    {/*    <BreakDownContainer.Link*/}
                    {/*      title={t('showBreakDown', {*/}
                    {/*        ns: 'taskbox',*/}
                    {/*      })}*/}
                    {/*    />*/}
                    {/*  </WBFlex>*/}
                    {/*)}*/}
                  </WBBox>
                ) : null}
              </WBFlex>
              <BreakDownContainer.Body>
                <WBBox mt={3}>
                  <TaskBreakDownBody task={task} />
                </WBBox>
              </BreakDownContainer.Body>
              <WBBox mt={4}>
                {task?.documents?.length > 0 && (
                  <PdfPotraitContainer>
                    <TaskPdfSignature task={task} />
                  </PdfPotraitContainer>
                )}
              </WBBox>
              {/* <TaskPdfSignature task={task} /> */}
            </BreakDownContainer>
          </Paper>
        ) : (
          <WBBox
            height={'800px'}
            width={'100%'}
            variant="rectangular"
            sx={{
              bgcolor: theme.palette.background.default,
              position: 'relative', // Add this to make positioning absolute elements inside easier
            }}
          >
            <Skeleton
              animation={loading ? 'wave' : false}
              variant="rectangular"
              width="100%"
              height="100%"
            />
            {!loading && (
              <WBFlex
                width={'100%'}
                height={'100%'}
                justifyContent={'center'}
                alignItems={'center'}
                sx={{
                  position: 'absolute', // Make the text container absolute
                  top: 0,
                  left: 0,
                  px: 4,
                }}
              >
                <WBTypography textAlign={'center'}>
                  {t('noTaskDetailTitle', { ns: 'taskbox' })}
                </WBTypography>
              </WBFlex>
            )}
          </WBBox>
        )}
      </WBBox>
      {/* task.status===TaskStatus.DRAFT? */}
      {task ? (
        <>
          <TaskDraft task={task} />
          {/* :null */}
          <WBMenu
            sx={{ mt: -2 }}
            id="customized-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            {/* Todo: check if user is entity owner and bill is in status(TBC)*/}
            {isAchivable ? (
              <WBMenuItem
                onClick={() => {
                  setConfirmDialogOpen(true);
                  handleMenuClose();
                }}
                sx={{
                  ...theme.typography.body2,
                  fontWeight: 'bold',
                  color: 'error.main',
                }}
              >
                {t('archiveTask', { ns: 'taskbox' })}
              </WBMenuItem>
            ) : null}
            {isDownloadable && (
              <WBMenuItem
                onClick={downloadDocument}
                sx={{
                  ...theme.typography.body2,
                }}
              >
                {t('download', { ns: 'taskbox' })}
              </WBMenuItem>
            )}
            {isCreatedBy &&
              task?.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT && (
                <WBMenuItem
                  onClick={handleMarkAsPaidTask}
                  sx={{
                    ...theme.typography.body2,
                  }}
                >
                  {t('markAsPaid', { ns: 'taskbox' })}
                </WBMenuItem>
              )}
            {/*{task.direction === TaskDirection.SENDING && (*/}
            {/*  // !isInstallmentTask(task) &&*/}
            {/*  <WBMenuItem*/}
            {/*    onClick={handleCopyLink}*/}
            {/*    sx={{*/}
            {/*      ...theme.typography.body2,*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    {t(*/}
            {/*      task.type !== TaskType.SIGN_ONLY*/}
            {/*        ? 'copyLinkToPayment'*/}
            {/*        : 'copyLinkToDocument',*/}
            {/*      { ns: 'taskbox' }*/}
            {/*    )}*/}
            {/*  </WBMenuItem>*/}
            {/*)}*/}
            {/*{task.direction === TaskDirection.SENDING && (*/}
            {/*  // !isInstallmentTask(task) &&*/}
            {/*  <WBMenuItem*/}
            {/*    onClick={() => {*/}
            {/*      setModalOpen(true);*/}
            {/*      handleMenuClose();*/}
            {/*    }}*/}
            {/*    sx={{*/}
            {/*      ...theme.typography.body2,*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    {t('showQRCode', { ns: 'taskbox' })}*/}
            {/*  </WBMenuItem>*/}
            {/*)}*/}
          </WBMenu>
        </>
      ) : null}
      <ConfirmationDlg
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        title={t('archiveTask', { ns: 'taskbox' })}
        onOK={handleArchiveTask}
        loading={archiving}
      >
        <WBTypography variant="body1" mt={1}>
          {t('archiveTaskConfirmation', { ns: 'taskbox' })}
        </WBTypography>
      </ConfirmationDlg>
      <BackModal
        height={'auto'}
        open={modalOpen}
        fullWidth={false}
        onClose={() => setModalOpen(false)}
      >
        {QRCodeComponent}
      </BackModal>
    </WBFlex>
  );
}
