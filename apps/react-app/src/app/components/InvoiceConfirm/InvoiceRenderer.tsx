import React, { useEffect, useState } from 'react';
import Handlebars from 'handlebars';
import { invoiceString } from '@admiin-com/ds-common'; // Adjust the path as necessary
import { WBBox } from '@admiin-com/ds-web';
import { useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { BillCreateFormData } from '../../pages/TaskCreation/TaskCreation';
import { getAmountFromLineItems } from '../../helpers/tasks';
import { formatCurrency } from '../../helpers/string';

// 'isEven' helper for handlebars
Handlebars.registerHelper('isEven', function (index) {
  return index % 2 === 0;
});

const hexWithOpacity = (hex: string, opacity: number) => {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${alpha}`;
};

const InvoiceRenderer = () => {
  const theme = useTheme();
  const [compiledHtml, setCompiledHtml] = useState('');
  const { watch } = useFormContext<BillCreateFormData>();
  // Sample data object to replace placeholders in the template

  const values = watch();

  const { subTotal, totalGST, total } = React.useMemo(
    () => getAmountFromLineItems(values.lineItems),
    [values.lineItems]
  );

  useEffect(() => {
    const invoiceData = {
      //task: { reference: values.reference, dueAt: values.dueAt },
      to: {
        name: values.to?.name ?? '',
        taxNumber: values.to?.taxNumber,
        address: values.to?.address?.address1,
      },
      from: {
        name: values.from?.name,
        taxNumber: values.from?.taxNumber,
        address: values.from?.address?.address1,
        contact: { email: values.from?.contact?.email },
        website: values?.from?.contact?.website,
        brandColor: values?.from?.brandColor ?? theme.palette.primary.main,
        brandColorLight: hexWithOpacity(theme.palette.primary.main, 0.1),
      },
      lineItem: values.lineItems.map((item, index) => ({
        description: item.description,
        unitPrice: item.unitAmount?.toString(),
        qty: item.quantity?.toString(),
        gst: item.taxType?.toString(),
        amount: item.lineAmount?.toString(),
      })),
      //TODO: receive account from airwallex
      receivingAccount: {
        accountName: 'ABC Corp',
        routingNumber: '123-456',
        number: '78901234',
      },
      task: {
        reference: values.reference,
        dueAt: values.dueAt,
        notes: values.notes,
      },
      pageNumber: 1,
      pageCount: 1,
      subTotal: formatCurrency(subTotal),
      totalGST: formatCurrency(totalGST),
      total: formatCurrency(total),
    };

    // Compile the Handlebars template with data
    const template = Handlebars.compile(invoiceString);
    const html = template(invoiceData);
    setCompiledHtml(html);
  }, [subTotal, theme.palette.primary.main, total, totalGST, values]);

  return (
    <WBBox
      sx={{
        backgroundColor: 'white',
        color: 'black',
        width: '100%',
      }}
    >
      <WBBox
        sx={{
          p: 2,
          backgroundColor: 'white',
          width: '100%',
        }}
        dangerouslySetInnerHTML={{ __html: compiledHtml }}
      />
    </WBBox>
  );
};

export default InvoiceRenderer;
