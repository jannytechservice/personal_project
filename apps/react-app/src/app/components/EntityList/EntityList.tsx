import { WBBox } from '@admiin-com/ds-web';
import { EntityCardList } from './EntityCardList/EntityCardList';
import { EntityTableList } from './EntityTableList/EntityTableList';
import React from 'react';
import { useUpcomingPayments } from '../../hooks/useUpcomingPayments/useUpcomingPayments';
import ConfirmPaymentsDlg from '../../pages/ConfirmPaymentsDlg/ConfirmPaymentsDlg';

export enum EntityListView {
  CARD_VIEW,
  TABLE_VIEW,
}
interface EntityListProps {
  mode: EntityListView;
}

export function EntityList(props: EntityListProps) {
  const [confirmPaymentModalOpen, setConfirmPaymentModalOpen] = React.useState<
    'Confirmed' | false | true
  >(false);

  const { paymentsData, dashboardData, loading } = useUpcomingPayments();
  React.useEffect(() => {
    if (paymentsData?.length > 0 && confirmPaymentModalOpen === false) {
      setConfirmPaymentModalOpen(true);
    }
  }, [paymentsData]);

  return (
    <>
      {props.mode === EntityListView.CARD_VIEW ? (
        <WBBox height={'100%'}>
          <EntityCardList dashboardData={dashboardData} loading={loading} />
        </WBBox>
      ) : (
        <EntityTableList dashboardData={dashboardData} loading={loading} />
      )}

      <ConfirmPaymentsDlg
        payments={paymentsData ?? []}
        open={confirmPaymentModalOpen === true}
        onClose={() => setConfirmPaymentModalOpen('Confirmed')}
      />
    </>
  );
}
