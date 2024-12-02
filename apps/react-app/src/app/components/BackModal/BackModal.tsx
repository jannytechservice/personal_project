import { WBDialog, WBFlex, WBIconButton } from '@admiin-com/ds-web';

/* eslint-disable-next-line */
export interface BackModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: any;
  width?: any;
  fullWidth?: boolean;
}

export function BackModal({
  open,
  onClose,
  fullWidth = true,
  height = '70vh',
  children,
}: BackModalProps) {
  return (
    <WBDialog
      open={open}
      maxWidth={'sm'}
      fullWidth={fullWidth}
      sx={{ '& .MuiPaper-root': { overflow: 'visible' } }}
    >
      <WBFlex
        flexDirection={'row'}
        height={height}
        overflow={'visible'}
        position={'relative'}
      >
        {children}
        <WBIconButton
          aria-label="close"
          icon="Close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: -40,
            top: -40,
            color: (theme) => theme.palette.grey[500],
          }}
        />
      </WBFlex>
    </WBDialog>
  );
}

export default BackModal;
