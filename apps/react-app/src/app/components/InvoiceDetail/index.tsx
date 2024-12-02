import React from 'react';
import { InvoiceDetail } from './InvoiceDetail';
import { useTranslation } from 'react-i18next';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { DATE_FORMATS } from '@admiin-com/ds-common';
import { InvoiceStatus, PaymentFrequency } from '@admiin-com/ds-graphql';
import { DateTime } from 'luxon';
import { useWatch } from 'react-hook-form';
interface Props {
  handleNext: () => void;
  onDraft: () => void;
  onPreview: () => void;
}

const InvoiceDetailContainer = (props: Props) => {
  const { t } = useTranslation();
  const { entity } = useSelectedEntity();
  const invoiceStatus = useWatch({ name: 'invoiceStatus' });

  const inputs = React.useMemo(
    () => ({
      from: {
        label: t('from', { ns: 'taskbox' }),
        name: 'from' as const,
        type: 'text',
        defaultValue: entity,
        placeholder: t('atoOptional', { ns: 'taskbox' }),
        rules: { required: t('fromRequired', { ns: 'taskbox' }) },
      },
      to: {
        label: t('to', { ns: 'taskbox' }),
        name: 'to' as const,
        type: 'text',
        defaultValue: undefined,
        placeholder: t('selectContact', { ns: 'taskbox' }),
        rules: { required: t('toRequired', { ns: 'taskbox' }) },
      },
      paymentFrequency: {
        label: t('paymentFrequency', { ns: 'taskbox' }),
        name: 'paymentFrequency' as const,
        type: 'text',
        placeholder: t('selectOption', { ns: 'taskbox' }),
        defaultValue: PaymentFrequency.ONCE,
        rules: { required: t('paymentFrequencyRequired', { ns: 'taskbox' }) },
      },
      numberOfPayments: {
        label: t('numberOfPayments', { ns: 'taskbox' }),
        name: 'numberOfPayments' as const,
        type: 'number',
        placeholder: 'e.g. 6',
        defaultValue: 0,
        rules: {
          validate: (value: any) => {
            if (!Number.isInteger(Number(value))) {
              return t('numberPaymentsMustBeInteger', { ns: 'taskbox' });
            }
            if (value < 2 || value > 24) {
              return t('numberPaymentsMinMax', { ns: 'taskbox' });
            }
            return true;
          },
        },
      },
      dueAt: {
        label: t('dueAt', { ns: 'taskbox' }),
        name: 'amount' as const,
        type: 'date',
        placeholder: DATE_FORMATS.USER_DATE,
        defaultValue: '',
        rules: { required: t('dueAtRequired', { ns: 'taskbox' }) },
      },
      paymentAt: {
        label: t('paymentAt', { ns: 'taskbox' }),
        name: 'paymentAt' as const,
        type: 'date',
        placeholder: DATE_FORMATS.USER_DATE,
        defaultValue: '',
        rules: {},
      },
      firstPaymentAt: {
        label: t('firstPaymentAt', { ns: 'taskbox' }),
        name: 'firstPaymentAt' as const,
        type: 'date',
        placeholder: DATE_FORMATS.USER_DATE,
        defaultValue: '',
        rules: {
          required: t('firstPaymentAtRequired', { ns: 'taskbox' }),
        },
      },
      referenceNumber: {
        label: t('referenceNumber', {
          ns: 'taskbox',
        }),
        name: 'reference' as const,
        type: 'text',
        placeholder: `INV34356`,
        defaultValue: undefined,
        rules: {
          validate: {
            referenceIsRequired: (value: string) => {
              if (!value) {
                return t('referenceRequired', { ns: 'taskbox' });
              }
              //else if (
              //  type !== TaskType.SIGN_ONLY &&
              //  value &&
              //  value.length > 18
              //) {
              //  return t('referenceTooLong', { ns: 'taskbox', max: 18 });
              //}

              //TODO: disabled for now - implemented to prevent invalid reference on bank statement. Can do with solution with string replace on server - Zai
              //else if (!/^[a-zA-Z0-9\s.\-():]+$/.test(value)) {
              //  return t('invalidReferenceCharacter', { ns: 'taskbox' });
              //}

              return true;
            },
          },
        },
      },
      documents: {
        label: t('supportingDocuments', { ns: 'taskbox' }),
        name: 'documents' as const,
        type: 'file',
        defaultValue: [],
        placeholder: t('selectFile', { ns: 'taskbox' }),
        // rules: {
        //   validate: (value: any) => {
        //     const failed =
        //       value === null || value === undefined || value.length === 0;

        //     return !failed || t('documentRequired', { ns: 'taskbox' });
        //   },
        // },
        rules: {},
      },
      note: {
        label: t('comments', { ns: 'taskbox' }),
        name: 'notes' as const,
        type: 'text',
        placeholder: `${t(
          invoiceStatus === InvoiceStatus.INVOICE
            ? 'invoiceCommentsPlaceholder'
            : 'quoteCommentsPlaceholder',
          { ns: 'taskbox' }
        )}`,
        defaultValue: undefined,
        rules: {},
      },
      issueAt: {
        label: t('issueAt', { ns: 'taskbox' }),
        name: 'issueAt' as const,
        type: 'date',
        placeholder: DATE_FORMATS.USER_DATE,
        defaultValue: DateTime.now().toFormat(DATE_FORMATS.BACKEND_DATE),
        rules: { required: t('issueAtRequired', { ns: 'taskbox' }) },
      },
    }),
    [t, entity, invoiceStatus]
  );
  return <InvoiceDetail {...props} inputs={inputs} />;
};

export default InvoiceDetailContainer;
