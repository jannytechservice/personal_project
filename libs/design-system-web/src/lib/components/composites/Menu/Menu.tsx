import React from 'react';
import {
  Menu as MUIMenu,
  MenuProps as MUIMenuProps,
  styled,
} from '@mui/material';

// Extend the existing MUIMenuProps to include the disableArrow prop
interface CustomMenuProps extends MUIMenuProps {
  disableArrow?: boolean;
}

// StyledMenu with conditional arrow rendering
export const StyledMenu = styled(MUIMenu, {
  shouldForwardProp: (prop) => prop !== 'disableArrow', // Ensure disableArrow is not passed to the underlying DOM element
})<{ disableArrow?: boolean }>(({ theme, disableArrow }) => ({
  top: '16px',
  '& .MuiList-root': {
    borderRadius: '13px',
  },
  '& .MuiPaper-root': {
    borderRadius: '15px',
    overflow: 'visible',
    boxShadow: '0 2px 12px 0 rgba(5, 8, 11, 0.09)',
    fontSize: 'body2.fontSize',
    bgcolor: 'background.default',

    ...(disableArrow
      ? {}
      : {
          backgroundImage: 'none',
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: '-19px',
            left: 'calc(50%)',
            width: 0,
            height: 0,
            transform: 'translateX(-50%)',
            borderWidth: '10px',
            borderStyle: 'solid',
            borderColor: `transparent transparent ${theme.palette.background.default} transparent`,
          },
        }),
  },
}));

// Menu component that accepts the disableArrow prop
export const Menu = ({ disableArrow = false, ...props }: CustomMenuProps) => {
  return <StyledMenu disableArrow={disableArrow} {...props} />;
};
