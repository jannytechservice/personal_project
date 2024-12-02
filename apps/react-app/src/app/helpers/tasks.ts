import { daysDifference } from '@admiin-com/ds-common';
import {
  LineItem,
  LineItemInput,
  Payment,
  PaymentFrequency,
  PaymentMethodType,
  PaymentStatus,
  PaymentType,
  Task,
  TaskCategory,
  TaskGuest,
  TaskPaymentStatus,
  TaskSettlementStatus,
  TaskSignatureStatus,
  TaskStatus,
  TaskType,
  TaxType,
} from '@admiin-com/ds-graphql';
import { GST_RATE } from '../constants/config';
import { Annotation } from 'pspdfkit';
import { PaymentDetailData } from '../components/PaymentContainer/PaymentContainer';

export function hasInstallmentTask(tasks: Task[]) {
  return tasks.some((task) => isInstallmentTask(task));
}

export function isDeclinedTask(task?: Task | null) {
  const isScheduled = isTaskScheduled(task);
  const payments = task?.payments?.items ?? [];
  return (
    isScheduled &&
    payments?.find(
      (payment: Payment | null) => payment?.status === PaymentStatus.DECLINED
    )
  );
}
export function getDeclinedDateForScheduled(task?: Task | null) {
  const payments = task?.payments?.items ?? [];

  const isInstallments = isInstallmentTask(task);
  if (!isInstallments && isDeclinedTask(task))
    return payments?.find(
      (payment: Payment | null) => payment?.status === PaymentStatus.DECLINED
    )?.declinedAt;
  else return null;
}

export function getDeclinedReasonForScheduled(task?: Task | null) {
  const payments = task?.payments?.items ?? [];

  const isInstallments = isInstallmentTask(task);
  if (!isInstallments && isDeclinedTask(task))
    return payments?.find(
      (payment: Payment | null) => payment?.status === PaymentStatus.DECLINED
    )?.declinedReason;
  else return null;
}

export interface Attachment {
  binary: string;
  contentType: string;
}
export interface AnnotationDocument {
  annotations: Annotation[];
  attachments: {
    [key: string]: Attachment;
  };
  format: string;
  pdfId: string | null;
}
export const isDocumentSigned = (
  annotations?: AnnotationDocument | null
): boolean => {
  if (!annotations) {
    return true;
  }

  return annotations?.annotations?.every(
    (annotation) =>
      !annotation?.customData?.status ||
      annotation.customData.status === 'ACTIONED'
  );
};

export function isSignedTask(task?: Task | null) {
  return task?.signatureStatus === TaskSignatureStatus.SIGNED;
}

export function isPendingSigantureTask(task: Task, userId?: string) {
  if (isSignedTask(task)) return false;
  if (!(isPaidTask(task) || !isPayableTask(task))) return false;
  if (isSignableTask(task, { userId })) return false;
  if (task?.signatureStatus === TaskSignatureStatus.NOT_SIGNABLE) return false;
  return true;
}
export function isSignableTask(
  task: Task | null,
  params?: { userId?: string; signerType?: string; contactId?: string }
) {
  const { userId, signerType, contactId } = params ?? {};
  if (
    !(
      task?.type !== TaskType.PAY_ONLY &&
      task?.status === TaskStatus.INCOMPLETE &&
      task.signatureStatus === TaskSignatureStatus.PENDING_SIGNATURE
    )
  )
    return false;
  if (params) {
    if (
      task.annotations &&
      JSON.parse(task?.annotations)?.annotations?.some(
        (annotation: Annotation) =>
          annotation?.customData?.status &&
          (!userId || (userId && annotation.customData.signerId === userId)) &&
          (!signerType ||
            (signerType && annotation.customData.signerType === signerType)) &&
          (!contactId ||
            (contactId && annotation.customData.contactId === contactId)) &&
          annotation.customData.status === 'PENDING'
      )
    ) {
      return true;
    } else return false;
  }

  return true;
}

export function isPaidTask(task?: Task | null) {
  if (!task) return false;
  return (
    task?.paymentStatus === TaskPaymentStatus.PAID ||
    task?.paymentStatus === TaskPaymentStatus.MARKED_AS_PAID
  );
}

export function isPendingTask(task?: Task | null) {
  if (!task) return false;

  return (
    task?.paymentStatus ===
      TaskPaymentStatus.PENDING_PAYTO_AGREEMENT_CREATION ||
    task?.paymentStatus === TaskPaymentStatus.PENDING_PAYID_TRANSFER
  );
}

export function isInstallmentTask(task?: Task | null) {
  if (!task) return false;

  return (
    ((task?.paymentFrequency === PaymentFrequency.WEEKLY ||
      task?.paymentFrequency === PaymentFrequency.FORTNIGHTLY ||
      task?.paymentFrequency === PaymentFrequency.MONTHLY ||
      task?.paymentFrequency === PaymentFrequency.QUARTERLY ||
      task?.paymentFrequency === PaymentFrequency.ANNUALLY) &&
      (task?.numberOfPayments || 0) > 1) ||
    (task?.payments?.items?.length || 0) > 1
  );
}

