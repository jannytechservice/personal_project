import { WBButton, WBFlex, WBSvgIcon, WBTypography } from '@admiin-com/ds-web';
import { styled, useTheme } from '@mui/material';
import SignSvg from '../../../assets/icons/signature-icon.svg';
import PlusSvg from '../../../assets/icons/plus.svg';

interface Props {
  name?: string;
  onClick?: () => void;
}
const AddNewButton = (props: Props) => {
  const theme = useTheme();

  return (
    <Container variant="outlined" onClick={props.onClick}>
      <WBFlex
        sx={{ flexDirection: 'row' }}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <WBFlex>
          <WBSvgIcon fontSize="small" fill={theme.palette.primary.main}>
            <SignSvg />
          </WBSvgIcon>
          <WBTypography
            ml={2}
            fontSize={'body1.fontSize'}
            fontWeight={'medium'}
            color={'primary.main'}
            mr={3}
          >
            {props.name}
          </WBTypography>
        </WBFlex>
        <WBSvgIcon fill={theme.palette.primary.main} fontSize="small">
          <PlusSvg />
        </WBSvgIcon>
      </WBFlex>
    </Container>
  );
};

const Container = styled(WBButton)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  fontWeight: 'normal',
  borderWidth: 1,
  '&:hover': {
    borderWidth: 1,
  },
  padding: theme.spacing(1.5),
}));

export default AddNewButton;
