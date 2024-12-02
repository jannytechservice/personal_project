import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { fetchAuthSession } from 'aws-amplify/auth';
import React, { useEffect, useRef, useState } from 'react';
import {
  imageResizer,
  WBBox,
  WBButton,
  WBInputError,
  WBLink,
} from '@admiin-com/ds-web';
import { S3Avatar } from '../S3Avatar/S3Avatar';
import { Image, IMAGE_EXTENSIONS, S3Level } from '@admiin-com/ds-common';

export interface S3AvatarUploadProps {
  src?: string;
  imgKey?: string;
  level?: S3Level;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  alwaysKeepResolution?: boolean;
  useWebWorker?: boolean;
  sx?: SxProps<Theme>;
  companyName?: string;
  label?: string;
  onImageUpload: (img: Image) => void;
}

export const S3AvatarUpload = ({
  src,
  level = 'protected',
  imgKey,
  companyName,
  maxSizeMB = 1,
  maxWidthOrHeight = 240,
  alwaysKeepResolution = true,
  useWebWorker = true,
  onImageUpload,
  sx = {},
  label,
}: S3AvatarUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [identityId, setIdentityId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);

  console.log('identityId: ', identityId);

  useEffect(() => {
    const getIdentityId = async () => {
      const data = await fetchAuthSession();
      console.log('datadatadata: ', data);
      setIdentityId(data?.identityId ?? '');
    };
    if (level !== 'public') {
      //TODO: see if condition is required for public
      getIdentityId();
    }
  }, [level]);

  const onSelect = async () => {
    if (!inputRef.current?.files) {
      setError('Invalid upload');
      return;
    }
    if (!inputRef.current?.files) {
      setError('Invalid upload');
      return;
    }

    const selectedFile = inputRef.current.files[0];

    // Check if the selected file type is SVG
    if (selectedFile && selectedFile.type === 'image/svg+xml') {
      setError('SVG files are not allowed');
      return;
    }

    if (inputRef.current?.files.length > 1) {
      setError('Only 1 file can be uploaded for a tax bill');
    } else if (inputRef.current?.files.length === 1) {
      let file;
      if (
        maxSizeMB &&
        IMAGE_EXTENSIONS.includes(inputRef.current.files[0].type)
      ) {
        const resizeOptions = {
          maxSizeMB,
          maxWidthOrHeight,
          alwaysKeepResolution,
          useWebWorker,
        };

        file = await imageResizer(inputRef.current.files[0], resizeOptions);
      } else {
        file = inputRef.current.files[0];
      }

      setFile(file);
    }
  };

  return (
    <>
      <WBButton
        type="button"
        variant="text"
        onClick={() => inputRef.current?.click()}
      >
        <WBBox
          sx={{
            ...sx,
          }}
        >
          <S3Avatar
            companyName={companyName}
            src={src}
            imgKey={imgKey}
            sx={sx}
            identityId={identityId}
            body={file}
            contentType={file?.type}
            onUpload={onImageUpload}
          />
          <WBBox display="none">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg, image/png, image/gif, image/webp"
              //name={inputName}
              multiple={false}
              onChange={onSelect}
            />
          </WBBox>
        </WBBox>
      </WBButton>
      {label && (
        <WBLink
          variant="body2"
          underline="always"
          onClick={() => inputRef.current?.click()}
          ml={2}
        >
          {label}
        </WBLink>
      )}
      {error && <WBInputError helperText={error} />}
    </>
  );
};
