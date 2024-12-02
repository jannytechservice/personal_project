import {
  WBBox,
  WBFlex,
  WBIconButton,
  WBLink,
  WBSelect,
  WBSvgIcon,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  FormControl,
  MenuItem,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { SelectProps } from 'libs/design-system-web/src/lib/components/primatives/Select/Select';

import CheckIconRaw from '../../../assets/icons/checkicon.svg';
import React from 'react';
import PayIcon from '../../../assets/icons/pay.svg';
import PenIcon from '../../../assets/icons/pen.svg';
import CreditCardIcon from '../CreditCardIcon/CreditCardIcon';
import { PaymentMethod } from '@admiin-com/ds-graphql';
import { useTranslation } from 'react-i18next';
import { DarkThemeProvider } from '../DarkThemeProvider/DarkThemeProvider';

// TypeScript interface for the Select option
export interface ISelectOption {
  value: any;
  label?: string;
  icon?: React.ReactNode;

  [key: string]: any; // This line allows any number of additional properties of any type
}

export type PaymentDetailType = 'Signature' | 'Method' | 'Type' | 'Custom';

export interface PaymentDetailSelectorProps
  extends Omit<SelectProps, 'options'> {
  type?: PaymentDetailType;
  bgcolor?: string;
  noLabel?: boolean;
  fontWeight?: string;
  fontColor?: string;
  icon?: React.ReactNode;
  menuPosition?: 'up' | 'down';
  options?: ISelectOption[];
}

// Custom Select component to reduce repetition
export const PaymentDetailSelector: React.FC<PaymentDetailSelectorProps> = ({
  type,
  fontColor,
  fontWeight,
  onChange,
  options,
  menuPosition = 'up',
  noLabel,
  icon: propsIcon,
  value,
  ...props
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { t } = useTranslation();

  let icon: React.ReactNode = null;
  const CheckIcon = (
    <WBSvgIcon
      sx={{
        ml: 1,
        '& path': { fill: theme.palette.success.main },
      }}
    >
      {/*@ts-ignore*/}
      <CheckIconRaw width={'15px'} />
    </WBSvgIcon>
  );

  const isDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const iconType =
    (value as PaymentMethod)?.type ||
    (value as PaymentMethod)?.paymentMethodType ||
    (value as string);

  switch (type) {
    case 'Signature':
      //@ts-ignore
      icon = <PenIcon width={'14px'} height={'40px'} />;
      break;
    case 'Type':
      //@ts-ignore
      icon = <PayIcon width={'18px'} height={'40px'} />;
      break;
    case 'Method':
      icon = (
        <CreditCardIcon
          type={iconType}
          width={iconType === 'newCard' ? '20px' : '35px'}
          height={'40px'}
          theme="dark"
        />
      );
      break;
    case 'Custom':
      icon = propsIcon;
      break;
  }
  const [open, setOpen] = React.useState(false);

  const handleMenuItemClick = (value: any) => {
    if (onChange) {
      const event = {
        target: {
          value,
        },
      } as React.ChangeEvent<{ name?: string; value: unknown }>;
      onChange(event as any);
    }
  };

  let label: PaymentDetailType = 'Custom';
  switch (type) {
    case 'Method':
      label = t('paymentMethod', { ns: 'taskbox' });
      break;
    case 'Signature':
      label = t('signature', { ns: 'taskbox' });
      break;
    case 'Type':
      label = t('type', { ns: 'taskbox' });
      break;
  }

  return (
    <DarkThemeProvider>
      <FormControl
        sx={{
          m: 1,
          // '& .MuiInputLabel-root.Mui-focused': {
          //   color: '#999 !important',
          // },
          // '& .MuiInputLabel-root.Mui-disabled': {
          //   color: '#999 !important',
          // },
        }}
      >
        <WBSelect
          size="small"
          label={isDownLG || noLabel || type === 'Custom' ? '' : label}
          InputProps={{
            disableUnderline: true,
            margin: 'dense',
            sx: {
              fontWeight: fontWeight ?? 'bold',
              borderRadius: '10px',
              bgcolor: `${alpha(props.bgcolor ?? '#FFFFFF', 0.2)} !important`,
              fontSize: 'body2.fontSize',
              color: fontColor ?? 'text.primary',
              height: '40px',
              mt: 1,
            },
            onClick: () => {
              if (!props.disabled) setOpen(!open);
            },
            size: 'small',
            fullWidth: true,
          }}
          SelectProps={{
            open,
            onOpen: () => setOpen(true),
            onClose: () => setOpen(false),
            IconComponent: (iconProps) => (
              <WBBox position="absolute" sx={{ right: '0px' }}>
                <WBIconButton
                  icon="ChevronDown"
                  {...iconProps}
                  size="small"
                  iconSize={1.6}
                  color={fontColor || theme.palette.text.primary}
                />
              </WBBox>
            ),
            renderValue: (selected: any) => {
              if (selected === '' || selected?.length === 0) {
                return (
                  <>
                    <WBBox sx={{ mx: 1, ml: 2 }}>{icon}</WBBox>
                    <WBTypography sx={{ opacity: 0.3 }} fontSize={'inherit'}>
                      {props.placeholder}
                    </WBTypography>
                  </>
                ); // Render placeholder when value is empty
              }
              // Display the selected option(s)
              return (
                <>
                  <WBBox
                    sx={{
                      // width: { xs: undefined, sm: iconWidth },
                      mx: { xs: 1, sm: 1 },
                      ml: { xs: 1, sm: 2 },
                      // mb: type === 'Method' ? 1 : 0,
                    }}
                  >
                    <WBBox
                      sx={{
                        display: { xs: 'none', sm: 'block' },
                        height: '40px',
                      }}
                    >
                      {icon}
                    </WBBox>
                  </WBBox>

                  {options?.find(
                    (option) =>
                      (type === 'Method' && option.value.id === selected) ||
                      (type !== 'Method' && option.value === selected)
                  )?.label ??
                    (typeof selected === 'string'
                      ? t(selected, { ns: 'payment' })
                      : '')}
                </>
              );
            },
            MenuProps: {
              anchorOrigin: {
                vertical: menuPosition === 'down' ? 'bottom' : 'top',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: menuPosition === 'down' ? 'top' : 'bottom',
                horizontal: 'left',
              },
              sx: {
                ...(menuPosition === 'up' ? { top: '-12px' } : { top: '12px' }),
                ...(options && {
                  '& .MuiList-root': {
                    bgcolor: 'background.paper',
                    borderRadius: '13px',
                  },
                  '& .MuiPaper-root': {
                    borderRadius: '15px',
                    bgcolor: 'background.paper',
                    overflow: 'visible', // Make sure the triangle is not cut off.
                    boxShadow: '0 2px 12px 0 rgba(5, 8, 11, 0.09)',
                    fontSize: 'body2.fontSize',
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      ...(menuPosition === 'down'
                        ? { top: '-19px' }
                        : { bottom: '-19px' }),
                      // top: menuPosition === 'down' ? '-19px' : '0px', // This should be the negative value of the triangle's height
                      // bottom: menuPosition === 'up' ? '-19px' : '0px', // This should be the negative value of the triangle's height
                      left: 'calc(50% - 8px)',
                      width: 0,
                      height: 0,
                      borderWidth: '10px', // Adjust the size of the triangle
                      borderStyle: 'solid',
                      borderColor: `${
                        menuPosition === 'up'
                          ? theme.palette.background.paper
                          : 'transparent'
                      } ${
                        menuPosition === 'down'
                          ? 'theme.palette.background.paper'
                          : 'transparent'
                      } transparent transparent `, // The third value is the color of the triangle
                    },
                  },
                }),
              },
            },
            SelectDisplayProps: {
              style: {
                width: 'auto',
                borderRadius: theme.spacing(1),
                height: '40px',
                fontSize: 'body2.fontSize',
                padding: 0,
                paddingRight: '40px',
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
              },
            },
          }}
          variant="filled"
          value={
            type === 'Method' ? (value as PaymentMethod)?.id ?? value : value
          }
          {...props}
        >
          {options?.map((option, index) => (
            <MenuItem
              sx={{
                bgcolor: 'background.paper',
                py: 1.3,
                fontSize: 'body2.fontSize',
                fontWeight: 'bold',
                color: option.disabled ? 'action.disabled' : 'inherit',
              }}
              key={option.id ?? index}
              value={type === 'Method' ? option.id : option.value}
              onClick={(event) => {
                if (option.disabled) {
                  event.stopPropagation();
                  event.preventDefault();
                } else {
                  handleMenuItemClick(option.value);
                }
              }}
              // disabled={option.disabled}
            >
              <WBTooltip
                title={
                  option.disabled
                    ? t('paymentTypeDisabled', { ns: 'taskbox' })
                    : ''
                }
              >
                <WBFlex alignItems="center">
                  {(option?.type || option?.paymentMethodType) && (
                    <WBFlex
                      mr={1}
                      height={'30px'}
                      width={'30px'}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CreditCardIcon
                        width={
                          (option?.type ||
                            option?.paymentMethodType ||
                            option) === 'BANK'
                            ? '20px'
                            : '30px'
                        }
                        height={
                          (option?.type ||
                            option?.paymentMethodType ||
                            option) === 'BANK'
                            ? '20px'
                            : '30px'
                        }
                        type={
                          option?.type || option?.paymentMethodType || option
                        }
                      />
                    </WBFlex>
                  )}
                  {option?.icon || option.label || ''}
                  {(type === 'Method' &&
                    (value as PaymentMethod).id === option.id) ||
                  (type !== 'Method' && value === option.value)
                    ? CheckIcon
                    : null}
                </WBFlex>
              </WBTooltip>
            </MenuItem>
          ))}
          {type === 'Method' && (
            <MenuItem
              value={'newCard'}
              onClick={(event) => {
                handleMenuItemClick('newCard');
              }}
              sx={{
                bgcolor: 'background.paper',
                py: 1.3,
                fontSize: 'body2.fontSize',
                fontWeight: 'bold',
              }}
            >
              <WBLink
                component={'button'}
                variant="body2"
                mt={5}
                underline="none"
                color={'text.primary'}
                fontWeight={'bold'}
              >
                <WBFlex alignItems="center">
                  <WBBox ml={0.5} mr={1.5} height={'30px'}>
                    <CreditCardIcon
                      height={'30px'}
                      width={'22px'}
                      type="newCard"
                      fill="#ffffff"
                      theme={mode}
                    />
                  </WBBox>
                  {`${t('newCard', { ns: 'taskbox' })}`}
                </WBFlex>
              </WBLink>
            </MenuItem>
          )}
          {type === 'Method' && (
            <MenuItem
              value={'newBank'}
              onClick={(event) => {
                handleMenuItemClick('newBank');
              }}
              sx={{
                bgcolor: 'background.paper',
                py: 1.3,
                fontSize: 'body2.fontSize',
                fontWeight: 'bold',
              }}
            >
              <WBLink
                component={'button'}
                variant="body2"
                mt={5}
                underline="none"
                color={'text.primary'}
                fontWeight={'bold'}
              >
                <WBFlex alignItems="center">
                  <WBBox ml={0.5} mr={1.5} height={'30px'}>
                    <CreditCardIcon
                      height={'30px'}
                      width={'22px'}
                      type={'newBank'}
                      theme={mode}
                    />
                  </WBBox>
                  {`${t('newBank', { ns: 'taskbox' })}`}
                </WBFlex>
              </WBLink>
              {value === 'newBank' && CheckIcon}
            </MenuItem>
          )}

          {type === 'Signature' && (
            <MenuItem
              value={'newSignature'}
              onClick={(event) => {
                handleMenuItemClick('newSignature');
              }}
              sx={{
                bgcolor: 'background.paper',
                py: 1.3,
                fontSize: 'body2.fontSize',
                fontWeight: 'bold',
              }}
            >
              <WBLink
                component={'button'}
                variant="body2"
                mt={5}
                underline="none"
                color={'text.primary'}
                fontWeight={'bold'}
              >
                <WBFlex alignItems="center" width="100%">
                  {`${t('newSignature', { ns: 'taskbox' })}`}
                </WBFlex>
              </WBLink>
              {value === 'newSignature' && CheckIcon}
            </MenuItem>
          )}
        </WBSelect>
      </FormControl>
    </DarkThemeProvider>
  );
};
