import {
  WBDialog,
  WBDrawer,
  WBIconButton,
  useMediaQuery,
  useTheme,
} from '@admiin-com/ds-web';
import { DialogProps } from '@mui/material';

/* eslint-disable-next-line */
export interface SimpleDrawDlgProps extends DialogProps {
  children: React.ReactNode;
  open: boolean;
  handleClose: () => void;
  noPadding?: boolean;
  defaultZIndex?: boolean;
}

export function SimpleDrawDlg({
  children,
  open,
  handleClose,
  defaultZIndex,
  noPadding,
  ...props
}: SimpleDrawDlgProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return !isMobile ? (
    <WBDialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        sx: { padding: noPadding ? 0 : 4 },
        // zIndex: 200
      }}
      sx={{
        display: { xs: 'none', sm: 'block' },
        // zIndex: 200
      }}
      {...props}
    >
      {children}
    </WBDialog>
  ) : (
    <WBDrawer
      anchor={'bottom'}
      open={open}
      onClose={handleClose}
      sx={{
        zIndex: !defaultZIndex ? 1300 : '500',
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
      {children}
    </WBDrawer>
  );
}

export default SimpleDrawDlg;
