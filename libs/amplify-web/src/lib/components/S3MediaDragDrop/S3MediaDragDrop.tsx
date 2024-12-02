import React from 'react';
import { S3Level, Image, S3Upload } from '@admiin-com/ds-common';
import { WBBox, WBDragDropFiles, WBTypography } from '@admiin-com/ds-web';

import { LinkProps } from 'libs/design-system-web/src/lib/components/primatives/Link/Link';
import { FileUpload } from './UploadingFile';
import { useS3MediaUpload } from './useS3MediaUpload';

interface MediaUploadPreviewProps {
  maxFiles?: number;
  validFileTypes: string[];
  inputAccept: string;
  onImageUpload?: (img: Image, file: File) => void;
  onUploaded?: (img: S3Upload[]) => void;
  level?: S3Level;
  maxSizeMB?: number;
  uploadMessage: string | React.ReactNode;
  uploadBtnText: string;
  maxWidthOrHeight?: number;
  alwaysKeepResolution?: boolean;
  onDropped?: (files: FileList) => void;
  useWebWorker?: boolean;
  uploadBtnTextProps?: LinkProps;
  removeConfirmationTitle?: string;
}

export const S3MediaDragDrop = ({
  validFileTypes,
  inputAccept,
  onImageUpload,
  onUploaded,
  maxFiles = 1,
  level = 'protected',
  maxSizeMB,
  uploadMessage,
  uploadBtnText,
  maxWidthOrHeight = 1920,
  alwaysKeepResolution = true,
  useWebWorker = true,
  onDropped,
  uploadBtnTextProps,
  removeConfirmationTitle,
}: MediaUploadPreviewProps) => {
  const { error, uploadedFiles, onFileDrop, remove } = useS3MediaUpload({
    validFileTypes,
    maxFiles,
    inputAccept,
    level,
    maxSizeMB,
    maxWidthOrHeight,
    alwaysKeepResolution,
    useWebWorker,
    onImageUpload,
    onUploaded,
    onDropped,
  });

  return (
    <>
      <WBDragDropFiles
        onFileDrop={onFileDrop}
        validFileTypes={validFileTypes}
        inputAccept={inputAccept}
        maxFiles={maxFiles}
        uploadMessage={uploadMessage}
        btnText={uploadBtnText}
        btnTextProps={uploadBtnTextProps}
      />

      {error && <WBTypography color="error">{error}</WBTypography>}
      <WBBox mt={1}>
        {uploadedFiles.map((file, index) => (
          <FileUpload
            onClose={() => {
              remove(file.id);
            }}
            noBorderTop={index > 0}
            removeConfirmationTitle={removeConfirmationTitle}
            key={file.id}
            id={file.id}
            progress={file.progress}
            name={file.name}
            size={file.size}
          />
        ))}
      </WBBox>
    </>
  );
};

export default S3MediaDragDrop;
