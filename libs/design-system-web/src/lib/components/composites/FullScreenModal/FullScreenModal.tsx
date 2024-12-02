import { Dialog as MUIDialog, DialogProps, useTheme } from '@mui/material';
import React from 'react';
import {
  WBBox,
  WBContainer,
  WBDialogContent,
  WBFlex,
  WBIcon,
  WBIconButton,
  WBLink,
  WBTypography,
} from '../..';
import { LinkProps } from '../../primatives/Link/Link';

interface FullScreenModalProps extends DialogProps {
  leftToolbarIconTitle?: string;
  leftToolbarIconProps?: LinkProps;
  rightToolbarIcon?: React.ReactNode;
  isMobileResponsive?: boolean;
  hideToolbar?: boolean;
}

export const FullScreenModal = ({
  onClose,
  title,
  open,
  children,
  leftToolbarIconTitle,
  leftToolbarIconProps,
  rightToolbarIcon,
  isMobileResponsive = false,
  hideToolbar = false,
  ...props
}: FullScreenModalProps) => {
  const theme = useTheme();
  const rightIcon =
    rightToolbarIcon ??
    (onClose ? (
      <WBIconButton
        aria-label="close"
        icon="Close"
        onClick={(e) => onClose(e, 'backdropClick')}
        sx={{
          color: (theme) => theme.palette.grey[500],
          marginLeft: 'auto', // Align the button to the right
        }}
      />
    ) : (
      <WBBox />
    ));
  return (
    <MUIDialog
      fullScreen
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      scroll="body"
      {...props}
    >
      <WBFlex
        p={hideToolbar ? 0 : { xs: 0, sm: 2 }}
        pt={hideToolbar ? 0 : { xs: 3, sm: 6 }}
        sx={{
          flexDirection: 'column',
          flex: 1,
          alignItems: 'center',
        }}
        height="100%"
      >
        <WBFlex
          display={hideToolbar ? 'none' : 'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          width={['100%']}
          sx={{ px: 1 }}
          flexDirection={isMobileResponsive ? ['column', 'row'] : 'row'}
        >
          <WBFlex
            sx={{ flex: 1 }}
            alignItems={'center'}
            width={isMobileResponsive ? { xs: '100%' } : {}}
            justifyContent="space-between"
          >
            <WBLink
              underline="always"
              alignContent={'center'}
              display={'flex'}
              color={theme.palette.common.black}
              {...leftToolbarIconProps}
            >
              <WBIcon name="ArrowBack" size={'small'}></WBIcon>
              <WBTypography
                variant="body2"
                fontWeight={'bold'}
                noWrap
                ml={1}
                component={'div'}
                display={['none', 'block']}
              >
                {leftToolbarIconTitle}
              </WBTypography>
            </WBLink>
            <WBBox
              display={
                isMobileResponsive ? { xs: 'block', sm: 'none' } : 'none'
              }
            >
              {rightIcon}
            </WBBox>
            {/* Invisible spacer if leftToolbarIcon is not present */}
          </WBFlex>

          <WBTypography
            variant="h3"
            textAlign={'center'}
            sx={{ flex: 2 }}
            mt={{ xs: isMobileResponsive ? 3 : 0, sm: 0 }}
          >
            {title}
          </WBTypography>

          <WBFlex
            sx={{ flex: 1 }}
            justifyContent={'end'}
            display={isMobileResponsive ? { xs: 'none', sm: 'flex' } : 'flex'}
          >
            {/* Invisible spacer if onClose is not present */}
            {rightIcon}
          </WBFlex>
        </WBFlex>
        <WBDialogContent dividers sx={{ width: '100%' }}>
          <WBContainer maxWidth="lg" sx={{ height: '100%' }} disableGutters>
            {children}
          </WBContainer>
        </WBDialogContent>
      </WBFlex>
    </MUIDialog>
  );
};
