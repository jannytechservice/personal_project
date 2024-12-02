import React from 'react';
import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { Task, TaskPaymentStatus, TaskType } from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBChip,
  WBFlex,
  WBGrid,
  WBLink,
  WBSkeleton,
  WBTypography,
  useSnackbar,
} from '@admiin-com/ds-web';
import { Backdrop, Paper, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';

import { frontDateFromBackendDate } from '@admiin-com/ds-common';
import PaymentDetail from '../PaymentDetail/PaymentDetail';
import { useUpdateTask } from '../../hooks/useUpdateTask/useUpdateTask';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';
import TaskPdfSignature from '../TaskPdfSignature/TaskPdfSignature';
import { isPaidTask } from '../../helpers/tasks';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import { usePaymentContext } from '../PaymentContainer/PaymentContainer';
import { useTaskToContactName } from '../../hooks/useTaskToName/useTaskToName';
import PdfPotraitContainer from '../PdfPotraitContainer/PdfPotraitContainer';

interface TaskDetailCardProps {
  task: Task | null;
}

export function TaskDetailCard({ task }: TaskDetailCardProps) {
  const { contactName, contactLoading } = useTaskToContactName(task);

  const isPaid = isPaidTask(task);
  const theme = useTheme();
  const entityId = useCurrentEntityId();
  const { t } = useTranslation();
  const taskboxContext = useTaskBoxContext();
  const { multiSelect, directionFilter } = taskboxContext ?? {};

  const [updateTask] = useUpdateTask(task);

  const showSnackbar = useSnackbar();

  const updateTaskStatus = async (paymentStatus: TaskPaymentStatus) => {
    if (task) {
      try {
        const updatedTaskData = await updateTask({
          variables: {
            input: {
              id: task.id,
              entityId,
              paymentStatus,
              dueAt: task.dueAt,
            },
          },
        });
        const updatedTask = {
          ...updatedTaskData.data?.updateTask,
          amount: updatedTaskData.data?.updateTask.amount / 100,
        };
        if (updatedTask) {
          multiSelect(updatedTask, true);
        }
      } catch (error: any) {
        showSnackbar({
          message: error.message,
          severity: 'error',
        });
      }
    }
  };

  const amount = task?.amount ?? 0;
  const paymentContext = usePaymentContext();
  const { getFees } = paymentContext ?? {};
  const { totalAmount: payableAmount = 0 } = getFees ? getFees([task]) : {};
  const totalAmount = isPaid ? payableAmount : amount;

  if (!task) return null;
  return (
    <WBBox>
      <Paper
        sx={{
          px: [2, 3, 6],
          py: [2, 4, 6],
          mb: 3,
          position: 'relative', // This makes the Box a new positioning context for the Backdrop
          fontWeight: 'bold',
          fontSize: 'body2.fontSize',
          ...{
            boxShadow: `0 41px 45px -35.5px ${
              isPaid ? theme.palette.success.main : theme.palette.common.black
            }`,
          },
          bgcolor: theme.palette.background.default,
        }}
      >
        <WBFlex justifyContent={contactName ? 'space-between' : 'end'}>
          <WBFlex
            justifyContent={'space-between'}
            alignItems={['start', 'start', 'center']}
            flexDirection={['column', 'column', 'row']}
            width={'100%'}
          >
            <WBFlex justifyContent={'center'} alignItems={'center'}>
              {contactName ? (
                <WBS3Avatar
                  sx={{ width: '52px', height: '52px' }}
                  companyName={contactName}
                  fontSize="h6.fontSize"
                />
              ) : contactLoading || task === null ? (
                <WBSkeleton variant="circular" width={40} height={40} />
              ) : null}
              {contactName ? (
                <WBBox ml={3}>
                  <WBTypography
                    fontSize={{ xs: 'h5.fontSize', sm: 'h3.fontSize' }}
                    fontWeight="bold"
                    mb={0}
                  >
                    {contactName}
                  </WBTypography>
                </WBBox>
              ) : contactLoading ? (
                <WBSkeleton width={80}></WBSkeleton>
              ) : null}
            </WBFlex>
            <WBFlex sx={{ flexGrow: 1 }} justifyContent={'end'}>
              {directionFilter !== 'SENDING' && (
                <PaymentDetail task={task} type="Type">
                  <PaymentDetail.Selector
                    bgcolor="#3d47ff"
                    fontColor={theme.palette.text.primary}
                    disabled={task.type === TaskType.SIGN_ONLY}
                  />
                </PaymentDetail>
              )}
            </WBFlex>
          </WBFlex>
        </WBFlex>
        <WBGrid container mt={2} spacing={2}>
          <WBGrid xs={6}>
            <WBBox mr={2} flex={1} width={'100%'}>
              <WBFlex
                mt={{ xs: 1, sm: 0 }}
                flexDirection={['column', 'column', 'row']}
              >
                <WBBox flex={1}>
                  <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
                    {t('dueAt', { ns: 'taskbox' })}
                  </WBTypography>
                  <WBTypography
                    fontWeight={'inherit'}
                    fontSize={'inherit'}
                    bgcolor={'background.paper'}
                    p={1}
                    px={2}
                    mt={2}
                  >
                    {frontDateFromBackendDate(task.dueAt)}
                  </WBTypography>
                </WBBox>

                {task.reference && (
                  <WBBox ml={[0, 0, 2, 3]} mt={[2, 2, 0]} flex={1}>
                    <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
                      {t('reference', { ns: 'taskbox' })}
                    </WBTypography>
                    {/* {task.paymentFrequency ? ( */}
                    <WBTypography
                      noWrap
                      fontWeight={'inherit'}
                      fontSize={'inherit'}
                      bgcolor={'background.paper'}
                      p={1}
                      px={2}
                      mt={2}
                    >
                      {task.reference}
                    </WBTypography>
                    {/* ) : null} */}
                  </WBBox>
                )}
              </WBFlex>

              <WBBox mt={{ xs: 3, sm: 5 }}>
                {task.type === TaskType.SIGN_ONLY ? (
                  t('signatureRequired', { ns: 'taskbox' })
                ) : (
                  <>
                    <WBTypography fontWeight={'inherit'}>
                      {t('totalAmount', { ns: 'taskbox' })}
                    </WBTypography>
                    <CurrencyNumber
                      number={totalAmount}
                      fontSize={{ xs: 'h3.fontSize', sm: 'h2.fontSize' }}
                    />
                  </>
                )}
              </WBBox>
            </WBBox>
          </WBGrid>
          <WBGrid xs={6} sx={{ display: 'flex', justifyContent: 'end' }}>
            <WBFlex
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={['center']}
            >
              <WBBox
                sx={{
                  width: ['100px', '150px'],
                }}
                mb={3}
              >
                <PdfPotraitContainer>
                  <TaskPdfSignature task={task} />
                </PdfPotraitContainer>
              </WBBox>
              {task.type !== TaskType.SIGN_ONLY && (
                <WBLink
                  color={'text.primary'}
                  underline="always"
                  variant="body2"
                  fontWeight={'bold'}
                  onClick={() =>
                    updateTaskStatus(TaskPaymentStatus.MARKED_AS_PAID)
                  }
                >
                  {t('markAsPaid', { ns: 'taskbox' })}
                </WBLink>
              )}
            </WBFlex>
          </WBGrid>
        </WBGrid>
        <Backdrop
          sx={{
            color: '#FFFFFF',
            position: 'absolute', // Position it absolutely within the Box
            top: 0, // Align to the top of the Box
            left: 0, // Align to the left of the Box
            width: '100%', // Cover the entire width of the Box
            height: '100%', // Cover the entire height of the Box
            zIndex: (theme) => theme.zIndex.drawer + 1,
            flexDirection: 'column',
          }}
          open={isPaid}
        >
          <WBChip
            component="span"
            label={t('paid', { ns: 'taskbox' })}
            color={'error'}
            size="medium"
            sx={{
              textTransform: 'uppercase',
              fontWeight: 'bold',
              p: 2,
              mt: 1,
              color: 'black',
              backgroundColor: 'success.main',
            }}
          />
          {task.paymentStatus === TaskPaymentStatus.MARKED_AS_PAID && (
            <WBLink
              underline="always"
              variant="body2"
              color={'common.white'}
              onClick={() =>
                updateTaskStatus(TaskPaymentStatus.PENDING_PAYMENT)
              }
            >
              {t('undo', { ns: 'taskbox' })}
            </WBLink>
          )}
        </Backdrop>
      </Paper>
    </WBBox>
  );
}
