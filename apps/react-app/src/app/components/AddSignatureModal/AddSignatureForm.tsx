import React, { useEffect, useMemo, useRef, useState } from 'react';
import SimpleDrawDlg, {
  SimpleDrawDlgProps,
} from '../SimpleDrawDlg/SimpleDrawDlg';
import {
  DialogContent,
  DialogTitle,
  styled,
  ToggleButton,
  Typography,
  useTheme,
} from '@mui/material';
import {
  WBBox,
  WBButton,
  WBSelect,
  WBTextField,
  WBFlex,
  WBToggleButtonGroup,
  WBIconButton,
  WBIcon,
  WBTypography,
  WBSvgIcon,
  WBDialogContent,
  WBCheckbox,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import {
  createSignature as CREATE_SIGNATURE,
  updateUser as UPDATE_USER,
  getUser as GET_USER,
  CSGetSub as GET_SUB,
} from '@admiin-com/ds-graphql';
import { Stage, Layer, Text } from 'react-konva';
import SignaturePad from 'react-signature-pad-wrapper';
import {
  getBlobFromCanvas,
  getExtensionFromContentType,
} from '../../helpers/signature';
import { S3MediaDragDrop } from 'libs/amplify-web/src/lib/components/S3MediaDragDrop/S3MediaDragDrop';
import { IMAGE_EXTENSIONS, Image } from '@admiin-com/ds-common';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3Storage } from '@admiin-com/ds-amplify';
import { gql, useMutation, useQuery } from '@apollo/client';
import { isEmpty, set } from 'lodash';
import { S3Image } from 'libs/amplify-web/src/lib/components/S3Image/S3Image';
import LoadSvgIcon from '../../component/LoadSvgIcon/LoadSvgIcon';
import DrawIcon from '../../../assets/icons/draw.svg';
import TextIcon from '../../../assets/icons/text.svg';
import { background } from 'libs/design-system-web/src/lib/keyframes/background';

enum SignatureType {
  SignPad = 'SignPad',
  Keyboard = 'Keyboard',
  Camera = 'Camera',
}

export interface AddSignatureFormProps {
  handleSave?: (signatureKey?: string | Blob) => void;
  isGuest?: boolean;
  onApplyToAll?: (checked: boolean) => void;
  applyToAll?: boolean;
  handleClose?: () => void;
  signerName?: string;
}

type SignatureFormData = {
  signatureType: string;
  signatureText: string;
};

