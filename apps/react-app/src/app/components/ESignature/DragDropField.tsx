import {
  WBBox,
  WBFlex,
  WBIconButton,
  WBSvgIcon,
  WBTypography,
} from '@admiin-com/ds-web';
import { styled, useMediaQuery, useTheme } from '@mui/material';
import React, { useCallback, useState } from 'react';
import SignSvg from '../../../assets/icons/signature-icon.svg';
import { useTranslation } from 'react-i18next';
import { Signature } from '@admiin-com/ds-graphql';
import { S3Image } from 'libs/amplify-web/src/lib/components/S3Image/S3Image';
import RemoveSignatureModal from '../RemoveSignatureModal/RemoveSignatureModal';
import { DropContext } from './ESignatureMobile';
import {
  checkIfValidHexColor,
  getSignatureIconColor,
} from '../../helpers/signature';
import { Signer } from '../../pages/TaskCreation/TaskCreation';
import {
  useCurrentUser,
  useUserId,
} from '../../hooks/useCurrentUser/useCurrentUser';

interface Props {
  type: 'DATE' | 'NAME' | 'SIGNATURE';
  name?: string;
  isMobile?: boolean;
  iconColor?: string;
  signer?: Signer;
  signature?: Signature;
  onClick?: () => void;
}
const DragDropField = (props: Props) => {
  const color = props.signer?.color;
  const theme = useTheme();
  const { t } = useTranslation();
  const content =
    props.type === 'SIGNATURE' ? props.name : t(props.type, { ns: 'taskbox' });
  const icon = React.useMemo(() => {
    switch (props.type) {
      case 'SIGNATURE':
        return <SignSvg />;
      case 'DATE':
        return DateIcon;
      case 'NAME':
        return TextIcon;
      default:
        return null;
    }
  }, [props.type]);

  const onDragEnd = (event: any) => {
    event.target.style.opacity = 1;

    // setDropped(true);
  };

  const user = useCurrentUser();
  const userName = `${user.firstName} ${user.lastName}`;
  const name = props.name ?? props.signer?.name ?? userName;
  function getFieldLabel(type: string) {
    let label;
    if (type === 'SIGNATURE') {
      label = props.name;
    } else if (type === 'NAME') {
      label = name; //t('name', { ns: 'taskbox' });
    } else if (type === 'DATE') {
      label = t('date', { ns: 'taskbox' });
    } else {
      label = Math.random().toString();
    }
    return label;
  }
  const userId = useUserId();
  const onDragStart = (event: any, type: string) => {
    // if (!signer?.userId) return;

    let signerId = props.signer?.id;
    if (type === 'DATE' && !props.signer) {
      signerId = userId;
    }
    if (type === 'NAME' && !props.signer) {
      signerId = userId;
    }

    event.target.style.opacity = 0.5;
    event.dataTransfer.dropEffect = 'move';
    if (color) event.dataTransfer.setData('color', color);
    event.dataTransfer.setData('label', getFieldLabel(type));
    event.dataTransfer.setData('type', type);
    event.dataTransfer.setData('signerId', signerId);
    event.dataTransfer.setData('email', props.signer?.email);
    event.dataTransfer.setData('entityId', props.signer?.data?.entityId);
    event.dataTransfer.setData('signerType', props.signer?.signerType);
    event.dataTransfer.setData('name', name);
    if (props.signature) {
      event.dataTransfer.setData('signatureKey', props.signature.key);
    }
  };
  const context = React.useContext(DropContext);
  const fieldClickHandler = async (event: any, type: string) => {
    let signerId = props.signer?.id;
    if (type === 'DATE' && !props.signer) {
      signerId = userId;
    }
    if (type === 'NAME' && !props.signer) {
      signerId = userId;
    }

    const clickEvent = {
      label: getFieldLabel(type),
      color: color,
      type,
      signerId,
      email: props.signer?.email,
      entityId: props.signer?.entityId,
      name: name,
      signerType: props.signer?.signerType,
      signatureKey: props.signature?.key,
    };
    try {
      if (props.onClick) props.onClick();
      else await context?.handleDrop(event, clickEvent);
    } catch (e) {
      console.log(e);
    }
  };
  const [showRemoveSignModal, setShowRemoveSignModal] =
    useState<boolean>(false);
  if (props.isMobile) {
    return (
      <SignatureFieldMobileContainer
        type={props.type}
        icon={icon}
        label={t(props.type, { ns: 'taskbox' })}
        onClick={(e: any) => fieldClickHandler(e, props.type)}
      />
    );
  }
  return (
    <Container
      onDragEnd={onDragEnd}
      onDragStart={(e: DragEvent) => onDragStart(e, props.type)}
      // draggable={!!signer?.userId}
      draggable={true}
      sx={{ backgroundColor: color }}
      onClick={(e: any) => fieldClickHandler(e, props.type)}
    >
      <WBFlex flex={1}>
        {!props.signature ? (
          <>
            <WBSvgIcon
              fontSize="small"
              color={
                color && checkIfValidHexColor(color ?? '')
                  ? getSignatureIconColor(color)
                  : theme.palette.mode === 'dark'
                  ? theme.palette.common.white
                  : theme.palette.common.black
              }
            >
              {icon}
            </WBSvgIcon>
            <WBTypography
              ml={2}
              color={
                checkIfValidHexColor(color ?? '')
                  ? 'common.black'
                  : 'text.primary'
              }
              fontSize={'body2.fontSize'}
              fontWeight={'medium'}
              mr={3}
            >
              {content}
            </WBTypography>
          </>
        ) : (
          <WBFlex justifyContent={'space-between'} flex={1} alignItems="center">
            <S3Image
              imgKey={props.signature.key}
              level={'private'}
              responsive={false}
              sx={{
                maxWidth: ['80px', '180px'],
                height: 'auto',
                maxHeight: '40px',
              }}
            />
            <WBIconButton
              icon="Close"
              sx={{ display: ['none', 'block'], padding: 0 }}
              color={theme.palette.grey[500] as any}
              onClick={() => {
                setShowRemoveSignModal(true);
              }}
            />
            {showRemoveSignModal && (
              <RemoveSignatureModal
                signature={props.signature}
                open={showRemoveSignModal}
                handleClose={() => setShowRemoveSignModal(false)}
              />
            )}
          </WBFlex>
        )}
      </WBFlex>
      <WBSvgIcon fill={theme.palette.primary.main}>{DragIndicator}</WBSvgIcon>
    </Container>
  );
};