export function getTaskAmount(task?: Task | null) {
  const payments = task?.payments?.items ?? [];
  const remainedAmount =
    payments
      ?.filter((payment) => payment?.status !== PaymentStatus.COMPLETED)
      .reduce(
        (sum, payment) =>
          sum + (payment && payment.amount ? payment.amount / 100 : 0),
        0
      ) ?? 0;
  return payments?.length > 0 ? remainedAmount : task?.amount ?? 0;
}

export function calculateFee(
  tasks: Task[],
  paymentType: PaymentMethodType,
  paymentDetails?: PaymentDetailData[]
) {
  const fees: Record<string, number> = {};
  let totalAmount = 0;
  const payableName =
    tasks.length === 1 ? tasks[0]?.reference ?? 'payable' : 'payable';

  for (const task of tasks) {
    const isInstallment =
      (task?.payments?.items?.length || 0) > 1 ||
      paymentDetails?.find((detail) => detail && detail?.task?.id === task?.id)
        ?.type === PaymentType.INSTALLMENTS;
    const isTax = task?.category === TaskCategory.TAX;
    const amount = getTaskAmount(task);

    if (!fees[payableName]) {
      fees[payableName] = 0;
    }
    fees[payableName] += amount;
    let paybleAmount = amount;

    if (isInstallment) {
      if (isTax) {
        if (!fees['atoFee']) {
          fees['atoFee'] = 0;
        }
        fees['atoFee'] += 88;
        paybleAmount += 88;
      } else {
        if (!fees['installmentFee']) {
          fees['installmentFee'] = 0;
        }
        fees['installmentFee'] += amount * 0.024;
        paybleAmount += amount * 0.024;
      }
    }
    if (task?.gstInclusive) {
      if (!fees['gst']) {
        fees['gst'] = 0;
      }
    }
    if (paymentType) {
      if (paymentType === PaymentMethodType.CARD) {
        if (!fees['admiinFee']) {
          fees['admiinFee'] = 0;
        }
        fees['admiinFee'] += amount * 0.022;
      } else if (paymentType === PaymentMethodType.BANK) {
        if (!fees['admiinFee']) {
          fees['admiinFee'] = 0;
        }
        fees['admiinFee'] += 0.9;
      }
      paybleAmount += fees['admiinFee'];
    }
    if (task?.gstInclusive) {
      if (!fees['gst']) {
        fees['gst'] = 0;
      }
      fees['gst'] += paybleAmount / GST_RATE;
    }
    totalAmount += paybleAmount;
  }

  return { fees, totalAmount };
}

export function getTaskDueDate(task?: Task | null) {
  //TODO: need to update if tax bill, refundable, payable info is added
  const date =
    task?.settlementStatus === TaskSettlementStatus.REFUNDABLE
      ? task?.lodgementAt
      : task?.signatureStatus === TaskSignatureStatus.PENDING_SIGNATURE &&
        !!task?.lodgementAt
      ? task?.lodgementAt
      : task?.dueAt;
  return task ? daysDifference(date ?? new Date().toString()) : 0;
}
export function hasReOcurringTask(tasks: Task[]) {
  return tasks.some((task) => isReocurringTask(task));
}

export function isReocurringTask(task?: Task | null) {
  return (
    task?.paymentFrequency === PaymentFrequency.WEEKLY ||
    task?.paymentFrequency === PaymentFrequency.FORTNIGHTLY ||
    task?.paymentFrequency === PaymentFrequency.MONTHLY ||
    task?.paymentFrequency === PaymentFrequency.QUARTERLY ||
    task?.paymentFrequency === PaymentFrequency.ANNUALLY
  );
}
export function isPayableTask(task?: Task | null) {
  return (
    (task?.status === TaskStatus.INCOMPLETE ||
      task?.status === TaskStatus.SCHEDULED) &&
    task?.type !== TaskType.SIGN_ONLY &&
    task?.settlementStatus !== TaskSettlementStatus.REFUNDABLE &&
    (task?.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT ||
      task?.paymentStatus === TaskPaymentStatus.SCHEDULED)
  );
}

export function tasksSignPayLabel(tasks: Task[]): TaskType | 'Paid' | 'Signed' {
  if (
    tasks.every(
      (task) => task.status === TaskStatus.COMPLETED && isPaidTask(task)
    )
  )
    return 'Paid';
  if (
    tasks.every(
      (task) => task.status === TaskStatus.COMPLETED && isSignedTask(task)
    )
  )
    return 'Signed';
  let isPayable = false;
  let isSignable = false;
  for (const task of tasks) {
    if (!task) continue;
    if (isPayableTask(task)) isPayable = true;
    if (isSignableTask(task)) isSignable = true;
  }
  if (isPayable && isSignable) return TaskType.SIGN_PAY;
  else if (isPayable && !isSignable) return TaskType.PAY_ONLY;
  else if (!isPayable && isSignable) return TaskType.SIGN_ONLY;

  return TaskType.SIGN_ONLY;
}

