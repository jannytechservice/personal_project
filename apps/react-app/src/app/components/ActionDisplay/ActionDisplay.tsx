import {
  WBBox,
  WBIconButton,
  WBMenu,
  WBMenuItem,
  WBSvgIcon,
  useTheme,
  SxProps,
  Theme,
} from '@admiin-com/ds-web';
import DotIcon from '../../../assets/icons/tripledot.svg';
import React from 'react';

export type ActionMenuItem = {
  title: string;
  action?: () => void;
  disabled?: boolean;
  color?: string;
};

export interface ActionDisplayProps {
  items: ActionMenuItem[];
  children?: React.ReactNode;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export function ActionDisplay({
  items,
  disabled,
  children,
  sx = {},
}: ActionDisplayProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <WBBox onClick={(event: any) => event.stopPropagation()} sx={{ ...sx }}>
      <WBIconButton
        onClick={(event) => {
          event.stopPropagation();
          handleOpenMenu(event);
        }}
        disabled={disabled}
      >
        <WBSvgIcon fontSize="small">
          <DotIcon />
        </WBSvgIcon>
      </WBIconButton>
      {children ? children : null}
      <WBMenu
        sx={{ mt: -2 }}
        id="customized-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {items?.map((item) => (
          <WBMenuItem
            disabled={item.disabled}
            key={item.title}
            onClick={() => {
              item?.action && item?.action();
              handleMenuClose();
            }}
            sx={{
              ...theme.typography.body2,
              fontWeight: 'bold',
              ...(item.color && { color: item.color }),
            }}
          >
            {item.title}
          </WBMenuItem>
        ))}
      </WBMenu>
    </WBBox>
  );
}

export default ActionDisplay;