export const SignatureFieldMobileContainer = (props: any) => {
  const { icon, label, onClick } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <WBFlex flex={1} alignItems={'center'} flexDirection={'column'}>
      <SignatureFieldMobile
        // onDragEnd={onDragEnd}
        // onDragStart={(e: Event) => onDragStart(e, type)}
        // draggable={!!signer?.userId}
        onClick={(e: any) => onClick(e)}
      >
        <WBSvgIcon
          sx={{ fontSize: '24px' }}
          viewBox="0 0 24 24"
          color={theme.palette.primary.main}
        >
          {icon}
        </WBSvgIcon>
      </SignatureFieldMobile>
      <WBTypography fontWeight={'bold'} fontSize={'body2.fontSize'}>
        {t(label, { ns: 'taskbox' })}
      </WBTypography>
    </WBFlex>
  );
};

export const SignatureFieldMobile = styled(WBBox)(({ theme, disabled }) => ({
  width: '58px',
  height: '58px',
  padding: theme.spacing(2),
  borderRadius: '4rem',
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',

  backgroundColor: disabled ? theme.palette.grey['300'] : '#F4F1FB',
  userSelect: 'none',
  cursor: disabled ? 'not-allowed' : 'grab',
}));

const Container = styled(WBBox)(({ theme, disabled }) => ({
  border: `1px solid ${theme.palette.grey[400]}`,
  padding: theme.spacing(1.5),
  display: 'flex',
  justifyContent: 'space-between',
  userSelect: 'none',
  alignItems: 'center',
  cursor: disabled ? 'not-allowed' : 'grab',
}));

