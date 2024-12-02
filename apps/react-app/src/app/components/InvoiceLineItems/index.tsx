import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { WBBox, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { styled, useMediaQuery, useTheme } from '@mui/material';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import LineItemsTable from './LineItemsTable';
import LineItemsMobile from './LineItemsMobile';
import { InvoiceCreateButtons } from '../InvoiceCreateForm/InvoiceCreateButtons';
import { useFormContext, useWatch } from 'react-hook-form';
import { LineItem } from '@admiin-com/ds-graphql';
import { getAmountFromLineItems } from '../../helpers/tasks';

interface Props {
  handleNext: () => void;
  onDraft: () => void;
  onPreview: () => void;
}
export default function InvoiceLineItems({
  handleNext,
  onDraft,
  onPreview,
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { setValue } = useFormContext();

  const rows = useWatch({ name: 'lineItems' });

  const setRows = (rows: LineItem[]) => {
    setValue('lineItems', rows);
  };

  const { subTotal, totalGST, total } = React.useMemo(
    () => getAmountFromLineItems(rows),
    [rows]
  );

  const onNext = () => {
    handleNext();
  };

  const onDraftClick = () => {
    onDraft();
  };
  return (
    <Container>
      <Content>
        {isMobile ? (
          <LineItemsMobile rows={rows} setRows={setRows} />
        ) : (
          <LineItemsTable setRows={setRows} rows={rows} />
        )}
        <FooterContainer>
          <WBBox width={['100%', 300]}>
            <FooterRow>
              <WBTypography fontWeight={'bold'}>
                {t('subTotal', { ns: 'taskbox' })}
              </WBTypography>
              <CurrencyNumber
                number={subTotal}
                sup={false}
                fontWeight={'normal'}
              />
            </FooterRow>
            <FooterRow>
              <WBTypography fontWeight={'bold'}>
                {t('totalGST', { ns: 'taskbox' })}
              </WBTypography>
              <CurrencyNumber
                number={totalGST}
                sup={false}
                fontWeight={'normal'}
              />
            </FooterRow>
            <FooterRow>
              <WBTypography fontWeight={'bold'}>
                {t('total', { ns: 'taskbox' })}
              </WBTypography>
              <CurrencyNumber
                mb={0}
                variant="h3"
                number={total}
                sup={false}
                fontWeight={'bold'}
              />
            </FooterRow>
          </WBBox>
        </FooterContainer>
      </Content>

      <InvoiceCreateButtons
        onDraft={onDraftClick}
        onPreview={onPreview}
        handleNext={onNext}
        isValid={true}
      />
    </Container>
  );
}
const Container = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  alignItems: 'end',
  backgroundColor: theme.palette.background.default,
}));

const Content = styled(WBBox)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
}));

const FooterRow = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}));

const FooterContainer = styled(WBFlex)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.text.secondary}`,
  flexDirection: 'column',
  padding: theme.spacing(3, 2),
  width: '100%',
  alignItems: 'end',
  [theme.breakpoints.down('sm')]: {
    alignItems: 'start',
  },
}));
