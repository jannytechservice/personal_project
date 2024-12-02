import { TaskType } from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBFlex,
  WBSelect,
  WBSkeleton,
  WBTypography,
} from '@admiin-com/ds-web';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTaskCreationContext } from '../TaskCreation/TaskCreation';
import { useTranslation } from 'react-i18next';
import PdfViewer from '../../components/PdfViewer/PdfViewer';
import { FormControl, useTheme } from '@mui/material';
import { PDF_FILE_EXTENSIONS, S3Upload } from '@admiin-com/ds-common';
import { S3MediaDragDrop } from 'libs/amplify-web/src/lib/components/S3MediaDragDrop/S3MediaDragDrop';
import { FormError } from '../../components/FormError/FormError';
import { ConnectDisconnectXero } from '../../components/ConnectDisconnectXero';

interface UploadDocumentsProps {
  value: (S3Upload | null)[];
  onChange: (value: (S3Upload | null)[]) => void;
}

export const UploadDocuments = ({ value, onChange }: UploadDocumentsProps) => {
  const {
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);

  return (
    <WBFlex
      flexDirection="column"
      flex={1}
      justifyContent={'center'}
      width={'100%'}
      height="100%"
      // height={'500px'}
    >
      {loading ? (
        <WBSkeleton variant="rectangular" width={'100%'} height={'100%'} />
      ) : value?.[0]?.src ? (
        <PdfViewer documentUrl={value?.[0]?.src} />
      ) : (
        <WBFlex justifyContent={'center'} alignItems={'center'}>
          <WBFlex
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            maxWidth={'500px'}
          >
            <S3MediaDragDrop
              validFileTypes={PDF_FILE_EXTENSIONS}
              inputAccept={PDF_FILE_EXTENSIONS.join(', ')}
              level="private"
              onUploaded={(images: S3Upload[]) => {
                onChange(images);
                setLoading(false);
              }}
              onDropped={(files: FileList) => {
                setLoading(true);
              }}
              uploadMessage={
                <>
                  <WBTypography
                    textAlign={'center'}
                    fontWeight={'bold'}
                    variant="body2"
                    mt={3}
                  >
                    {t('dropDropBillDocument', { ns: 'taskbox' })}
                  </WBTypography>

                  <WBTypography
                    color={'text.secondary'}
                    textAlign={'center'}
                    variant="body2"
                    mt={1}
                  >
                    {`${t('supportedFiles', { ns: 'taskbox' })}`}
                  </WBTypography>
                </>
              }
              uploadBtnText={'Select File'}
              uploadBtnTextProps={{
                variant: 'body2',
                fontWeight: 'bold',
                color: 'text.primary',
              }}
            />
            <WBBox>
              {!!errors?.documents && (
                <FormError>{errors?.documents?.message || ''}</FormError>
              )}
            </WBBox>
          </WBFlex>
          {/*<WBBox mt={{ xs: 2, md: 8 }}>*/}
          {/*  <ConnectDisconnectXero />*/}
          {/*</WBBox>*/}
        </WBFlex>
      )}
    </WBFlex>
  );
};