export function isTaskScheduled(task?: Task | null) {
  return task?.paymentStatus === TaskPaymentStatus.SCHEDULED;
}
export function hasTaskScheduled(tasks: Task[]) {
  return tasks.some(
    (task) => task?.paymentStatus === TaskPaymentStatus.SCHEDULED
  );
}
export interface GetPaymentAmount {
  amount: number;
  paymentType: PaymentType;
  installments?: number;
  isFirstInstallment?: boolean;
  isTaxBill: boolean;
}

export const getTaskPaymentAmount = ({
  amount,
  paymentType,
  installments = 1,
  isFirstInstallment = false,
  isTaxBill,
}: GetPaymentAmount) => {
  let totalAmount = amount;
  if (
    paymentType === PaymentType.INSTALLMENTS &&
    !isTaxBill &&
    installments > 1
  ) {
    totalAmount = totalAmount + totalAmount * 1.024; //2.4% to seller
  }

  if (paymentType === PaymentType.INSTALLMENTS && installments > 1) {
    // Calculate the equal installment amount by rounding down the division result
    const equalInstallment = Math.floor(amount / installments);
    console.log('equalInstallment: ', equalInstallment);
    const remainder = amount % installments;
    console.log('remainder: ', equalInstallment);

    if (isFirstInstallment) {
      return equalInstallment + remainder;
    } else {
      return equalInstallment;
    }
  }

  return Math.round(totalAmount);
};

export const getTaskPaymentAmountWithFee = ({
  amount,
  paymentType,
  installments = 1,
  isFirstInstallment = false,
  isTaxBill,
}: GetPaymentAmount) => {
  let totalAmount = amount;
  if (
    paymentType === PaymentType.INSTALLMENTS &&
    !isTaxBill &&
    installments > 1
  ) {
    totalAmount = totalAmount + totalAmount * 1.024; //2.4% to seller
  }

  if (paymentType === PaymentType.INSTALLMENTS && installments > 1) {
    // Calculate the equal installment amount by rounding down the division result
    const equalInstallment = Math.floor(amount / installments);
    console.log('equalInstallment: ', equalInstallment);
    const remainder = amount % installments;
    console.log('remainder: ', equalInstallment);

    if (isFirstInstallment) {
      return Math.round((equalInstallment + remainder) * 1.022);
    } else {
      return Math.round(equalInstallment * 1.022);
    }
  }

  return Math.round(totalAmount * 1.022);
};

export function addFee({
  amount,
  paymentType,
  paymentMethodType,
  isTax,
}: {
  amount: number;
  paymentType: PaymentType;
  paymentMethodType: PaymentMethodType;
  isTax: boolean;
}) {
  const fees: Record<string, number> = {};
  const payableName = 'payable';

  const isInstallment = paymentType === PaymentType.INSTALLMENTS;

  if (!fees[payableName]) {
    fees[payableName] = 0;
  }
  fees[payableName] += amount;
  let paybleAmount = amount;

  if (paymentMethodType) {
    if (paymentMethodType === PaymentMethodType.CARD) {
      if (!fees['admiinFee']) {
        fees['admiinFee'] = 0;
      }
      fees['admiinFee'] += amount * 0.022;
    } else if (paymentMethodType === PaymentMethodType.BANK) {
      if (!fees['admiinFee']) {
        fees['admiinFee'] = 0;
      }
      fees['admiinFee'] += 90;
    }
    paybleAmount += fees['admiinFee'];
  }

  return Math.floor(paybleAmount);
}

export const getAmountFromLineItems = (rows: LineItemInput[]) => {
  const subTotal = rows.reduce(
    (acc, row) => acc + (row?.unitAmount ?? 0) * (row.quantity ?? 0),
    0
  );
  const totalGST = rows.reduce(
    (acc, row) =>
      acc +
      (row?.unitAmount ?? 0) *
        (row.quantity ?? 0) *
        (row.taxType === TaxType.GST ? 0.1 : 0),
    0
  );
  const total = subTotal + totalGST;
  return { subTotal, totalGST, total };
};

export const getDueDateFromTask = (task: Task) => {
  let dueAt: string | undefined | null = task?.dueAt;
  const isTax = false;
  if (isTax) {
    dueAt = task?.paymentAt;
  } else if (task?.paymentFrequency !== PaymentFrequency.ONCE) {
    if (task && 'firstPaymentAt' in task)
      dueAt = task?.firstPaymentAt as string;
  }
  return dueAt;
};

export const getDocumentName = (task?: Task | TaskGuest | null) => {
  return task?.reference || 'document.pdf';
};
