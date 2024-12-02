import {
  WBBox,
  WBButton,
  WBFlex,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import BankAccountsList from '../../components/BankAccountsList/BankAccountsList';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import AddPaymentMethodModal from '../../components/AddPaymentMethodModal/AddPaymentMethodModal';
import {
  AccountDirection,
  PaymentMethod,
  PaymentMethodType,
} from '@admiin-com/ds-graphql';
import VerificationDlg from '../VerificationDlg/VerificationDlg';
import { isVerifiedEntity } from '../../helpers/entities';

export function ReceivingAccounts() {
  const { t } = useTranslation();
  const [addModal, setAddModal] = React.useState<boolean>(false);
  const { entity, loading } = useSelectedEntity();

  const receivingAccounts = loading
    ? null
    : entity?.paymentMethods?.items
    ? entity?.paymentMethods?.items
        ?.filter(
          (paymentMethod: null | PaymentMethod) =>
            paymentMethod &&
            paymentMethod?.paymentMethodType === PaymentMethodType.BANK &&
            paymentMethod.accountDirection === AccountDirection.DISBURSEMENT
        )
        .filter((method: PaymentMethod | null) => method)
    : [];

  console.log('receivingAccounts: ', receivingAccounts);

  const hasPermission =
    (!loading && entity === undefined) ||
    // entity?.type === EntityType.INDIVIDUAL ||
    // entity?.type === EntityType.SOLE_TRADER ||
    !entity?.taxNumber;

  const handleAddModal = () => {
    !hasPermission && setAddModal(true);
  };

  const [openVerificationModal, setOpenVerificationModal] =
    React.useState<boolean>(false);

  const handleAdd = () => {
    if (entity && isVerifiedEntity(entity)) handleAddModal();
    else !hasPermission && setOpenVerificationModal(true);
  };

  return (
    <>
      <WBFlex
        flexDirection={'column'}
        p={[3, 5, 8]}
        pt={{ xs: 10, sm: 10, md: 10, lg: 8 }}
        position={'relative'}
        minHeight="100%"
      >
        <WBFlex
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{ backgroundColor: 'background.paper', maxWidth: '100%' }}
        >
          <WBTypography variant="h2">
            {t('receivingAccounts', { ns: 'settings' })}
          </WBTypography>
          <WBTooltip
            title={
              !hasPermission
                ? ''
                : t('notAvailableForIndividual', { ns: 'settings' })
            }
          >
            <WBBox>
              <WBButton
                type="button"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                }}
                disabled={hasPermission}
                onClick={handleAdd}
              >
                {t('addAccount', { ns: 'settings' })}
              </WBButton>
            </WBBox>
          </WBTooltip>

          {/*<Link*/}
          {/*  variant="body2"*/}
          {/*  underline="always"*/}
          {/*  fontWeight={'bold'}*/}
          {/*  color={!hasPermission ? 'primary.main' : 'action.disabled'}*/}
          {/*  display={{ xs: 'none', sm: 'block' }}*/}
          {/*  onClick={handleAdd}*/}
          {/*>*/}
          {/*  {t('addAccount', { ns: 'settings' })}*/}
          {/*</Link>*/}
        </WBFlex>

        <WBBox mt={3}>
          {!loading && hasPermission && (
            <WBTypography my={3}>
              {t('notAvailableForIndividual', { ns: 'settings' })}
            </WBTypography>
          )}
          {hasPermission ? (
            <></>
          ) : !hasPermission &&
            receivingAccounts &&
            receivingAccounts.length > 0 ? (
            <BankAccountsList
              bankAccounts={receivingAccounts}
              accountDirection={AccountDirection.DISBURSEMENT}
            />
          ) : loading ? (
            <BankAccountsList
              bankAccounts={[null, null]}
              accountDirection={AccountDirection.DISBURSEMENT}
            />
          ) : null}
        </WBBox>
        <WBBox px={{ xs: 4, md: 8, lg: 8 }}>
          <WBButton
            fullWidth
            type="submit"
            sx={{
              mb: 7,
              display: { xs: 'block', sm: 'none' },
            }}
            disabled={hasPermission}
            onClick={handleAdd}
          >
            {t('addAccount', { ns: 'settings' })}
          </WBButton>
        </WBBox>
      </WBFlex>

      {entity ? (
        <VerificationDlg
          entity={entity}
          onSuccess={handleAddModal}
          open={openVerificationModal}
          onClose={() => setOpenVerificationModal(false)}
        />
      ) : null}

      <AddPaymentMethodModal
        open={addModal}
        type="ReceivingAccount"
        handleClose={() => setAddModal(false)}
      />
    </>
  );
}

export default ReceivingAccounts;
