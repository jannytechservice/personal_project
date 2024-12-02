import {
  WBList,
  WBListItem,
  WBListItemText,
  WBTooltip,
} from '@admiin-com/ds-web';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ReusableWBTooltipProps {
  data: any;
  props: any;
  children: ReactNode;
}

export const EntityCardTooltip: React.FC<ReusableWBTooltipProps> = ({
  data,
  props,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <WBTooltip
      {...props}
      PopperProps={{
        style: {
          maxWidth: 'none', // Removes the default maxWidth
        },
      }}
      title={
        <WBList dense sx={{ px: 3, maxWidth: 'none' }} disc>
          <WBListItem
            dense
            sx={{
              p: 0,
            }}
          >
            <WBListItemText
              primary={
                <>
                  <b>{data.numberPaySign}</b>{' '}
                  {t('paidSignedDocuments', {
                    ns: 'dashboard',
                    count: data.numberPaySign,
                  })}{' '}
                  <b>{t('paid', { ns: 'taskbox' })}</b>{' '}
                  {t('and', { ns: 'common' })}{' '}
                  <b>{t('signed', { ns: 'taskbox' })}</b>
                </>
              }
              primaryTypographyProps={{
                fontWeight: 'medium',
                fontSize: 'body2.fontSize',
              }}
            />
          </WBListItem>
          <WBListItem dense sx={{ p: 0 }}>
            <WBListItemText
              primaryTypographyProps={{
                fontWeight: 'medium',
                fontSize: 'body2.fontSize',
              }}
              primary={
                <>
                  {' '}
                  <b>{data.numberPay}</b>{' '}
                  {t('paidSignedDocuments', {
                    ns: 'dashboard',
                    count: data.numberPay,
                  })}{' '}
                  <b>{t('paid', { ns: 'taskbox' })}</b>
                </>
              }
            ></WBListItemText>
          </WBListItem>

          <WBListItem dense sx={{ p: 0 }}>
            <WBListItemText
              primaryTypographyProps={{
                fontWeight: 'medium',
                fontSize: 'body2.fontSize',
              }}
              primary={
                <>
                  {' '}
                  <b>{data.numberSign}</b>{' '}
                  {t('paidSignedDocuments', {
                    ns: 'dashboard',
                    count: data.numberSign,
                  })}{' '}
                  <b>{t('signed', { ns: 'taskbox' })}</b>
                </>
              }
            ></WBListItemText>
          </WBListItem>
        </WBList>
      }
    >
      {children}
    </WBTooltip>
  );
};
