import { userDateFromISO } from '@admiin-com/ds-common';
import { Entity, Payment, Task } from '@admiin-com/ds-graphql';
import { WBTypography } from '@admiin-com/ds-web';
import { TableCell, TableRow, styled } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ActionDisplay from '../../components/ActionDisplay/ActionDisplay';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';
const BottomBorderdTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': { border: 0 },
}));

interface UpcomingPaymentRowProps {
  entity: Entity;
  task: Task;
  payment: Payment;
}
export const UpcomingPaymentRow = ({
  payment,
  task,
  entity,
}: UpcomingPaymentRowProps) => {
  return (
    <BottomBorderdTableRow>
      <TableCell sx={{ verticalAlign: 'top' }}>
        {entity.legalName || entity.name}
      </TableCell>
      <TableCell sx={{ verticalAlign: 'top' }}>
        <CurrencyNumber sup={false} number={(payment.amount ?? 0) / 100} />
      </TableCell>
      <TableCell sx={{ verticalAlign: 'top' }}>
        {userDateFromISO(payment.scheduledAt ?? '')}
      </TableCell>
      {/*<TableCell align="right">*/}
      {/*  <ActionDisplay items={[]} disabled={true} />*/}
      {/*</TableCell>*/}

      {/* <TableCell align={primaryId !== account.id ? 'right' : 'left'}>
        {primaryId === account.id ? (
          <WBChip
            label={t('primary', { ns: 'settings' })}
            sx={{
              margin: 0,
              fontSize: '10px',
              textTransform: 'uppercase',
              bgcolor: 'common.black',
              color: 'common.white',
              mr: 3,
            }}
          />
        ) : (
          <PaymentMethodMenu
            accountDirection={accountDirection}
            paymentMethod={account}
          />
        )}
      </TableCell> */}
    </BottomBorderdTableRow>
  );
};
