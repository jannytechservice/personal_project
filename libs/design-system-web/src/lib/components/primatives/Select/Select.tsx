import { forwardRef } from 'react';
import { MenuItem } from '@mui/material';
import {
  TextField,
  TextFieldProps,
} from '../../composites/TextField/TextField';
import { Icon } from '../Icon/Icon';
import { WBIcon, WBTypography } from '../..';

export interface SelectProps extends TextFieldProps {
  options?:
    | {
        value: string | number;
        label: string;
        group?: string;
      }[];
  helperText?: string;
  label?: string;
  fullWidth?: boolean;
  multiple?: boolean;
  infoTooltip?: string;
}
export type Ref = HTMLDivElement;

export const Select = forwardRef<Ref, SelectProps>(
  (
    {
      options = [],
      fullWidth = true,
      multiple = false,
      inputProps,
      helperText,
      infoTooltip,
      children,
      sx,
      InputProps = {},
      SelectProps,
      ...props
    },
    ref
  ) => {
    const hasInfoIcon = infoTooltip ? true : false;
    return (
      <TextField
        inputRef={ref}
        variant="standard"
        fullWidth={fullWidth}
        select
        placeholder={props.placeholder}
        sx={sx}
        SelectProps={{
          IconComponent: (iconProps) => (
            <Icon name="ChevronDown" {...iconProps} size={1.5} color={'#000'} />
          ),
          displayEmpty: true,
          placeholder: props.placeholder,
          renderValue: (selected: any) => {
            if (selected === '' || selected?.length === 0) {
              return (
                <WBTypography sx={{ opacity: 0.3 }} fontSize={'inherit'}>
                  {props.placeholder}
                </WBTypography>
              ); // Render placeholder when value is empty
            }
            // Display the selected option(s)
            if (multiple) {
              return selected.join(', ');
            }
            return (
              options.find((option) =>
                typeof option === 'string' ? option : option?.value === selected
              )?.label || selected
            );
          },
          ...SelectProps,
          value: props.value ?? props.placeholder,
        }}
        InputProps={InputProps}
        helperText={helperText}
        error={props.error}
        {...props}
        label={
          props.label ? (
            <>
              {props.label}{' '}
              {hasInfoIcon ? (
                <WBIcon
                  size={2}
                  library="ioniconSharp"
                  name="InformationCircle"
                />
              ) : null}
            </>
          ) : null
        }
      >
        {options.length > 0 && props.placeholder && (
          <MenuItem disabled value="">
            <em>{props.placeholder}</em>
          </MenuItem>
        )}
        {children ??
          options
            .filter((option) => option != null)
            .map((option) => (
              <MenuItem
                key={typeof option === 'string' ? option : option?.value}
                value={typeof option === 'string' ? option : option?.value}
              >
                {(typeof option === 'string' ? option : option?.label) ??
                  props.placeholder}
              </MenuItem>
            ))}
      </TextField>
    );
  }
);
