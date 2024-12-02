import {
  WBBox,
  WBFlex,
  WBIcon,
  WBIconButton,
  WBMenu,
  WBMenuItem,
  WBSvgIcon,
  WBToggleButtonGroup,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Popover,
  styled,
  ToggleButton,
  useTheme,
} from '@mui/material';
import SignatureIcon from '../../../assets/icons/signature.svg';
import DateIcon from '../../../assets/icons/date.svg';
import TextIcon from '../../../assets/icons/text.svg';
import { Signer } from '../../pages/TaskCreation/TaskCreation';
import React from 'react';
import {
  checkIfValidHexColor,
  getSignatureIconColor,
} from '../../helpers/signature';

/* eslint-disable-next-line */
export interface PdfPlaceholderProps {
  customData: any;
}

export function PdfPlaceholder({ customData }: PdfPlaceholderProps) {
  const theme = useTheme();
  return (
    <WBFlex
      style={{
        flex: 1,
        padding: theme.spacing(0.5),
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        userSelect: 'none',
        cursor: 'grab',
        backgroundColor: 'rgba(255,248,219,0.75)',
        border: 'dotted 2px #B4540A',
      }}
    >
      {customData?.type === 'SIGNATURE' && (
        <WBSvgIcon style={{ width: '1em', height: '1em' }} viewBox="0 0 11 14">
          <SignatureIcon />
        </WBSvgIcon>
      )}
      {customData?.type === 'DATE' && (
        <WBSvgIcon style={{ width: '1em', height: '1em' }} viewBox="0 0 16 16">
          <DateIcon />
        </WBSvgIcon>
      )}
      {customData?.type === 'TEXT' && (
        <WBSvgIcon style={{ width: '1em', height: '1em' }} viewBox="0 0 16 16">
          <TextIcon />
        </WBSvgIcon>
      )}
      <WBTypography
        style={{
          color: '#000000',
          fontWeight: 'bold',
          fontSize: '0.6rem',
          marginLeft: '8px',
        }}
      >
        {customData?.label as string}
      </WBTypography>
    </WBFlex>
  );
}

export function PdfPlaceholderV2({ customData }: PdfPlaceholderProps) {
  const theme = useTheme();

  const iconColor =
    customData.color && checkIfValidHexColor(customData.color ?? '')
      ? getSignatureIconColor(customData.color)
      : undefined;
  const content = (
    <WBFlex
      style={{
        flex: 1,
        padding: theme.spacing(0.5),
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        userSelect: 'none',
        position: 'relative',
        cursor: 'grab',
        backgroundColor: customData.color ?? 'rgba(255,248,219,0.75)',
        border: `1px solid ${theme.palette.grey[400]}`,
      }}
    >
      {customData?.type === 'SIGNATURE' && (
        <WBFlex
          style={{
            flex: 1,
            display: 'flex',
            padding: theme.spacing(0.5),
            justifyContent: 'start',
            alignItems: 'center',
            userSelect: 'none',
            position: 'absolute',
            left: -1,
            top: 0,
            transform: 'translateY(-100%)',
            cursor: 'grab',
            backgroundColor: customData.color ?? 'rgba(255,248,219,0.75)',
            border: `1px solid ${theme.palette.grey[400]}`,
          }}
        >
          <WBSvgIcon
            color={iconColor}
            style={{ width: '0.6em', height: '0.6em' }}
            viewBox="0 0 7 8"
          >
            {VectorIcon}
          </WBSvgIcon>
          <WBTypography
            style={{
              color: '#000000',
              fontWeight: 'bold',
              fontSize: '0.5rem',
              marginLeft: '4px',
              lineHeight: '10px',
            }}
          >
            {'Sign'}
          </WBTypography>
        </WBFlex>
      )}
      {customData?.type === 'SIGNATURE' && (
        <WBSvgIcon
          color={iconColor}
          style={{ width: '1em', height: '1em' }}
          viewBox="0 0 11 14"
        >
          <SignatureIcon />
        </WBSvgIcon>
      )}

      {customData?.type === 'DATE' && (
        <WBSvgIcon
          color={iconColor}
          style={{ width: '1em', height: '1em' }}
          viewBox="0 0 16 16"
        >
          <DateIcon />
        </WBSvgIcon>
      )}
      {customData?.type === 'NAME' && (
        <WBSvgIcon
          color={iconColor}
          style={{ width: '1em', height: '1em' }}
          viewBox="0 0 16 16"
        >
          <TextIcon />
        </WBSvgIcon>
      )}
      <WBTypography
        style={{
          color: '#000000',
          fontWeight: 'bold',
          fontSize: '0.6rem',
          marginLeft: '8px',
        }}
      >
        {customData?.label as string}
      </WBTypography>
    </WBFlex>
  );

  return content;
}

export default PdfPlaceholder;
const VectorIcon = (
  <svg
    width="11"
    height="13"
    viewBox="0 0 11 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.2246 9.51011V1.08154M5.2246 9.51011L1.61236 5.89787M5.2246 9.51011L8.83684 5.89787M9.43888 11.9183H1.01031"
      stroke="black"
    />
  </svg>
);
