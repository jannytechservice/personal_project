import VisaIcon from '../../../assets/icons/visa.svg';
import MasterIcon from '../../../assets/icons/mastercard.svg';
import AmexIcon from '../../../assets/icons/amex.svg';
import PayToIcon from '../../../assets/icons/payTo.svg';
import PayToIconWhite from '../../../assets/icons/payToWhite.svg';
import AddBank from '../../../assets/icons/addBank.svg';
import AddBankWhite from '../../../assets/icons/addBankWhite.svg';
import AddCard from '../../../assets/icons/addCard.svg';
import AddCardWhite from '../../../assets/icons/add-card-white.svg';

export interface CreditCardIconProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'type'> {
  type?: null | string;
  theme?: 'light' | 'dark';
}

export function CreditCardIcon({
  type,
  theme,
  width,
  height,
}: CreditCardIconProps) {
  const props: { width?: number | string; height?: number | string } = {};
  if (width) props.width = width;
  if (height) props.height = height;
  theme = 'dark';

  if (type === 'visa')
    //@ts-ignore
    return <VisaIcon {...props} />;
  else if (type === 'mastercard')
    //@ts-ignore
    return <MasterIcon {...props} />;
  else if (type === 'american_express')
    //@ts-ignore
    return <AmexIcon {...props} />;
  else if (type === 'PAYTO') {
    if (theme === 'dark') {
      //@ts-ignore
      return <PayToIconWhite {...props} />;
    }
    //@ts-ignore
    return <PayToIcon {...props} />;
  } else if (type === 'newCard') {
    if (theme === 'dark') {
      //@ts-ignore
      return <AddCardWhite {...props} />;
    }
    //@ts-ignore
    return <AddCard {...props} />;
  } else if (type === 'newBank' || type === 'BANK') {
    if (theme === 'dark') {
      //@ts-ignore
      return <AddBankWhite {...props} />;
    }
    //@ts-ignore
    return <AddBank {...props} />;
  } else return null;
}

export default CreditCardIcon;
