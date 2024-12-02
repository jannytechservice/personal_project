import { TaskDirection } from '@admiin-com/ds-graphql';
import { WBBox, WBFlex, WBStack, WBTypography } from '@admiin-com/ds-web';
import { Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { EntityCardBadge } from './EntityCardBadge';
import React from 'react';
import { EntityTaskCardData } from '../../hooks/useUpcomingPayments/useUpcomingPayments';
import { EntityCardTooltip } from './EntityCardTooltip';

interface EntityCardTasksProps {
  entity?: EntityTaskCardData;
  direction: TaskDirection;
  onClick?: () => void;
}

export function EntityCardTasks({
  entity: data,
  direction,
  onClick,
  ...props
}: EntityCardTasksProps) {
  const { t } = useTranslation();
  if (!data) return <Skeleton width="100%" height={'80px'} />;
  return (
    //<WBTooltip
    //  enterTouchDelay={10}
    //  leaveTouchDelay={10000}
    //  {...props}
    //  PopperProps={{
    //    style: {
    //      maxWidth: 'none', // Removes the default maxWidth
    //    },
    //  }}
    //  // disableHoverListener={!entity}
    //  title={
    //    <WBList dense sx={{ px: 3, maxWidth: 'none' }} disc>
    //      <WBListItem
    //        dense
    //        sx={{
    //          p: 0,
    //        }}
    //      >
    //        <WBListItemText
    //          primary={
    //            <>
    //              <b>{data.numberPaySign}</b>{' '}
    //              {t('paidSignedDocuments', {
    //                ns: 'dashboard',
    //                count: data.numberPaySign,
    //              })}{' '}
    //              <b>{t('paid', { ns: 'taskbox' })}</b>{' '}
    //              {t('and', { ns: 'common' })}{' '}
    //              <b>{t('signed', { ns: 'taskbox' })}</b>
    //            </>
    //          }
    //          primaryTypographyProps={{
    //            fontWeight: 'medium',
    //            fontSize: 'body2.fontSize',
    //          }}
    //        />
    //      </WBListItem>
    //      <WBListItem dense sx={{ p: 0 }}>
    //        <WBListItemText
    //          primaryTypographyProps={{
    //            fontWeight: 'medium',
    //            fontSize: 'body2.fontSize',
    //          }}
    //          primary={
    //            <>
    //              {' '}
    //              <b>{data.numberPay}</b>{' '}
    //              {t('paidSignedDocuments', {
    //                ns: 'dashboard',
    //                count: data.numberPay,
    //              })}{' '}
    //              <b>{t('paid', { ns: 'taskbox' })}</b>
    //            </>
    //          }
    //        ></WBListItemText>
    //      </WBListItem>
    //
    //      <WBListItem dense sx={{ p: 0 }}>
    //        <WBListItemText
    //          primaryTypographyProps={{
    //            fontWeight: 'medium',
    //            fontSize: 'body2.fontSize',
    //          }}
    //          primary={
    //            <>
    //              {' '}
    //              <b>{data.numberSign}</b>{' '}
    //              {t('paidSignedDocuments', {
    //                ns: 'dashboard',
    //                count: data.numberSign,
    //              })}{' '}
    //              <b>{t('signed', { ns: 'taskbox' })}</b>
    //            </>
    //          }
    //        ></WBListItemText>
    //      </WBListItem>
    //    </WBList>
    //  }
    //>
    <WBBox onClick={onClick}>
      <WBStack
        flexDirection={'row'}
        p={2}
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        <WBBox flex={1} pr={1}>
          <WBTypography
            color="text.primary"
            sx={{ opacity: 0.5 }}
            mb={0.5}
            mr={[0, 2]}
            variant="body2"
            fontWeight="bold"
          >
            {direction === TaskDirection.RECEIVING
              ? t('inbox', { ns: 'dashboard' })
              : t('sent', { ns: 'dashboard' })}
          </WBTypography>
          <CurrencyNumber number={data.amount} />
        </WBBox>
        <WBFlex alignItems={'center'} width={'100%'} justifyContent={'end'}>
          {data.count > 0 ? (
            <EntityCardTooltip data={data} props={props}>
              <WBBox>
                <EntityCardBadge
                  amount={data.count}
                  color={data.overdue > 0 ? 'error' : 'warning'}
                />
              </WBBox>
            </EntityCardTooltip>
          ) : (
            <WBBox>
              <EntityCardBadge
                amount={data.count}
                color={data.overdue > 0 ? 'error' : 'warning'}
              />
            </WBBox>
          )}
        </WBFlex>
      </WBStack>
      {/* <Skeleton width={'100%'} height={'80px'} /> */}
    </WBBox>
    //</WBTooltip>
  );
}
