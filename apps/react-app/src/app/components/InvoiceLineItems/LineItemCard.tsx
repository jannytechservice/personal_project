import { LineItem } from '@admiin-com/ds-graphql';
import { WBBox, WBFlex, WBIconButton, WBTypography } from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import LoadSvgIcon from '../../component/LoadSvgIcon/LoadSvgIcon';
import PenIcon from '../../../assets/icons/pen-icon.svg';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';

//TODO: remove any interface
interface LineItemCardProps {
  item: LineItem | any;
  onEdit: (item: LineItem | any) => void;
}
function LineItemCard(props: LineItemCardProps) {
  const { t } = useTranslation();
  return (
    <Container>
      <WBFlex justifyContent={'space-between'} alignItems={'center'}>
        <WBTypography color={'action.disabled'}>
          {`#${props.item.id}`}
        </WBTypography>
        <WBIconButton size="small" onClick={() => props.onEdit(props.item)}>
          <LoadSvgIcon component={PenIcon} />
        </WBIconButton>
      </WBFlex>
      <WBBox>
        <WBTypography variant="h5">{props.item.description}</WBTypography>
        <WBTypography variant="body1">
          {t('qtyPrice', {
            ns: 'taskbox',
            qty: props.item.quantity,
            price: props.item.unitAmount,
          })}
        </WBTypography>
      </WBBox>
      <WBFlex justifyContent={'end'}>
        <CurrencyNumber number={props.item.lineAmount ?? 0} sup={false} />
      </WBFlex>
      <WBFlex justifyContent={'end'}>
        {`${t('GST', { ns: 'taskbox' })}  `} &nbsp;
        <CurrencyNumber
          fontWeight="normal"
          component={'span'}
          number={props.item.lineAmount ?? 0}
          sup={false}
        />
      </WBFlex>
    </Container>
  );
}

const Container = styled(WBBox)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

export default LineItemCard;
