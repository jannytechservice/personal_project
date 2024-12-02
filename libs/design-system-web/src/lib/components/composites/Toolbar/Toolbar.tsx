import { Toolbar as MUIToolbar, ToolbarProps } from '@mui/material';
import React from 'react';

export const Toolbar = React.forwardRef<any, ToolbarProps>(
  (props: ToolbarProps, ref) => <MUIToolbar {...props} ref={ref} />
);