export const AddSignatureForm = ({
  handleSave,
  handleClose,
  isGuest,
  signerName,
  onApplyToAll,
  applyToAll,
}: AddSignatureFormProps) => {
  const { t } = useTranslation();
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;

  const [createSignature, { loading: createSignatureLoading }] = useMutation(
    gql(CREATE_SIGNATURE),
    {
      refetchQueries: [gql(GET_USER)],
    }
  );

  const [updateUser, { loading: updateUserLoading }] = useMutation(
    gql(UPDATE_USER)
  );

  const [uploadSignatureLoading, setUploadSignatureLoading] = useState(false);

  // Signature Pad
  const signaturePadRef = useRef<any>(null);
  // Signature Keyboard
  const signatureKeyboardRef = useRef<any>(null);
  // Signature Camera
  const [uploadSignatureKey, setUploadSignatureKey] = useState('');

  const { control, watch, handleSubmit, setValue } = useForm<SignatureFormData>(
    {
      mode: 'onSubmit',
      reValidateMode: 'onChange',
    }
  );

  const inputs = useMemo(
    () =>
      ({
        signatureType: {
          name: 'signatureType',
          type: 'select',
          defaultValue: 'Keyboard',
        },
        signatureText: {
          name: 'signatureText',
          type: 'text',
          placeholder: t('namePlaceholder', { ns: 'settings' }),
          defaultValue: '',
        },
      } as const),
    [t, signerName]
  );

  // useEffect(() => {
  //   if (signerName) {
  //     setValue('signatureText', signerName);
  //   }
  // }, [setValue, signerName]);

  const signatureType = watch('signatureType');
  const signatureText = watch('signatureText');

  useEffect(() => {
    setValue('signatureType', SignatureType.Keyboard);
  }, []);

  const onSignatureUploaded = (image: Image) => {
    setUploadSignatureKey(image.key);
  };

  const onClear = () => {
    switch (signatureType) {
      case SignatureType.SignPad:
        signaturePadRef?.current?.clear();
        break;
      case SignatureType.Keyboard:
        setValue('signatureText', '');
        break;
      case SignatureType.Camera:
        setUploadSignatureKey('');
        break;
    }
  };

  const uploadSignature = async (blob: Blob) => {
    try {
      setUploadSignatureLoading(true);
      const fileName = `${uuidv4()}.${getExtensionFromContentType(blob.type)}`;
      const data: any = await uploadToS3Storage(
        {
          key: fileName,
          contentType: blob.type,
          file: blob,
          level: 'private',
        },
        () => null
      );
      return data.key;
    } catch (err) {
      console.log('ERROR upload signature: ', err);
    } finally {
      setUploadSignatureLoading(false);
    }
  };

  const saveSignature = async (key: string) => {
    try {
      await createSignature({
        variables: {
          input: {
            key: key,
          },
        },
      });
      const { data } = await updateUser({
        variables: {
          input: {
            id: userId,
            selectedSignatureKey: key,
          },
        },
      });
      if (data?.updateUser) {
        handleSave && handleSave(data?.updateUser?.signatures?.items[0]?.key);
      }
    } catch (err) {
      console.log('ERROR createSignature: ', err);
    }
  };

  const uploadAndSaveSignature = async (blob: Blob) => {
    if (isGuest) return handleSave && handleSave(blob);
    else {
      const key = await uploadSignature(blob);
      saveSignature(key);
    }
  };

  const onSubmit = async () => {
    switch (signatureType) {
      case SignatureType.SignPad:
        if (!signaturePadRef?.current?.isEmpty()) {
          await uploadAndSaveSignature(
            getBlobFromCanvas(signaturePadRef?.current?.signaturePad?.canvas)
          );
        }
        break;
      case SignatureType.Keyboard:
        if (!isEmpty(signatureText)) {
          await uploadAndSaveSignature(
            getBlobFromCanvas(
              signatureKeyboardRef?.current?.toCanvas({ pixelRatio: 2 })
            )
          );
        }
        break;
      case SignatureType.Camera:
        if (!isEmpty(uploadSignatureKey)) {
          await saveSignature(uploadSignatureKey);
        }
        break;
    }
  };
  const theme = useTheme();
  console.log(signatureType);

  return (
    <WBDialogContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        {signatureType === SignatureType.SignPad && (
          <WBBox>
            <div style={{ backgroundColor: '#E1E8EE' }}>
              <SignaturePad ref={signaturePadRef} />
            </div>
            <WBBox border="1px solid grey" mt={-3} mx={3} />
            <Typography mt={4}>
              {t('signPadDescriptionLabel', { ns: 'settings' })}
            </Typography>
          </WBBox>
        )}
        {signatureType === SignatureType.Keyboard && (
          <WBBox>
            <Stage ref={signatureKeyboardRef} width={300} height={40}>
              <Layer>
                <Text
                  text={signatureText}
                  verticalAlign="middle"
                  fillStyle="#FF0000"
                  fontSize={30}
                  fontFamily="Ms Madi"
                  width={300}
                  height={40}
                  padding={10} // Add paddings
                />
              </Layer>
            </Stage>
            <Controller
              control={control}
              name={inputs.signatureText.name}
              defaultValue={inputs.signatureText.defaultValue}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type={inputs.signatureText.type}
                  placeholder={inputs.signatureText.placeholder}
                />
              )}
            />
          </WBBox>
        )}
        {signatureType === SignatureType.Camera && (
          <WBBox>
            {uploadSignatureKey ? (
              <WBFlex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                width="100%"
                sx={{
                  borderRadius: '10px',
                  //TODO: colour based on primary colour
                  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%238F8F8F' stroke-width='5' stroke-dasharray='1%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");`,
                }}
                p={4}
              >
                <S3Image
                  imgKey={uploadSignatureKey}
                  level={'private'}
                  responsive={false}
                />
              </WBFlex>
            ) : (
              <S3MediaDragDrop
                validFileTypes={IMAGE_EXTENSIONS}
                inputAccept="images/*"
                uploadMessage={t('cameraUploadMessage', { ns: 'settings' })}
                uploadBtnText={t('CameraOptionLabel', { ns: 'settings' })}
                level="private"
                onImageUpload={(image: Image, file) => {
                  onSignatureUploaded(image);
                }}
              />
            )}
          </WBBox>
        )}
        <WBFlex mb={2} pt={2} justifyContent={'space-between'}>
          <Controller
            control={control}
            name={inputs.signatureType.name}
            defaultValue={inputs.signatureType.defaultValue}
            render={({ field }) => (
              // <WBSelect
              //   options={[
              //     ...Object.keys(SignatureType).map((value) => ({
              //       label: t(value + 'OptionLabel', { ns: 'settings' }),
              //       value: value,
              //     })),
              //   ]}
              //   value={field.value}
              //   onChange={field.onChange}
              // />
              <WBToggleButtonGroup
                {...field}
                onChange={(_, value) => {
                  if (value) field.onChange(value);
                }}
                size="medium"
                exclusive
              >
                {['SignPad', 'Keyboard'].map((value, index) => (
                  <StyledRectToggleButton value={value} key={value}>
                    <WBSvgIcon
                      sx={{ mt: 2 }}
                      color={
                        field.value === value
                          ? theme.palette.primary.main
                          : theme.palette.grey[500]
                      }
                    >
                      <LoadSvgIcon
                        component={[DrawIcon, TextIcon, DrawIcon][index]}
                        width={14}
                        height={14}
                      />
                    </WBSvgIcon>
                    <WBTypography color={'inhert'} fontSize={'12'}>
                      {t(value + 'Toggle', { ns: 'settings' })}
                    </WBTypography>
                  </StyledRectToggleButton>
                ))}
              </WBToggleButtonGroup>
            )}
          />

          <WBIconButton sx={{ borderRadius: 0, p: 0 }} onClick={onClear}>
            <WBIcon name="Close" />
            <WBTypography>{t('clear', { ns: 'common' })}</WBTypography>
          </WBIconButton>
        </WBFlex>
        {onApplyToAll && (
          <WBFlex>
            <WBCheckbox
              label={t('applyThisSignatureToAll', { ns: 'taskbox' })}
              value={applyToAll}
              onChange={(e) => onApplyToAll(e.target.checked)}
            />
          </WBFlex>
        )}
        <WBFlex flexDirection="row" mt={3} gap={2}>
          <WBButton
            sx={{ flex: 1 }}
            variant="outlined"
            size="small"
            type="button"
            onClick={handleClose}
          >
            {t('cancel', { ns: 'common' })}
          </WBButton>
          <WBButton
            size="small"
            loading={
              uploadSignatureLoading ||
              createSignatureLoading ||
              updateUserLoading
            }
            type="submit"
            sx={{
              flex: 1,
            }}
          >
            {t('done', { ns: 'common' })}
          </WBButton>
        </WBFlex>
      </form>
    </WBDialogContent>
  );
};

const StyledRectToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  fontWeight: 500,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
    backgroundColor: `rgba(0, 0, 0, 0.18)`,
  },
  padding: theme.spacing(0, 1),
  display: 'flex',
  alignItems: 'center',
}));
