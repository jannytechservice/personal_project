import {
  AlertColor,
  Timeline as MuiTimeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import {
  Payment,
  PaymentStatus,
  PaymentType,
  Task,
  TaskDirection,
} from '@admiin-com/ds-graphql';
import { ScrollViews, ScrollViewsContainer } from '../ScrollViews/ScrollViews';
import {
  useSnackbar,
  WBBox,
  WBFlex,
  WBGrid,
  WBLinkButton,
  WBMenu,
  WBMenuItem,
  WBModal,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import {
  frontDateFromBackendDate,
  frontDateFromISO,
} from '@admiin-com/ds-common';
import QRCode from 'qrcode.react';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { usePaymentContext } from '../PaymentContainer/PaymentContainer';
import { addFee } from '../../helpers/tasks';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import { sortPayments } from '../../helpers/payments';
import React from 'react';
import { useClipboard } from '@admiin-com/ds-hooks';
import BackModal from '../BackModal/BackModal';
import AdmiinLogoURL from '../../../assets/icons/admiin-logo-only-icon.svg?url';
import { useSentTaskOptions } from '../../hooks/useSentTaskOptions/useSentTaskOptions';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import ScheduleIcon from '@mui/icons-material/Schedule';

interface TaskInstallmentsTimelineProps {
  task?: Task;
}

export function TaskInstallmentsTimeline({
  task,
}: TaskInstallmentsTimelineProps) {
  const payments: Payment[] = (task?.payments?.items.filter(
    (payment: Payment | null) => !!payment
  ) ?? []) as Payment[];

  const { t } = useTranslation();

  const { directionFilter } = useTaskBoxContext();
  const paymentContext = usePaymentContext() ?? {};

  const sortedPayments = sortPayments(payments);

  const { paymentMethod, retryPayment } = paymentContext;

  const showFees = false;

  const theme = useTheme();

  const onPaymentClick = (
    event: React.MouseEvent<HTMLElement>,
    payment: Payment
  ) => {
    setAnchorEl(event.currentTarget);
    setClickedPayment(payment);
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const [clickedPayment, setClickedPayment] = React.useState<
    Payment | null | undefined
  >(null);

  const { handleCopyPaymentLink, QRCodeComponent } = useSentTaskOptions({
    task,
    payment: clickedPayment,
  });

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const handleCopyLink = async () => {
    handleCopyPaymentLink();
    handleClose();
  };

  const handleShowQRCode = () => {
    setModalOpen(true);
    handleClose();
  };

  return (
    <ScrollViewsContainer data={sortedPayments}>
      <WBGrid container alignItems={'center'} spacing={0}>
        <WBGrid
          xs={1}
          padding={'18px 8px'}
          sx={{
            display: 'flex',
            justifyContent: 'end',
            boxShadow: '5px 1px 5px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <ScrollViews.Back name="ChevronBack" />
        </WBGrid>
        <WBGrid xs={10}>
          <MuiTimeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
                marginLeft: -3,
                marginRight: -3,
              },
              pr: 0,
              my: 0,
              pl: 3,
              // transform: 'rotate(90deg)',
              flexDirection: 'row',
              ml: -3,
              padding: -3,
            }}
          >
            <ScrollViews
              noPadding
              render={(item: Payment, index: number) => (
                <WBTooltip title={item.declinedReason} placement={'top'}>
                  <TimelineItem
                    sx={{
                      minHeight: '55px',
                      //  transform: 'rotate(180deg)'
                      flexDirection: 'column',
                      color:
                        item.status === PaymentStatus.COMPLETED
                          ? 'success.main'
                          : item.status === PaymentStatus.DECLINED
                          ? 'error.main'
                          : item.status === PaymentStatus.VOIDED
                          ? 'grey.500'
                          : 'warning.main',
                      fontSize: 'body2.fontSize',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => onPaymentClick(e, item)}
                    key={index}
                  >
                    <TimelineContent
                      sx={{
                        // transform: 'rotate(-180deg)',
                        textAlign: 'center',
                        position: 'relative',
                        fontSize: 'inherit',
                        minWidth: 50,
                        fontWeight: 'medium',
                      }}
                    >
                      {directionFilter === TaskDirection.RECEIVING && (
                        <WBBox
                          sx={{
                            visibility:
                              item.status === PaymentStatus.DECLINED
                                ? 'visible'
                                : 'hidden',
                          }}
                          onClick={(e: any) => {
                            e.stopPropagation();
                            e.preventDefault();
                            retryPayment(item);
                          }}
                        >
                          <WBLinkButton
                            color="primary.main"
                            sx={{
                              textDecoration: 'underline',
                            }}
                          >
                            {t('retry', { ns: 'taskbox' })}
                          </WBLinkButton>
                        </WBBox>
                      )}
                      <WBTypography
                        color={'inherit'}
                        textAlign={'inherit'}
                        fontSize={'inherit'}
                        fontWeight={'inherit'}
                      >
                        {t(item.status, { ns: 'taskbox' })}
                      </WBTypography>
                    </TimelineContent>
                    <TimelineSeparator
                      sx={{ flexDirection: 'row', color: 'inherit' }}
                    >
                      <TimelineConnector
                        sx={{
                          height: '4px',
                          bgcolor:
                            index === 0
                              ? 'transparent'
                              : item.status === PaymentStatus.COMPLETED
                              ? 'success.main'
                              : 'grey.light',
                        }}
                      />
                      <TimelineDot
                        variant="outlined"
                        sx={{
                          bgcolor: 'white',
                          borderColor: 'inherit',
                          padding: '6px',
                          margin: 0,
                          borderWidth: 4,
                        }}
                      />
                      <TimelineConnector
                        sx={{
                          height: '4px',
                          bgcolor:
                            index < payments.length - 1
                              ? item.status === PaymentStatus.COMPLETED
                                ? 'success.main'
                                : 'grey.light'
                              : 'transparent',
                        }}
                      />
                    </TimelineSeparator>
                    <TimelineContent
                      sx={{
                        // transform: 'rotate(-180deg)',
                        textAlign: 'center',
                        minWidth: 50,
                        fontSize: 'inherit',
                      }}
                    >
                      <CurrencyNumber
                        number={
                          showFees
                            ? item.status === PaymentStatus.COMPLETED
                              ? (item.amount ?? 0) / 100
                              : addFee({
                                  amount: item?.amount ?? 0,
                                  paymentType: PaymentType.INSTALLMENTS,
                                  isTax: task?.category === 'TAX',
                                  paymentMethodType:
                                    paymentMethod.paymentMethodType,
                                }) / 100
                            : (item.amount ?? 0) / 100
                        }
                        sup={false}
                        color={'text.primary'}
                        textAlign={'center'}
                      />
                      <WBTypography
                        fontWeight={'bold'}
                        fontSize="11px"
                        textAlign="center"
                        color="textSecondary"
                      >
                        {(item.status !== PaymentStatus.VOIDED &&
                          item.status !== PaymentStatus.COMPLETED &&
                          frontDateFromBackendDate(item?.scheduledAt ?? '')) ??
                          ''}
                        {item.status === PaymentStatus.VOIDED &&
                          frontDateFromISO(item.voidedAt ?? '')}
                        {item.status === PaymentStatus.COMPLETED &&
                          frontDateFromISO(item.paidAt ?? '')}
                      </WBTypography>
                    </TimelineContent>
                  </TimelineItem>
                </WBTooltip>
              )}
            />
          </MuiTimeline>
        </WBGrid>
        <WBGrid
          xs={1}
          padding={'18px 8px'}
          sx={{ boxShadow: '-5px 1px 5px -5px rgba(0, 0, 0, 0.5)' }}
        >
          <ScrollViews.Forward name="ChevronForward" />
        </WBGrid>
      </WBGrid>
      <WBMenu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableArrow={true}
      >
        {task?.direction === TaskDirection.SENDING && (
          <WBMenuItem
            onClick={handleCopyLink}
            sx={{
              ...theme.typography.body2,
              fontWeight: 'bold',
            }}
          >
            {t('copyLinkToPayment', { ns: 'taskbox' })}
          </WBMenuItem>
        )}
        {/*{task?.direction === TaskDirection.SENDING && <WBMenuItem*/}
        {/*  // onClick={handleArchiveTask}*/}
        {/*  sx={{*/}
        {/*    ...theme.typography.body2,*/}
        {/*    fontWeight: 'bold',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {t('resendEmail', { ns: 'taskbox' })}*/}
        {/*</WBMenuItem> }*/}
        {/*{clickedPayment?.status !== PaymentStatus.COMPLETED && (*/}
        {/*  <WBMenuItem*/}
        {/*    // onClick={handleArchiveTask}*/}
        {/*    sx={{*/}
        {/*      ...theme.typography.body2,*/}
        {/*      fontWeight: 'bold',*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {t('markAsPaid', { ns: 'taskbox' })}*/}
        {/*  </WBMenuItem>*/}
        {/*)}*/}
        {task?.direction === TaskDirection.SENDING && (
          <WBMenuItem
            onClick={handleShowQRCode}
            sx={{
              ...theme.typography.body2,
              fontWeight: 'bold',
            }}
          >
            {t('showQRCode', { ns: 'taskbox' })}
          </WBMenuItem>
        )}
      </WBMenu>
      <BackModal
        height={'auto'}
        open={modalOpen}
        fullWidth={false}
        onClose={() => setModalOpen(false)}
      >
        {QRCodeComponent}
      </BackModal>
    </ScrollViewsContainer>
  );
}

export default TaskInstallmentsTimeline;
