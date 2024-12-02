import React, { FormEvent } from 'react';
import { BoxProps } from '@mui/material';
import { Flex } from '../Flex/Flex';

interface FormProps extends BoxProps {
  onSubmit: (e: FormEvent) => void;
}
export const Form = React.forwardRef<any, FormProps>(
  ({ ...props }: FormProps, ref) => {
    return (
      <Flex component="form" flexDirection="column" mt={3} {...props} ref={ref}>
        {props.children}
      </Flex>
    );
  }
);
