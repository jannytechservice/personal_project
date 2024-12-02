import {
  PaymentType,
  Task,
  TaskPaymentStatus,
  TaskStatus,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBButton,
  wbLoadingButtonPulse,
  WBStack,
  WBSvgIcon,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import { alpha, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AdmiinLogo from '../../../assets/icons/admiin.svg';
import {
  isPayableTask,
  isTaskScheduled,
  tasksSignPayLabel,
} from '../../helpers/tasks';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';
import {
  PaymentAPIStatus,
  PaymentDetailData,
  usePaymentContext,
  usePaymentContextDetail,
} from '../PaymentContainer/PaymentContainer';
import { Tooltip } from 'libs/design-system-web/src/lib/components/composites/Tooltip/Tooltip';

interface InitialSingleButtonProps {
  task: Task | null;
  tasks: Task[];
  onClick: () => void;
}

const InitialButton = ({ task, tasks, onClick }: InitialSingleButtonProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const payableTasks = task ? [task] : tasks;
  const {
    isScheduled,
    isInstallments,

    totalInstallments,
    paidInstallments,
    isPending,
    signatureRequiredTooltip,
    isDeclined,
    getTaskPendingSignatureStatus,
    scheduledDate,
    tooltip,
  } = useTaskProperty(task);
  const { paymentDetail, paymentDetails } = usePaymentContextDetail(task);

  const disabledButton = payableTasks.every(
    (task) =>
      task?.status === TaskStatus.COMPLETED ||
      (!isPayableTask(task) && getTaskPendingSignatureStatus(task)) ||
      (isTaskScheduled(task) &&
        paymentDetails.find(
          (detail: PaymentDetailData) => detail.task.id === task?.id
        )?.type !== PaymentType.PAY_NOW)
  );

  const scheduledColor = isDeclined
    ? theme.palette.error.main
    : theme.palette.warning.main;
  let label: any = tasksSignPayLabel(payableTasks);

  const isScheduling = payableTasks.every(
    (task) =>
      isPayableTask(task) &&
      paymentDetails.find(
        (detail: PaymentDetailData) => detail.task.id === task?.id
      )?.type === PaymentType.SCHEDULED
  );

  if (isScheduling) label = label.replace('PAY', 'SCHEDULE');

  return isPending && task ? (
    <WBTooltip
      title={t(
        task.paymentStatus === TaskPaymentStatus.PENDING_PAYID_TRANSFER
          ? 'pendingPayIDTransfer'
          : 'pendingPayToAgreement',
        { ns: 'taskbox' }
      )}
    >
      <WBButton
        sx={{
          textTransform: 'uppercase',
          px: { xs: 10, xl: 15 },
          bgcolor: 'action.disabled',
          color: 'text.primary',
          fontWeight: 'bold',
          borderRadius: '30px',
          boxShadow: {
            xs: `0 8.5px 7px -9.5px ${theme.palette.action.disabled}`,
            xl: 'none',
          },
          '&:hover': {
            bgcolor: 'action.disabled',
          },
        }}
      >
        {t(task.paymentStatus ?? '', { ns: 'taskbox' })}
      </WBButton>
    </WBTooltip>
  ) : task?.status === TaskStatus.COMPLETED ? (
    <WBButton
      sx={{
        textTransform: 'uppercase',
        px: { xs: 10, lg: 12, xl: 15 },
        bgcolor: 'success.main',
        color: 'black',
        fontWeight: 'bold',
        borderRadius: '30px',
        boxShadow: {
          xs: `0 8.5px 7px -9.5px ${theme.palette.success.main}`,
          xl: 'none',
        },
        '&:hover': {
          bgcolor: 'success.main',
        },
      }}
    >
      {t(label, { ns: 'taskbox' })}
    </WBButton>
  ) : task && paymentDetail?.type !== PaymentType.PAY_NOW && isScheduled ? (
    <WBTooltip title={tooltip}>
      <WBButton
        sx={{
          width: { xs: undefined, xl: '100%' },
          maxWidth: '300px',
          px: { xs: 8, sm: 8, md: 8, lg: 8, xl: 0 },
          bgcolor: scheduledColor,
          color: 'black',
          borderRadius: '30px',
          boxShadow: {
            xs: `0 8.5px 7px -9.5px ${scheduledColor}`,
            xl: 'none',
          },
          '&:hover': {
            bgcolor: scheduledColor,
          },
        }}
      >
        {isInstallments ? (
          <>
            {t('installment', { ns: 'taskbox' })}
            &nbsp;
            <b>{`${paidInstallments} / ${totalInstallments}`}</b>
          </>
        ) : (
          <>
            {t(scheduledDate === 0 ? 'paymentIs' : 'paymentIn', {
              ns: 'taskbox',
            })}
            &nbsp;
            <b>{`${
              scheduledDate !== 0
                ? t(scheduledDate === 1 ? 'day' : 'days', {
                    day: scheduledDate,
                    ns: 'taskbox',
                  })
                : t('today', { ns: 'taskbox' })
            }`}</b>
          </>
        )}
      </WBButton>
    </WBTooltip>
  ) : (
    /**TODO - update toolip text for disabled pay all case */
    <Tooltip
      title={
        disabledButton
          ? signatureRequiredTooltip
          : isDeclined
          ? t('retryDecliendPayments', { ns: 'taskbox' })
          : isInstallments
          ? t('payRemainingPayments', { ns: 'taskbox' })
          : ''
      }
    >
      <WBBox>
        <WBButton
          sx={{
            textTransform: 'uppercase',
            px: { xs: 10, lg: 10, xl: 10 },
            boxShadow: {
              xs: `0 8.5px 7px -9.5px ${theme.palette.primary.main}`,
              xl: 'none',
            },
          }}
          disabled={disabledButton}
          onClick={onClick}
        >
          <WBSvgIcon fontSize="small" sx={{ mr: 1 }}>
            <AdmiinLogo />
          </WBSvgIcon>
          {t(label, { ns: 'payment' })}
        </WBButton>
      </WBBox>
    </Tooltip>
  );
};

interface SubmittedButtonProps {
  status: PaymentAPIStatus;
}

const SubmittedButton = ({ status }: SubmittedButtonProps) => {
  const { t } = useTranslation();
  return (
    <WBBox
      sx={{
        borderRadius: '30px',
        p: 2,
        px: 4,
        bgcolor: status !== 'PAID' ? 'warning.main' : 'success.main',
      }}
    >
      <WBStack direction={'row'} alignItems={'center'} spacing={3}>
        <WBTypography variant="body1" fontWeight={'bold'} color="black">
          {t('signed', { ns: 'taskbox' })}
        </WBTypography>
        <WBStack direction={'row'} alignItems={'center'} spacing={1.5}>
          <WBBox
            sx={{
              width: '12px',
              height: '12px',
              borderWidth: '12px',
              borderRadius: '12px',
              bgcolor:
                status === 'PAID' || status === 'SIGNED' || status === 'PAYING'
                  ? '#5FC53C'
                  : '#CD953C',
              border: 'solid 6px #ecad46',
              borderColor:
                status === 'PAID' || status === 'SIGNED' || status === 'PAYING'
                  ? '#85EC62'
                  : '#ECAD46',
              boxSizing: 'initial',
            }}
          />
          <WBBox
            sx={{
              width: '12px',
              height: '12px',
              borderRadius: '12px',
              bgcolor:
                status === 'PAID'
                  ? alpha('#5FC53C', 0.5)
                  : status === 'SIGNED'
                  ? 'common.white'
                  : alpha('#CD953C', 0.5),
              animation:
                status === 'PENDING' || status === 'PAYING'
                  ? `${wbLoadingButtonPulse('#CD953C')} 2s 0s infinite`
                  : undefined,
            }}
          />
          <WBBox
            sx={{
              width: '12px',
              height: '12px',
              borderRadius: '12px',
              bgcolor:
                status === 'PAID'
                  ? alpha('#5FC53C', 0.5)
                  : status === 'SIGNED'
                  ? 'common.white'
                  : alpha('#CD953C', 0.5),
              animation:
                status === 'PENDING' || status === 'PAYING'
                  ? `${wbLoadingButtonPulse('#CD953C')} 2s 0.3s infinite`
                  : undefined,
            }}
          />
          <WBBox
            sx={{
              width: '12px',
              height: '12px',
              borderRadius: '12px',
              bgcolor: alpha(status === 'PAID' ? '#5FC53C' : '#CD953C', 0.5),
              animation:
                status === 'PENDING' || status === 'PAYING'
                  ? `${wbLoadingButtonPulse('#CD953C')} 2s 0.6s infinite`
                  : undefined,
            }}
          />
          <WBBox
            sx={{
              width: '12px',
              height: '12px',
              borderWidth: '12px',
              borderRadius: '12px',
              bgcolor: status === 'PAID' ? '#5FC53C' : '#CD953C',
              border: 'solid 6px #ecad46',
              borderColor: status === 'PAID' ? '#85EC62' : '#ECAD46',
              boxSizing: 'initial',
            }}
          />
        </WBStack>
        <WBTypography variant="body1" fontWeight={'bold'} color="black">
          {t('paid', { ns: 'taskbox' })}
        </WBTypography>
      </WBStack>
    </WBBox>
  );
};

interface PaymentSubmitButtonProps {
  tasks: Task[];
  task: Task | null;
}

const PaymentSubmitButton = ({ tasks, task }: PaymentSubmitButtonProps) => {
  const paymentContext = usePaymentContext();
  const { submitBills, paymentAPIStatus } = paymentContext ?? {};

  return paymentAPIStatus !== 'INITIAL' ? (
    <SubmittedButton status={paymentAPIStatus} />
  ) : (
    <InitialButton
      onClick={() => {
        submitBills(task ? [task] : tasks);
      }}
      task={task}
      tasks={tasks}
    />
  );
};

export default PaymentSubmitButton;
