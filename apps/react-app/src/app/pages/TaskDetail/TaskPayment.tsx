// Importing necessary libraries and components
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Theme,
  WBFlex,
  WBLink,
  WBStack,
  WBTypography,
  useTheme,
  wbGlow,
} from '@admiin-com/ds-web';
import { PaymentType, Task } from '@admiin-com/ds-graphql';
import {
  usePaymentContext,
  usePaymentContextDetail,
} from '../../components/PaymentContainer/PaymentContainer';
import { PaymentDetail } from '../../components/PaymentDetail/PaymentDetail';
import { useTaskBoxContext } from '../TaskBox/TaskBox';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';
import { isPayableTask, isSignableTask } from '../../helpers/tasks';
import TaskBreakDownModal from '../../components/TaskBreakDownModal/TaskBreakDownModal';
import PaymentSubmitButton from '../../components/PaymentSubmitButton/PaymentSubmitButton';

// TaskPayment component refactored with TypeScript

export const TaskPayment: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { selectedTask: task, multiShow, selectedTasks } = useTaskBoxContext();
  const paymentContext = usePaymentContext();
  const [showBreakDownModal, setShowBreakDownModal] = React.useState(false);

  React.useEffect(() => {
    paymentContext?.setPaymentAPIStatus('INITIAL');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTasks, task?.id]);

  const payableTasks = task ? [task] : selectedTasks;

  const hasPayable = payableTasks.length > 0;

  const submitButton = (
    <PaymentSubmitButton tasks={selectedTasks} task={task} />
  );
  const taskProperty = useTaskProperty(task);

  const isCompleted = payableTasks.every(
    (task: Task) => task?.status === 'COMPLETED'
  );
  const notPayable = payableTasks.every((task: Task) => !isPayableTask(task));
  const notSignable = payableTasks.every((task: Task) => !isSignableTask(task));
  const { paymentDetail } = usePaymentContextDetail(task);
  if (!paymentContext) return null;
  const { paymentAPIStatus } = paymentContext;
  const { getFees } = paymentContext;
  const { totalAmount = 0 } = getFees ? getFees(payableTasks) : {};

  return (
    <WBFlex
      mx={{ xs: -4, md: -6, lg: -8 }}
      sx={{
        justifyContent: 'flex-end',
        flexDirection: 'column',
        flexGrow: 1,
        position: 'sticky',
        zIndex: (theme: Theme) => theme.zIndex.drawer + 2,
        bottom: 0,
        left: 0,
      }}
    >
      <WBFlex
        display={{ xs: 'flex', xl: 'none' }}
        justifyContent="center"
        width="100%"
        mb={3}
      >
        {submitButton}
      </WBFlex>
      <WBFlex
        flexDirection={'column'}
        justifyContent={{ xs: 'center', xl: 'end' }}
        sx={{
          bgcolor: 'common.black',
          ...((paymentAPIStatus !== 'INITIAL' || isCompleted) && {
            boxShadow: ` 0 4px 77px 42.5px ${
              paymentAPIStatus === 'PAID' || isCompleted
                ? theme.palette.success.main
                : theme.palette.warning.main
            }`,
          }),
          animation:
            paymentAPIStatus === 'PENDING'
              ? `${wbGlow(theme.palette.warning.main)} 2s infinite`
              : undefined,
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 0, xl: 3 },
          py: 2,
        }}
      >
        {!notPayable ? (
          // {multiShow ? (
          <WBFlex
            width={'100%'}
            alignItems={{ xs: 'center', xl: 'end' }}
            mb={1}
            flexDirection={{ xs: 'column' }}
          >
            {taskProperty.isInstallments && !taskProperty.isPaid ? (
              <WBFlex
                justifyContent={{ xs: 'center', xl: 'end' }}
                width={'100%'}
                alignItems={'center'}
                mb={2}
                flexDirection={{ xs: 'column', xl: 'row' }}
              >
                <WBTypography
                  fontWeight={'medium'}
                  mr={{ xs: 0, xl: 2 }}
                  sx={{ textTransform: 'uppercase' }}
                  color={'common.white'}
                >
                  {t('remainingAmount', {
                    ns: 'taskbox',
                  })}
                </WBTypography>
                <CurrencyNumber
                  sup={false}
                  color={'common.white'}
                  number={totalAmount ?? 0}
                  fontSize={'h2.fontSize'}
                />
              </WBFlex>
            ) : (
              <WBFlex
                width={'100%'}
                flexDirection={{ xs: 'column', xl: 'row' }}
                justifyContent={{ xs: 'center', xl: 'end' }}
                alignItems={{ xs: 'center' }}
              >
                <WBTypography
                  fontWeight={'medium'}
                  mr={2}
                  sx={{ textTransform: 'uppercase' }}
                  color={'white'}
                >
                  {t('totalPaymentAmount', {
                    ns: 'taskbox',
                    count: payableTasks.length,
                  })}
                </WBTypography>
                <CurrencyNumber
                  sup={false}
                  number={totalAmount}
                  color={'common.white'}
                  fontSize={'h2.fontSize'}
                />
              </WBFlex>
            )}

            <WBFlex justifyContent={'end'}>
              <WBLink
                variant="body2"
                color={'common.white'}
                underline="always"
                component={'button'}
                onClick={() => setShowBreakDownModal(true)}
              >
                {t('showBreakdown', { ns: 'taskbox' })}
              </WBLink>
            </WBFlex>
          </WBFlex>
        ) : null}

        <WBFlex
          flexDirection={'row'}
          width={'100%'}
          justifyContent={{ xs: 'center', xl: 'space-between' }}
        >
          <WBStack
            spacing={{ xs: 1, sm: 2 }}
            alignItems={'center'}
            direction={'row'}
          >
            {!notPayable && (
              <PaymentDetail task={task} type="Method">
                <PaymentDetail.Selector
                  fontColor="common.white"
                  fontWeight="medium"
                  disabled={
                    notPayable ||
                    (paymentDetail?.type !== PaymentType.PAY_NOW &&
                      taskProperty?.isScheduled)
                  }
                />
              </PaymentDetail>
            )}

            {!notSignable && (
              <PaymentDetail task={task} type="Signature">
                <PaymentDetail.Selector
                  fontColor="common.white"
                  fontWeight="medium"
                  disabled={notSignable || taskProperty?.isScheduled}
                />
              </PaymentDetail>
            )}

            {multiShow
              ? null
              : !notPayable && (
                  <PaymentDetail task={task} type="Type">
                    <PaymentDetail.Selector
                      fontColor="common.white"
                      fontWeight="medium"
                      disabled={notPayable}
                    />
                  </PaymentDetail>
                )}
          </WBStack>
          {
            <WBFlex
              display={{ xs: 'none', xl: 'flex' }}
              ml={2}
              justifyContent={'end'}
              alignItems={'end'}
              flexGrow={1}
            >
              {submitButton}
            </WBFlex>
          }
        </WBFlex>
      </WBFlex>
      <TaskBreakDownModal
        tasks={payableTasks}
        open={showBreakDownModal}
        onClose={() => setShowBreakDownModal(false)}
      />
    </WBFlex>
  );
};