const DragIndicator = (
  <svg
    width="12"
    height="20"
    viewBox="0 0 12 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.75 0.25H3.75V3.25H0.75V0.25ZM8.25 0.25H11.25V3.25H8.25V0.25ZM0.75 5.75H3.75V8.75H0.75V5.75ZM8.25 5.75H11.25V8.75H8.25V5.75ZM0.75 11.25H3.75V14.25H0.75V11.25ZM8.25 11.25H11.25V14.25H8.25V11.25ZM0.75 16.75H3.75V19.75H0.75V16.75ZM8.25 16.75H11.25V19.75H8.25V16.75Z"
      fill="#8C52FF"
    />
  </svg>
);

const DateIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.5 8V13.8333C15.5 14.2754 15.3244 14.6993 15.0118 15.0118C14.6993 15.3244 14.2754 15.5 13.8333 15.5H2.16667C1.72464 15.5 1.30072 15.3244 0.988155 15.0118C0.675595 14.6993 0.5 14.2754 0.5 13.8333V8H15.5ZM11.3333 0.5C11.5543 0.5 11.7663 0.587797 11.9226 0.744078C12.0789 0.900358 12.1667 1.11232 12.1667 1.33333V2.16667H13.8333C14.2754 2.16667 14.6993 2.34226 15.0118 2.65482C15.3244 2.96738 15.5 3.39131 15.5 3.83333V6.33333H0.5V3.83333C0.5 3.39131 0.675595 2.96738 0.988155 2.65482C1.30072 2.34226 1.72464 2.16667 2.16667 2.16667H3.83333V1.33333C3.83333 1.11232 3.92113 0.900358 4.07741 0.744078C4.23369 0.587797 4.44565 0.5 4.66667 0.5C4.88768 0.5 5.09964 0.587797 5.25592 0.744078C5.4122 0.900358 5.5 1.11232 5.5 1.33333V2.16667H10.5V1.33333C10.5 1.11232 10.5878 0.900358 10.7441 0.744078C10.9004 0.587797 11.1123 0.5 11.3333 0.5Z"
      fill="black"
    />
  </svg>
);

const TextIcon = (
  <svg
    width="13"
    height="14"
    viewBox="0 0 13 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.333008 1.58334C0.333008 1.25182 0.464704 0.93388 0.699124 0.69946C0.933545 0.465039 1.25149 0.333344 1.58301 0.333344H11.583C11.9145 0.333344 12.2325 0.465039 12.4669 0.69946C12.7013 0.93388 12.833 1.25182 12.833 1.58334V4.08334C12.833 4.41486 12.7013 4.73281 12.4669 4.96723C12.2325 5.20165 11.9145 5.33334 11.583 5.33334C11.2515 5.33334 10.9335 5.20165 10.6991 4.96723C10.4647 4.73281 10.333 4.41486 10.333 4.08334V2.83334H7.83301V11.1667H8.24967C8.58119 11.1667 8.89914 11.2984 9.13356 11.5328C9.36798 11.7672 9.49967 12.0852 9.49967 12.4167C9.49967 12.7482 9.36798 13.0661 9.13356 13.3006C8.89914 13.535 8.58119 13.6667 8.24967 13.6667H4.91634C4.58482 13.6667 4.26688 13.535 4.03246 13.3006C3.79804 13.0661 3.66634 12.7482 3.66634 12.4167C3.66634 12.0852 3.79804 11.7672 4.03246 11.5328C4.26688 11.2984 4.58482 11.1667 4.91634 11.1667H5.33301V2.83334H2.83301V4.08334C2.83301 4.41486 2.70131 4.73281 2.46689 4.96723C2.23247 5.20165 1.91453 5.33334 1.58301 5.33334C1.25149 5.33334 0.933545 5.20165 0.699124 4.96723C0.464704 4.73281 0.333008 4.41486 0.333008 4.08334V1.58334Z"
      fill="black"
    />
  </svg>
);

export default DragDropField;
