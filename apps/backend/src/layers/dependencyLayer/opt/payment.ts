import {
  FromToType,
  PaymentFrequency,
  PaymentStatus,
  PaymentType,
  Task,
  User,
} from 'dependency-layer/API';
import { currencyNumber } from 'dependency-layer/code';
import { getRecord, queryRecords } from 'dependency-layer/dynamoDB';
import { sendEmail } from 'dependency-layer/pinpoint';
import { enumToCapitalizedString } from 'dependency-layer/utils';
import { DateTime } from 'luxon';

export const getScheduledAtStatus = ({
  amount,
  scheduledAt,
}: {
  amount: number;
  scheduledAt: string;
}) => {
  const underThousand = amount < 1000 * 100;
  const within48Hours =
    DateTime.fromFormat(scheduledAt ?? '', 'yyyy-MM-dd').diffNow('hours')
      .hours < 48;
  return underThousand || within48Hours
    ? PaymentStatus.USER_CONFIRMED
    : PaymentStatus.SCHEDULED;
};

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

interface getGstPaymentAmount extends GetPaymentAmount {
  amount: number;
  installments?: number;
  isFirstInstallment?: boolean;
  isTaxBill: boolean;
  gstInclusive: boolean;
}

export const getTaskPaymentGstAmount = ({
  amount,
  paymentType,
  installments = 1,
  isFirstInstallment = false,
  isTaxBill,
  gstInclusive,
}: getGstPaymentAmount) => {
  if (gstInclusive) {
    return Math.round(
      getTaskPaymentAmount({
        amount,
        paymentType,
        installments,
        isFirstInstallment,
        isTaxBill,
      }) / 11
    );
  }

  return 0;
};

export async function sendInvoiceEmail(
  task: Task,
  templateName: 'invoice' | 'invoice-reminder' | 'invoice-overdue'
) {
  const {
    TABLE_ENTITY,
    TABLE_CONTACT,
    TABLE_ENTITY_USER,
    TABLE_USER,
    FROM_EMAIL,
    WEB_DOMAIN,
  } = process.env;
  const toData: { userId: string; email: string; firstName: string }[] = [];

  if (task.toType === FromToType.ENTITY) {
    // query all entity users who aren't the role as an accountant
    let entityUsers = [];
    try {
      entityUsers = await queryRecords({
        tableName: TABLE_ENTITY_USER ?? '',
        indexName: undefined,
        keys: { entityId: task.toId },
        filter: { role: { ne: 'ACCOUNTANT' } },
      });
    } catch (err) {
      console.log('Error getting entity users: ', err);
    }

    console.log('ne accountant entityUsers: ', entityUsers);

    if (entityUsers?.length > 0) {
      for (let i = 0; i < entityUsers.length; i++) {
        const entityUser = entityUsers[i];
        let user: User | null = null;
        try {
          user = await getRecord(TABLE_USER ?? '', {
            id: entityUser.userId,
          });
          if (user?.email) {
            toData.push({
              userId: entityUser.userId,
              email: user?.email ?? '',
              firstName: entityUser.firstName,
            });
          }
        } catch (err: any) {
          console.log('Error getting user: ', err);
        }
      }
    }
  }

  // get contact details for contact
  else if (task.toType === FromToType.CONTACT) {
    const buyerContact = await getRecord(TABLE_CONTACT ?? '', {
      id: task.toId,
    });
    toData.push({
      userId: buyerContact?.userId,
      email: buyerContact?.email,
      firstName: buyerContact?.firstName,
    });
  }

  let from = '';
  if (task.fromType === FromToType.ENTITY) {
    const sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
      id: task.fromId,
    });
    from = sellerEntity?.legalName ?? '';
  } else if (task.fromType === FromToType.CONTACT) {
    const sellerContact = await getRecord(TABLE_CONTACT ?? '', {
      id: task.fromId,
    });
    from = sellerContact?.firstName ?? '';
  }

  if (toData?.length > 0 && task.amount) {
    const requests = [];
    for (let i = 0; i < toData.length; i++) {
      const templateData = {
        task: {
          ...task,
          from,
          totalWithCurrency:
            currencyNumber({ amount: task.amount / 100 }) ?? '',
          url: `${WEB_DOMAIN}/guest/pay-task?entityId=${task.entityId}&taskId=${task.id}`,
          dueAtFormatted: DateTime.fromISO(task.dueAt).toLocaleString(
            DateTime.DATE_HUGE
          ),
          paymentFrequency: enumToCapitalizedString(task.paymentFrequency),
        },
        template: {
          title: `Invoice from ${from}`,
          preheader: `Your Latest Invoice from ${from}`,
        },
        user: {
          firstName: toData[i].firstName ?? '',
        },
      };

      const emailParams = {
        senderAddress: FROM_EMAIL ?? '',
        toAddresses: [toData[i].email],
        templateName,
        templateData,
      };

      requests.push(sendEmail(emailParams));
    }

    const response = await Promise.all(requests);
    console.log('response: ', response);
  }
}

export const DATE_TIME_FREQUENCY_MAP: {
  [key in Exclude<PaymentFrequency, PaymentFrequency.ONCE>]: {
    label: string;
    multiplier: number;
  };
} = {
  [PaymentFrequency.WEEKLY]: {
    label: 'weeks',
    multiplier: 1,
  },
  [PaymentFrequency.FORTNIGHTLY]: {
    label: 'weeks',
    multiplier: 2,
  },
  [PaymentFrequency.MONTHLY]: {
    label: 'months',
    multiplier: 1,
  },
  [PaymentFrequency.QUARTERLY]: {
    label: 'months',
    multiplier: 3,
  },
  [PaymentFrequency.ANNUALLY]: {
    label: 'years',
    multiplier: 1,
  },
};
