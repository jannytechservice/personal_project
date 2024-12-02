import React from 'react';
import {
  Autocomplete as MUIAutocomplete,
  AutocompleteProps as MUIAutocompleteProps,
} from '@mui/material';

export const Autocomplete = <T,>(
  props: MUIAutocompleteProps<
    T,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >
) => {
  const focusedRef = React.useRef<any>(null);
  return (
    <MUIAutocomplete
      //value={value}
      //options={options}
      //autoComplete={autoComplete}
      //multiple={multiple}
      //renderInput={renderInput}
      //onChange={(_e, data) => onChange(data)}
      disablePortal
      {...props}
      onFocus={(e) => {
        // console.log(e);
        if (props.onFocus) props.onFocus(e);
        focusedRef.current = e.target;
      }}
      onBlur={(e) => {
        if (props.onBlur) props.onBlur(e);
        focusedRef.current = null;
      }}
      onChange={(e, data, reason) => {
        focusedRef.current?.blur();
        if (props.onChange) props.onChange(e, data, reason);
      }}
    />
  );
};
