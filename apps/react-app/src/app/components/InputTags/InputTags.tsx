import React, { forwardRef, useState } from 'react';
import { WBChip, WBIcon, WBIconButton, WBTextField } from '@admiin-com/ds-web';
import {
  AutocompleteProps as MUIAutocompleteProps,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { Autocomplete } from 'libs/design-system-web/src/lib/components/composites/Autocomplete/Autocomplete';
import { TextFieldProps } from 'libs/design-system-web/src/lib/components/composites/TextField/TextField';

interface InputTagsProps extends TextFieldProps {
  tags: string[];
  addTag: (tag: string) => boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  removeTag: (index: number) => void;
}
// Refactor to forwardRef
export const InputTags = forwardRef<any, any>(function InputTags<T>(
  {
    tags,
    addTag,
    inputValue,
    setInputValue,
    removeTag,
    ...props
  }: InputTagsProps,
  ref: any
) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      (event.key === 'Enter' || event.key === ' ' || event.key === ',') &&
      inputValue.trim() !== ''
    ) {
      if (addTag(inputValue.trim())) {
        setInputValue(''); // Clear the input
        event.preventDefault(); // Prevent default behavior like form submission
      }
    } else if (
      event.key === 'Backspace' &&
      tags.length > 0 &&
      inputValue === ''
    ) {
      // Remove the last tag if backspace is pressed and input is empty
      // setTags((prevTags) => prevTags.slice(0, -1));
      removeTag(tags.length - 1);
    } else if (event.key === 'Enter' && inputValue.trim() === '') {
      event.preventDefault();
    }
  };

  const handleInputChange = (event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  const handleTagDelete = (indexToDelete: number) => {
    // setTags((prevTags) =>
    //   prevTags.filter((_, index) => index !== indexToDelete)
    // );
    removeTag(indexToDelete);
  };

  const theme = useTheme();
  return (
    <Autocomplete
      multiple
      freeSolo
      value={tags}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      onKeyDown={handleKeyDown}
      renderTags={(value: T[], getTagProps) =>
        (value as string[]).map((option: string, index: number) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <WBChip
              variant="filled"
              label={option}
              key={key}
              {...tagProps}
              sx={{
                borderRadius: 0,
                width: { xs: '100%', sm: 'auto' },
                bgcolor: 'primary.900',
                color: 'primary.main',
                paddingX: 0.55,
              }}
              deleteIcon={
                <WBIconButton
                  sx={{
                    borderRadius: 0,
                    bgcolor: 'primary.900',
                    color: 'primary.main',
                    margin: 0,
                    padding: 0,
                  }}
                  iconSize={'small'}
                  icon="Close"
                  color={theme.palette.primary.main as any}
                  onClick={(event) => {
                    event.stopPropagation(); // Ensure that event doesn't bubble up
                    handleTagDelete(index); // Call your delete handler
                  }}
                />
              }
              onDelete={(event) => {
                event.stopPropagation(); // Ensure that event doesn't bubble up
                handleTagDelete(index); // Call your delete handler
              }}
            />
          );
        })
      }
      disableClearable
      renderInput={(params) => (
        <WBTextField multiline sx={{ mt: 1 }} {...params} {...props} />
      )}
      options={[]}
      sx={{
        width: '100%', // Ensure the entire Autocomplete component takes full width
      }}
    />
  );
});
