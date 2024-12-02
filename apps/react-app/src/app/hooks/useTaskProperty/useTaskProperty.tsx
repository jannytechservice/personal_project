import {
  daysDifference,
  frontDateFromBackendDate,
  numberWithCommasDecimals,
} from '@admiin-com/ds-common';
import {
  Contact,
  EntityUser,
  CSGetSub as GET_SUB,
  PaymentStatus,
  Task,
  TaskPaymentStatus,
  TaskSettlementStatus,
  TaskSignatureStatus,
  TaskType,
} from '@admiin-com/ds-graphql';
import {
  entityUsersByEntityId as LIST_ENTITY_USERS_BY_ENTITY,
  contactsByEntity as CONTACTS_BY_ENTITY,
} from '@admiin-com/ds-graphql';
import { useTheme, WBBox, WBTypography } from '@admiin-com/ds-web';
import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  getDeclinedDateForScheduled,
  getDeclinedReasonForScheduled,
  getTaskDueDate,
  isDeclinedTask,
  isPaidTask,
  isPendingSigantureTask,
  isPendingTask,
  isSignedTask,
  isTaskScheduled,
} from '../../helpers/tasks';
import { useCurrentEntityId } from '../useSelectedEntity/useSelectedEntity';
import { getName } from '../../helpers/contacts';
import { sortPayments } from '../../helpers/payments';
import { signedAndPendingUserNames } from '../../helpers/signature';

