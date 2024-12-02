import * as React from 'react';
import {
  WBCard,
  WBCardContent,
  WBFlex,
  WBGrid,
  WBTypography,
} from '@admiin-com/ds-web';
import { EntityCardItem } from '../../EntityCardItem/EntityCardItem';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../../CurrencyNumber/CurrencyNumber';
import { DashboardData } from '../../../hooks/useUpcomingPayments/useUpcomingPayments';

interface EntityCardListProps {
  dashboardData?: DashboardData;
  loading: boolean;
}
export function EntityCardList({
  dashboardData,
  loading,
}: EntityCardListProps) {
  const { t } = useTranslation();

  return (
    <>
      {dashboardData && dashboardData.entities.length > 0 && (
        <WBFlex flexDirection={'column'} sx={{ overflowY: 'scroll' }}>
          <WBGrid container spacing={2} mb={[3, 0]} alignItems="stretch">
            {dashboardData?.entities.map((entityData, index) => (
              <WBGrid xs={12} md={6} key={index}>
                <EntityCardItem entity={entityData} />
              </WBGrid>
            ))}
          </WBGrid>
          <WBFlex flexGrow={1}></WBFlex>
          <WBCard>
            <WBCardContent>
              <WBFlex
                justifyContent={'space-between'}
                alignItems={['start', 'center']}
                flexDirection={['column', 'row']}
              >
                <WBTypography
                  sx={(theme) => ({ ...theme.typography.h3, mb: [1, 0] })}
                >
                  {t('total', { ns: 'dashboard' })}
                </WBTypography>
                <WBFlex
                  flexDirection={['column', 'column', 'row']}
                  width={{ xs: '100%', sm: 'auto' }}
                >
                  <WBFlex mr={[0, 0, 5]} justifyContent={'space-between'}>
                    <WBTypography mr={2}>
                      {t('inbox', { ns: 'dashboard' })}
                    </WBTypography>
                    <CurrencyNumber
                      number={dashboardData.inboxAmount ?? 0}
                      sup={false}
                    />
                  </WBFlex>
                  <WBFlex justifyContent={'space-between'}>
                    <WBTypography mr={2}>
                      {t('sent', { ns: 'dashboard' })}
                    </WBTypography>
                    <CurrencyNumber
                      number={dashboardData.outboxAmount ?? 0}
                      sup={false}
                    />
                  </WBFlex>
                </WBFlex>
              </WBFlex>
            </WBCardContent>
          </WBCard>
        </WBFlex>
      )}
      {loading && (
        <WBGrid container spacing={2}>
          <WBGrid xs={12} md={6}>
            <EntityCardItem entity={undefined} />
          </WBGrid>
          <WBGrid xs={12} md={6}>
            <EntityCardItem entity={undefined} />
          </WBGrid>
        </WBGrid>
      )}
    </>
  );
}
