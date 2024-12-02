import { WBButton } from '@admiin-com/ds-web';
import { alpha, Box, LinkProps, useMediaQuery } from '@mui/material';
import React, { useRef, useState } from 'react';

interface DragDropUploadProps {
  validFileTypes: string[];
  inputAccept: string;
  maxFiles?: number;
  inputName?: string;
  onFileDrop: (files: FileList) => void;
  btnText: string;
}

export const UploadButton = ({
  validFileTypes = [],
  inputAccept,
  maxFiles = 1,
  inputName,
  onFileDrop,
  btnText, //Drag and drop files to upload
}: DragDropUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const onSelect = () => {
    if (!inputRef.current?.files) {
      setError('Invalid upload');
      return;
    } else {
      if (inputRef.current?.files.length > maxFiles) {
        setError(`Only ${maxFiles} file can be uploaded`);
      } else if (inputRef.current?.files.length === 1) {
        handleFiles(inputRef.current.files);
      }
    }
  };

  const handleFiles = (files: FileList) => {
    let isError = false;
    for (let i = 0; i < files.length; i++) {
      const invalidFileType = validFileTypes.indexOf(files[i].type) === -1;
      if (invalidFileType) {
        setError(`Invalid file type ${files[i].type}`);
        isError = true;
        break;
      }
    }

    if (!isError) {
      setError('');
      onFileDrop(files);
    }
  };

  return (
    <>
      <WBButton onClick={() => inputRef.current?.click()}>{btnText}</WBButton>

      <Box display="none">
        <input
          ref={inputRef}
          type="file"
          accept={inputAccept}
          name={inputName}
          multiple={maxFiles > 1}
          onChange={onSelect}
        />
      </Box>
    </>
  );
};
