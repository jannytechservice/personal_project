import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DialogProps, useMediaQuery, useTheme } from '@mui/material';
import { WBButton, WBDialog, WBDrawer } from '../..';

/* eslint-disable-next-line */
export interface ConfirmationDialogueProps extends DialogProps {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  noPadding?: boolean;
  defaultZIndex?: boolean;
  onOK: () => void;
  title: string;
  loading?: boolean;
  okTitle?: string;
  cancelTitle?: string;
}

export function ConfirmationDialogue({
  children,
  open,
  onClose,
  title,
  loading,
  defaultZIndex,
  noPadding,
  onOK,
  okTitle,
  cancelTitle,
  ...props
}: ConfirmationDialogueProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const content = (
    <>
      <DialogTitle variant="h4">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <WBButton autoFocus variant="outlined" onClick={onClose}>
          {cancelTitle ?? 'Cancel'}
        </WBButton>
        <WBButton onClick={onOK} loading={loading}>
          {okTitle ?? 'Ok'}
        </WBButton>
      </DialogActions>
    </>
  );

  return !isMobile ? (
    <WBDialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: { padding: noPadding ? 0 : 4 },
      }}
      sx={{
        display: { xs: 'none', sm: 'block' },
      }}
      {...props}
    >
      {content}
    </WBDialog>
  ) : (
    <WBDrawer
      anchor={'bottom'}
      open={open}
      onClose={onClose}
      sx={{
        zIndex: !defaultZIndex ? 2000 : 'auto',
        display: { xs: 'block', sm: 'none' },
        pointerEvents: 'auto', // Allow events to pass through
      }}
      PaperProps={{
        sx: {
          width: '100%',
          display: 'flex',
          p: noPadding ? 0 : 2,
          pointerEvents: 'auto', // Ensure children get events
        },
      }}
    >
      {content}
    </WBDrawer>
  );
}

export default ConfirmationDialogue;
