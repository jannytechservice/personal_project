import { daysDifference } from '@admiin-com/ds-common';
import { Payment, PaymentStatus, Task } from '@admiin-com/ds-graphql';
import { DateTime } from 'luxon';

export const isPayIDTask = (task: Task | null | undefined) => {
  const payments = task?.payments?.items;

  return payments?.[0]?.status === PaymentStatus.PENDING_PAYID_TRANSFER;
};
export const isUpcomingPayment = (payment: Payment) => {
  // Check if the payment has a confirmed status
  if (payment?.status === PaymentStatus.PENDING_USER_CONFIRMATION) {
    // Parse the scheduledAt date using Luxon from the ISO date string
    const scheduledDate = DateTime.fromISO(payment.scheduledAt ?? '');
    const now = DateTime.now();

    // Calculate the difference in hours
    const diffInHours = scheduledDate.diff(now, 'hours').hours;

    // Check if the difference is more than or equal to -48 hours (behind)
    if (diffInHours <= 48) {
      return true;
    }
  }
  return false;
};
export const sortPayments = (payments: Payment[]) => {
  return [...payments]?.sort((a, b) => {
    if (a.paidAt && !b.paidAt) return -1;
    if (!a.paidAt && b.paidAt) return 1;
    if (a.paidAt && b.paidAt) return a.paidAt.localeCompare(b.paidAt);
    return 0;
  });
};
export const hasOverDueInstallmentForSent = (task: Task | null) => {
  const payments = task?.payments?.items ?? [];
  return payments.some(
    (payment) => payment && isGuestScheduledPaymentOverDue(payment)
  );
};

export const firstOverDueDateScheduledPayment = (task: Task | null) => {
  const payments = task?.payments?.items ?? [];
  for (const payment of payments) {
    if (payment && isGuestScheduledPaymentOverDue(payment)) {
      return daysDifference(payment.scheduledAt ?? new Date().toString());
    }
  }
  return null;
};

export const isGuestScheduledPaymentOverDue = (payment: Payment) => {
  return (
    payment.status === PaymentStatus.GUEST_SCHEDULED &&
    daysDifference(payment.scheduledAt ?? new Date().toString()) < 0
  );
};
