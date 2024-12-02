import {
  WBBox,
  WBConfirmationDialogue,
  WBFlex,
  WBIcon,
  WBIconButton,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  BoxProps,
  LinearProgress,
  linearProgressClasses,
  LinearProgressProps,
  styled,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

interface Props {
  name: string;
  id: string;
  size: string;
  progress: number;
  onClose: () => void;
  removeConfirmationTitle?: string;
  noBorderTop?: boolean;
}
export const FileUpload = ({
  removeConfirmationTitle,
  name,
  size,
  progress,
  noBorderTop,
  onClose,
}: Props) => {
  const [open, setOpen] = useState(false);
  const FileIcon =
    useTheme().palette.mode === 'dark' ? FileWhiteIcon : FileBlackIcon;

  return (
    <Container sx={{ borderTopWidth: noBorderTop ? 0 : 2 }}>
      <WBFlex justifyContent={'space-between'}>
        <WBFlex alignItems={'center'} gap={1}>
          <FileIcon />
          <WBBox>
            <WBTypography>{name}</WBTypography>
            <WBTypography color="text.secondary">{size}</WBTypography>
          </WBBox>
        </WBFlex>
        <WBIconButton
          onClick={() => {
            if (!removeConfirmationTitle) onClose();
            else if (progress == 0) setOpen(true);
          }}
        >
          <WBIcon name="Close" size={'medium'} color="grey" />
        </WBIconButton>
      </WBFlex>
      {progress > 0 && (
        <LinearProgressWithLabel value={progress} variant="determinate" />
      )}
      {removeConfirmationTitle && (
        <WBConfirmationDialogue
          open={open}
          onClose={() => setOpen(false)}
          title={removeConfirmationTitle}
          onOK={() => {
            setOpen(false);
            onClose();
          }}
        />
      )}
    </Container>
  );
};
function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <WBBox sx={{ display: 'flex', alignItems: 'center' }}>
      <WBBox sx={{ width: '100%', mr: 1 }}>
        <BorderLinearProgress variant="determinate" {...props} />
      </WBBox>
      <WBBox sx={{ minWidth: 35 }}>
        <WBTypography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</WBTypography>
      </WBBox>
    </WBBox>
  );
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));
const Container = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(1),
  border: `2px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

export const FileBlackIcon = () => {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.625 10.125V3.9375L20.8125 10.125M6.75 2.25C5.50125 2.25 4.5 3.25125 4.5 4.5V22.5C4.5 23.0967 4.73705 23.669 5.15901 24.091C5.58097 24.5129 6.15326 24.75 6.75 24.75H20.25C20.8467 24.75 21.419 24.5129 21.841 24.091C22.2629 23.669 22.5 23.0967 22.5 22.5V9L15.75 2.25H6.75Z"
        fill="black"
      />
    </svg>
  );
};
export const FileWhiteIcon = () => {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.625 10.125V3.9375L20.8125 10.125M6.75 2.25C5.50125 2.25 4.5 3.25125 4.5 4.5V22.5C4.5 23.0967 4.73705 23.669 5.15901 24.091C5.58097 24.5129 6.15326 24.75 6.75 24.75H20.25C20.8467 24.75 21.419 24.5129 21.841 24.091C22.2629 23.669 22.5 23.0967 22.5 22.5V9L15.75 2.25H6.75Z"
        fill="white"
      />
    </svg>
  );
};
