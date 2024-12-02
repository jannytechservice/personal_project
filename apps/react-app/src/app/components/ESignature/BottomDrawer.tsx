import { WBDrawer } from '@admiin-com/ds-web';

export const BottomDrawer = ({ children }: { children: React.ReactNode }) => {
  return (
    <WBDrawer
      open={true}
      anchor="bottom"
      sx={{
        zIndex: '1300',
        display: ['flex', 'none'],
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%' },
      }}
      variant="permanent"
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        sx: {
          width: '100%',
          display: 'flex',
          pointerEvents: 'auto', // Ensure children get events
          boxShadow: 10,
        },
      }}
    >
      {children}
    </WBDrawer>
  );
};
