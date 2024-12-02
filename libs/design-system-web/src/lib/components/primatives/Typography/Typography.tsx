import React from 'react';
import {
  Typography as MUITypography,
  TypographyProps as MUITypographyProps,
} from '@mui/material';

export const Typography = React.forwardRef<any, MUITypographyProps>(
  (
    {
      variant = 'body1',
      textAlign = 'left',
      color = 'text.primary',
      ...props
    }: MUITypographyProps<any>,
    ref
  ) => {
    return (
      <MUITypography
        variant={variant}
        ref={ref}
        textAlign={textAlign}
        color={color}
        {...props}
      ></MUITypography>
    );
  }
);
