import { WBDialog, WBFlex, WBIconButton } from '@admiin-com/ds-web';

export interface XModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function XModal({ open, children, onClose }: XModalProps) {
  return (
    <WBDialog
      open={open}
      maxWidth={'sm'}
      fullWidth
      sx={{ '& .MuiPaper-root': { overflow: 'visible' } }}
    >
      <WBFlex
        flexDirection={'row'}
        height={'100%'}
        position={'relative'}
        justifyContent={'center'}
      >
        <WBFlex overflow={'scroll'} width="100%">
          {children}
        </WBFlex>
        <WBIconButton
          aria-label="close"
          icon="Close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
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

export default XModal;