export const useTaskProperty = (task: Task | null | undefined) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSigned = isSignedTask(task);
  const isPaid = isPaidTask(task);

  const isScheduled = isTaskScheduled(task);
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;
  const dueDate = React.useMemo(() => getTaskDueDate(task), [task]);

  const isPayment =
    task?.type === TaskType.PAY_ONLY || task?.type === TaskType.SIGN_PAY;

  const payments = sortPayments((task?.payments?.items as any) ?? []);

  const totalInstallments = payments?.length ?? 0;
  const paidInstallments = payments?.filter(
    (payment) => payment?.status === PaymentStatus.COMPLETED
  ).length;

  const getTaskPendingSignatureStatus = React.useCallback(
    (task: Task) => {
      return isPendingSigantureTask(task, userId);
    },
    [userId]
  );

  const isPendingSiganture = React.useMemo(() => {
    if (!task) return false;
    return isPendingSigantureTask(task, userId);
  }, [userId, task]);

  const scheduledDate =
    totalInstallments > 0
      ? daysDifference(payments?.[0]?.scheduledAt ?? new Date().toString())
      : 0;

  const scheduledAt = new Date(payments?.[0]?.scheduledAt ?? new Date());
  const remainedAmount =
    payments
      ?.filter((payment) => payment?.status !== PaymentStatus.COMPLETED)
      .reduce(
        (sum, payment) =>
          sum + (payment && payment.amount ? payment.amount : 0),
        0
      ) ?? 0;

  const scheduledToolTip =
    scheduledDate === 0 ? (
      t('invoiceIsDue', { ns: 'taskbox' })
    ) : (
      <>
        {t('invoiceWillExcutedIn', { ns: 'taskbox' })}{' '}
        <b>
          {t(
            scheduledDate === 0
              ? 'today'
              : scheduledDate === 1
              ? 'day'
              : 'days',
            {
              ns: 'taskbox',
              day: scheduledDate,
            }
          )}
        </b>{' '}
        {t('usingYourPaymentMethod', { ns: 'taskbox' })}{' '}
        {/* {maskCreditCardNumberSimple(task)} */}
      </>
    );
  const dueToolTip = (
    <WBBox>
      {task?.lodgementAt && (
        <WBTypography
          fontSize={'inherit'}
          color={'inherit'}
          fontWeight={'inherit'}
        >
          {`${t('lodgementDate', {
            ns: 'taskbox',
          })}`}
          <b> {frontDateFromBackendDate(task?.lodgementAt ?? '')}</b>
        </WBTypography>
      )}
      <WBTypography
        fontSize={'inherit'}
        color={'inherit'}
        fontWeight={'inherit'}
      >
        {`${t(
          task?.type === TaskType.SIGN_ONLY ? 'signatureDueOn' : 'paymentDueOn',
          {
            ns: 'taskbox',
          }
        )}`}
        <b> {frontDateFromBackendDate(task?.dueAt ?? '')}</b>
      </WBTypography>
    </WBBox>
  );
  const declinedToolTip = (
    <>
      <span style={{ color: theme.palette.error.main }}>{`${t(
        'paymentDeclined',
        {
          ns: 'taskbox',
        }
      )}`}</span>{' '}
      {` ${t('on', { ns: 'taskbox' })} `}
      {frontDateFromBackendDate(getDeclinedDateForScheduled(task) ?? '')}
      {` ${t('because', { ns: 'taskbox' })} `}
      <span style={{ color: theme.palette.error.main }}>{`${t(
        getDeclinedReasonForScheduled(task) ?? ''
      )}`}</span>
    </>
  );

  const installmentTooltip = (
    <WBBox>
      {payments?.map((payment, index) => (
        <WBTypography
          fontSize={'inherit'}
          color={'inherit'}
          fontWeight={'inherit'}
          key={payment?.id}
        >
          {t('installment', { ns: 'taskbox' })} <b>{index + 1}</b>
          <b>
            {' '}
            {` - `}
            {`$${numberWithCommasDecimals((payment?.amount ?? 0) / 100)}`}{' '}
            <span
              style={{
                color:
                  payment?.status === PaymentStatus.COMPLETED
                    ? theme.palette.success.main
                    : payment?.status === PaymentStatus.VOIDED
                    ? theme.palette.grey['500']
                    : payment?.status === PaymentStatus.SCHEDULED ||
                      payment?.status ===
                        PaymentStatus.PENDING_USER_CONFIRMATION ||
                      payment?.status === PaymentStatus.USER_CONFIRMED
                    ? theme.palette.warning.main
                    : payment?.status === PaymentStatus.DECLINED
                    ? theme.palette.error.main
                    : 'inherit',
              }}
            >
              {t(payment?.status ?? '', { ns: 'taskbox' })}
            </span>
          </b>{' '}
          {payment?.status === PaymentStatus.SCHEDULED
            ? t('toBePaid', { ns: 'taskbox' })
            : ''}
          {` ${t('on', { ns: 'taskbox' })} `}
          <b>
            {' '}
            {frontDateFromBackendDate(
              payment?.status === PaymentStatus.DECLINED
                ? payment.declinedAt ?? ''
                : payment?.scheduledAt ?? ''
            )}
          </b>
        </WBTypography>
      ))}
    </WBBox>
  );

  const currentEntityId = useCurrentEntityId();

  const { data: usersData } = useQuery(gql(LIST_ENTITY_USERS_BY_ENTITY), {
    variables: {
      entityId: currentEntityId,
    },
  });

  const entityUsers = usersData?.entityUsersByEntityId?.items ?? [];

  const { data: contactsData } = useQuery(gql(CONTACTS_BY_ENTITY), {
    variables: {
      entityId: currentEntityId,
    },
  });

  // const contacts = contactsData?.contactsByEntity?.items ?? [];
  // const pendingUsersNameSet = new Set<string>();
  // const signedUsersNameSet = new Set<string>();
  // if (task?.annotations) {
  //   const annotationsData = JSON.parse(task?.annotations);
  //   const annotations = annotationsData?.annotations;

  //   const signedUserId: string[] = [];
  //   const pendingUsersId: string[] = [];
  //   annotations?.forEach((annotation: any) => {
  //     if (annotation?.customData?.status === 'PENDING') {
  //       if (annotation?.customData?.signerName) {
  //         pendingUsersNameSet.add(annotation?.customData?.signerName);
  //       } else {
  //         pendingUsersId.push(
  //           annotation?.customData?.userId === 'undefined'
  //             ? annotation?.customData?.contactId
  //             : annotation?.customData?.userId
  //         );
  //       }
  //     } else if (annotation?.customData?.status === 'ACTIONED') {
  //       if (annotation?.customData?.signerName) {
  //         signedUsersNameSet.add(annotation?.customData?.signerName);
  //       } else {
  //         signedUserId.push(
  //           annotation?.customData?.userId === 'undefined'
  //             ? annotation?.customData?.contactId
  //             : annotation?.customData?.userId
  //         );
  //       }
  //     }
  //   });

  //   entityUsers.forEach((user: EntityUser) => {
  //     if (pendingUsersId.includes(user?.userId))
  //       pendingUsersNameSet.add(`${user?.firstName} ${user?.lastName}`);
  //     else if (signedUserId.includes(user?.userId))
  //       signedUsersNameSet.add(`${user?.firstName} ${user?.lastName}`);
  //   });

  //   contacts.forEach((contact: Contact) => {
  //     if (pendingUsersId.includes(contact?.id)) {
  //       pendingUsersNameSet.add(`${getName(contact)}`);
  //     } else if (signedUserId.includes(contact?.id))
  //       signedUsersNameSet.add(`${getName(contact)}`);
  //   });
  // }

  // const pendingUsersName = Array.from(pendingUsersNameSet);
  // const signedUsersName = Array.from(signedUsersNameSet);
  const { signedUsersName, pendingUsersName } = signedAndPendingUserNames(
    task?.annotations
  );
  const signatureRequiredTooltip = (
    <WBBox>
      {signedUsersName?.map((name, index) => (
        <WBTypography
          fontSize={'inherit'}
          color={'inherit'}
          fontWeight={'inherit'}
          key={name}
        >
          <b>{name}</b> {t('hasSigned', { ns: 'taskbox' })}
        </WBTypography>
      ))}
      {pendingUsersName?.map((name, index) => (
        <WBTypography
          fontSize={'inherit'}
          color={'inherit'}
          fontWeight={'inherit'}
          key={name}
        >
          <b>{name}</b>
          {t('hasPendingSignature', { ns: 'taskbox' })}
        </WBTypography>
      ))}
      {signedUsersName?.length === 0 && pendingUsersName?.length === 0 && (
        <WBTypography
          fontSize={'inherit'}
          color={'inherit'}
          fontWeight={'inherit'}
        >
          {t('noSignedOrPendingSignature', { ns: 'taskbox' })}
        </WBTypography>
      )}
    </WBBox>
  );

  const isInstallments = totalInstallments > 1;

  const isAchivableByStatus =
    (task?.paymentStatus === TaskPaymentStatus.NOT_PAYABLE ||
      task?.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT) &&
    (task?.signatureStatus === TaskSignatureStatus.NOT_SIGNABLE ||
      task?.signatureStatus === TaskSignatureStatus.PENDING_SIGNATURE);

  const isAchivableByEntity = task?.createdBy === subData?.sub;

  const isCreatedBy = task?.createdBy === subData?.sub;

  const isAchivable = isAchivableByStatus && isAchivableByEntity;

  const isPending = isPendingTask(task);
  const isDeclined = isDeclinedTask(task);
  const isPayID =
    payments?.[0]?.status === PaymentStatus.PENDING_PAYID_TRANSFER;

  const isPayable =
    task?.type !== TaskType.SIGN_ONLY &&
    task?.settlementStatus !== TaskSettlementStatus.REFUNDABLE;

  const isDownloadable = task?.type !== TaskType.PAY_ONLY;

  const tooltip = isInstallments
    ? installmentTooltip
    : isDeclined
    ? declinedToolTip
    : isScheduled
    ? scheduledToolTip
    : dueToolTip;

  return {
    isPaid,
    isPayID,
    isPending,
    isScheduled,
    signatureRequiredTooltip,
    isDeclined,
    isInstallments,
    dueDate,
    getTaskPendingSignatureStatus,
    tooltip,
    isAchivable,
    isPendingSiganture,
    isDownloadable,
    isPayment,
    remainedAmount,
    totalInstallments,
    isSigned,
    paidInstallments,
    isCreatedBy,
    scheduledAt,
    isPayable,
    scheduledDate,
  };
};
