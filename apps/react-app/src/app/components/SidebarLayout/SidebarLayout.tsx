import React from 'react';
import {
  WBBox,
  WBDrawer,
  WBFlex,
  WBIconButton,
  WBImage,
  WBSvgIcon,
} from '@admiin-com/ds-web';
import NavDrawer from '../NavDrawer/NavDrawer';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';
import Menu from '../../../assets/icons/menu.svg';
import { useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { PATHS } from '../../navigation/paths';
interface SideBarProps {
  drawerWidth: number;
  children: React.ReactNode;
  logoFullSrc: string;
  logoIconSrc: any;
  window?: () => Window;
}
export const SidebarContext = React.createContext<any>(null);

export function SidebarLayout({
  drawerWidth,
  children,
  logoFullSrc,
}: SideBarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <NavDrawer
      logo={<WBImage src={logoFullSrc} />}
      onNavigated={() => setMobileOpen(false)}
    />
  );
  const entityId = useCurrentEntityId();

  return (
    <WBFlex sx={{ height: '100%', overflow: 'hidden' }}>
      <WBBox
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <WBDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'common.black',
            },
          }}
        >
          {drawer}
        </WBDrawer>
        <WBDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              bgcolor: 'common.black',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </WBDrawer>
      </WBBox>
      <WBBox
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: { sm: `calc(100% - ${drawerWidth}px)`, xs: '100%' },
          overflow: 'hidden',
          height: '100%',
          overflowY: 'scroll',
          // width: '100%',
        }}
        key={entityId}
      >
        <SidebarContext.Provider value={{ mobileOpen, handleDrawerToggle }}>
          {children}
        </SidebarContext.Provider>
      </WBBox>
    </WBFlex>
  );
}
function MenuButton() {
  const theme = useTheme();
  const context = React.useContext(SidebarContext);
  const { pathname } = useLocation();
  const notWhiteIcon =
    pathname === PATHS.settings ||
    pathname === PATHS.referrals ||
    pathname === PATHS.rewards;
  if (!context) return;
  const { handleDrawerToggle } = context;

  return (
    <WBIconButton
      color="inherit"
      aria-label="open drawer"
      onClick={handleDrawerToggle}
      sx={{ mr: 2, display: { sm: 'none' } }}
    >
      <WBSvgIcon
        fontSize="small"
        color={
          notWhiteIcon
            ? theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.common.black
            : theme.palette.common.white
        }
      >
        <Menu />
      </WBSvgIcon>
    </WBIconButton>
  );
}

SidebarLayout.MenuButton = MenuButton;
