import React from 'react';
import { WBBox, WBFlex, WBSvgIcon, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import {
  FILE_TYPES,
  PDF_FILE_EXTENSIONS,
  S3Upload,
} from '@admiin-com/ds-common';
import { S3MediaDragDrop } from 'libs/amplify-web/src/lib/components/S3MediaDragDrop/S3MediaDragDrop';
import UploadIcon from '../../../../assets/icons/upload.svg';
import { useTheme } from '@mui/material';
interface TaskUploadProps {
  onChange: (images: S3Upload[]) => void;
  setLoading?: (loading: boolean) => void;
  label?: string;
  isPDFOnly?: boolean;
}

const TaskUpload = React.forwardRef<any, TaskUploadProps>(
  ({ label, onChange, isPDFOnly, setLoading }, ref) => {
    const { t } = useTranslation();
    const FILE_EXTENSIONS = isPDFOnly ? [FILE_TYPES.PDF] : PDF_FILE_EXTENSIONS;
    const extensions = Object.entries(FILE_TYPES)
      .filter(([key, value]) => FILE_EXTENSIONS.includes(value))
      .map(([key, value]) => key)
      .join(', ');

    const theme = useTheme();
    const UploadMessage = (
      <>
        <WBFlex gap={1}>
          <WBSvgIcon fontSize="small" color={theme.palette.primary.main}>
            <UploadIcon />
          </WBSvgIcon>
          <WBTypography
            textAlign={'center'}
            fontWeight={'bold'}
            variant="body2"
          >
            {t(isPDFOnly ? 'uploadDocument' : 'uploadExistingDocuments', {
              ns: 'taskbox',
            })}
          </WBTypography>
        </WBFlex>
        <WBTypography
          color={'text.secondary'}
          textAlign={'center'}
          variant="body2"
          mt={1}
        >
          {`${t('supportedFiles', { ns: 'taskbox' })} ${extensions}`}
        </WBTypography>

        <WBTypography
          color={'text.secondary'}
          textAlign={'center'}
          variant="body2"
        >
          {`${t('maxSize', { ns: 'taskbox', size: '25MB' })}`}
        </WBTypography>
      </>
    );

    return (
      <WBFlex flexDirection={'column'} gap={2} ref={ref}>
        {label && (
          <WBTypography variant="body1" fontWeight="bold">
            {label}
          </WBTypography>
        )}
        <S3MediaDragDrop
          uploadBtnText=""
          validFileTypes={FILE_EXTENSIONS}
          inputAccept={FILE_EXTENSIONS.join(', ')}
          level="private"
          onUploaded={(images: S3Upload[]) => {
            onChange(images);
            if (setLoading) setLoading(false);
          }}
          onDropped={(files: FileList) => {
            if (setLoading) setLoading(true);
          }}
          uploadMessage={UploadMessage}
          uploadBtnTextProps={{
            variant: 'body2',
            fontWeight: 'bold',
            color: 'text.primary',
          }}
          removeConfirmationTitle={t('removeConfirmationTitle', {
            ns: 'taskbox',
          })}
          maxFiles={5}
        />
      </WBFlex>
    );
  }
);

export default TaskUpload;
