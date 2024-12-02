import { WBButton, WBFlex } from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import LoadSvgIcon from '../../component/LoadSvgIcon/LoadSvgIcon';
import EyeIcon from '../../../assets/icons/eye-icon.svg';
import { useTranslation } from 'react-i18next';

interface Props {
  onPreview: () => void;
  onDraft: () => void;
  handleNext: () => void;
  isValid: boolean;
}
export const InvoiceCreateButtons = ({
  onPreview,
  onDraft,
  handleNext,
  isValid,
}: Props) => {
  const { t } = useTranslation();
  return (
    <ButtonContainer>
      <NoBorderButton
        variant="outlined"
        type="button"
        onClick={onPreview}
        sx={{ mt: 1, mr: 1 }}
        fullWidth
      >
        <LoadSvgIcon component={EyeIcon} width={25} height={25} />
        &nbsp; {t('preview', { ns: 'taskbox' })}
      </NoBorderButton>
      <WBButton
        variant="outlined"
        onClick={onDraft}
        sx={{ mt: 1, mr: 1 }}
        fullWidth
      >
        {t('saveAsDraft', { ns: 'taskbox' })}
      </WBButton>
      <WBButton
        onClick={handleNext}
        sx={{ mt: 1, mr: 1 }}
        disabled={!isValid}
        fullWidth
      >
        {t('next', { ns: 'taskbox' })}
      </WBButton>
    </ButtonContainer>
  );
};
const ButtonContainer = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'row',
  width: '50%',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    flexDirection: 'column',
  },
}));

export const NoBorderButton = styled(WBButton)(({ theme }) => ({
  border: 0,
  '&:hover': {
    border: 0,
  },
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'start',
  },
}));
