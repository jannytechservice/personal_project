import React, { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { v4 as uuidv4 } from 'uuid';
import { TransferProgressEvent } from '@aws-amplify/storage';
import {
  S3Level,
  fileType,
  Image,
  S3Upload,
  S3UploadType,
} from '@admiin-com/ds-common';
import { imageResizer } from '@admiin-com/ds-web';
import {
  deleteFromS3Storage,
  getFromS3Storage,
  uploadToS3Storage,
} from '@admiin-com/ds-amplify';

interface UseS3MediaUploadProps {
  validFileTypes: string[];
  maxFiles?: number;
  level?: S3Level;
  inputAccept: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  alwaysKeepResolution?: boolean;
  useWebWorker?: boolean;
  onImageUpload?: (img: Image, file: File) => void;
  onUploaded?: (img: S3Upload[]) => void;
  onDropped?: (files: FileList) => void;
}

export const useS3MediaUpload = ({
  validFileTypes,
  maxFiles = 1,
  level = 'private',
  maxSizeMB,
  inputAccept,
  maxWidthOrHeight = 1920,
  alwaysKeepResolution = true,
  useWebWorker = true,
  onImageUpload,
  onUploaded,
  onDropped,
}: UseS3MediaUploadProps) => {
  const [identityId, setIdentityId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [uploadedFiles, setFiles] = useState<
    {
      image?: S3Upload;
      name: string;
      size: string;
      id: string;
      progress: number;
    }[]
  >([]);

  useEffect(() => {
    const getIdentityId = async () => {
      const data = await fetchAuthSession();
      setIdentityId(data?.identityId ?? '');
    };
    if (level !== 'public') {
      getIdentityId();
    }
  }, [level]);

  const onFileDrop = async (files: FileList) => {
    if (!identityId && level !== 'public') {
      setError('Error uploading media. Please re-open screen');
    }
    if (onDropped) onDropped(files);
    const totalFiles = uploadedFiles.length + files.length;
    const uploadedFileSize = uploadedFiles.length;
    setFiles((uploadedFiles) =>
      uploadedFiles.concat(
        ...Array.from(files).map((file) => ({
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
          id: uuidv4(),
          progress: 0,
        }))
      )
    );
    if (totalFiles > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    } else {
      setError('');
    }

    const images: S3Upload[] = [];
    for (let i = 0; i < files.length; i++) {
      let file;
      if (maxSizeMB && files[i].type.startsWith('image/')) {
        const resizeOptions = {
          maxSizeMB,
          alwaysKeepResolution,
          maxWidthOrHeight,
          useWebWorker,
        };

        file = await imageResizer(files[i], resizeOptions);
      } else {
        file = files[i];
      }

      try {
        const fileName = `${uuidv4()}.${fileType(files[i].name)}`;
        const result = await uploadToS3Storage(
          {
            key: fileName,
            contentType: files[i].type,
            file,
            level,
          },
          (data: TransferProgressEvent) => {
            const progress =
              (data.transferredBytes / (data.totalBytes ?? 0)) * 100;
            setFiles((prev) =>
              prev.map((f, index) =>
                index === i + uploadedFileSize ? { ...f, progress } : f
              )
            );
          }
        );
        setFiles((prev) =>
          prev.map((f, index) =>
            index === i + uploadedFileSize
              ? { ...f, progress: 100, id: key }
              : f
          )
        );
        const key = fileName;
        const url = await getFromS3Storage({ key, identityId, level });
        const image = {
          key,
          src: url,
          level,
          identityId,
        };
        let type: S3UploadType = 'FILE';
        if (files[i].type.startsWith('/image')) type = 'IMAGE';
        if (files[i].type.startsWith('/video')) type = 'VIDEO';
        if (files[i].type.startsWith('/pdf')) type = 'PDF';
        setFiles((prev) =>
          prev.map((f, index) =>
            index === i + uploadedFileSize
              ? { ...f, image: { ...image, type }, progress: 0 }
              : f
          )
        );
        onImageUpload && onImageUpload(image, file);

        images.push({ ...image, name: files[i].name, type });
      } catch (err) {
        console.log('ERROR upload file S3MediaDragDrop: ', err);
      }
      onUploaded && onUploaded(images);
    }
  };

  const remove = async (id: string) => {
    await deleteFromS3Storage(id, level);
    const images: S3Upload[] = [];
    for (const f of uploadedFiles) {
      if (f.image && f.id !== id) {
        images.push(f.image);
      }
    }
    onUploaded && onUploaded(images);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

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

  const uploadFile = () => {
    inputRef.current?.click();
  };

  const inputElement = (
    <input
      ref={inputRef}
      type="file"
      accept={inputAccept}
      multiple={maxFiles > 1}
      onChange={onSelect}
      style={{ display: 'none' }}
    />
  );

  return {
    identityId,
    error,
    uploadedFiles,
    onFileDrop,
    remove,
    inputElement,
    uploadFile,
  };
};
