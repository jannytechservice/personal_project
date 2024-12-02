import * as React from 'react';
import { WBChip, WBTableCell, WBTableRow, useTheme } from '@admiin-com/ds-web';
import { Skeleton } from '@mui/material';
import { CurrencyNumber } from '../../CurrencyNumber/CurrencyNumber';
import { useTranslation } from 'react-i18next';
import { EntityTaskData } from '../../../hooks/useUpcomingPayments/useUpcomingPayments';
import { useGotoTaskBox } from '../../../hooks/useSelectedEntity/useSelectedEntity';

interface EntityTableList {
  entity?: EntityTaskData;
}
export function EntityTableListItem({ entity: entityData }: EntityTableList) {
  const theme = useTheme();
  const { t } = useTranslation();

  const entity = entityData?.entity;
  const isOverDue =
    (entityData?.from?.overdue ?? 0) + (entityData?.to?.overdue ?? 0) > 0;
  const gotoTaskBox = useGotoTaskBox();
  if (!entityData || !entity) return <Skeleton width="100%" height={'70px'} />;

  return (
    <WBTableRow
      sx={{
        '&:hover th': {
          color: isOverDue
            ? theme.palette.error.main
            : theme.palette.primary.main,
          textDecoration: 'underline',
        },
        '&:hover': {
          cursor: 'pointer',
        },
        '&:hover .MuiTableCell-root': {
          // Added a class and apply the background color when hovering over the row
          //backgroundColor: `rgba(0,0,0,0.07)`,
        },
      }}
      onClick={() => gotoTaskBox(entity.id)}
    >
      <WBTableCell
        component="th"
        scope="row"
        sx={{ fontWeight: 'fontWeightBold' }}
      >
        {entity.name}

        {isOverDue ? (
          <WBChip
            component="span"
            label={t('overDue', {
              ns: 'taskbox',
              due:
                (entityData?.to?.overdue ?? 0) +
                (entityData?.from?.overdue ?? 0),
            })}
            color="error"
            size="small"
            sx={{
              ml: [0, 0, 2],
              fontSize: '0.76rem',
              p: [0, 0, 1],
              mt: [1, 1, 0],
            }}
          />
        ) : null}
      </WBTableCell>

      <WBTableCell
        align="right"
        component="th"
        sx={{
          fontWeight: 'fontWeightBold',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {entityData?.to?.count ?? 0}
      </WBTableCell>
      <WBTableCell
        align="right"
        sx={{
          fontWeight: 'fontWeightBold',
          textDecoration: 'none',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CurrencyNumber
          number={entityData?.to?.amount ?? 0}
          sup={false}
          textAlign={'right'}
        />
      </WBTableCell>
      <WBTableCell />
      <WBTableCell
        align="right"
        component="th"
        sx={{
          fontWeight: 'fontWeightBold',
          //borderLeft: '40px solid #FFF', // Border to simulate gap
          backgroundColor: theme.palette.background.default,
        }}
      >
        {entityData?.from?.count ?? 0}
      </WBTableCell>
      <WBTableCell
        align="right"
        sx={{
          fontWeight: 'fontWeightBold',
          textDecoration: 'none',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CurrencyNumber
          number={entityData?.from?.amount ?? 0}
          sup={false}
          textAlign={'right'}
        />
      </WBTableCell>
    </WBTableRow>
  );
}
