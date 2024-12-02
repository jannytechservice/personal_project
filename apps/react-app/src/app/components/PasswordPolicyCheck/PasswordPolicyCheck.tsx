import React, { useMemo } from 'react';
import { PASSWORD_POLICY } from '@admiin-com/ds-common';
import {
  WBTypography,
  WBIcon,
  WBFlex,
  useTheme,
  WBCollapse,
  SxProps,
  Theme,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';

interface PasswordPolicyCheckProps {
  password?: string;
  sx?: SxProps<Theme>;
}

export const PasswordPolicyCheck: React.FC<PasswordPolicyCheckProps> = ({
  password,
  sx = {},
}) => {
  const { palette } = useTheme();
  const { t } = useTranslation();
  const hasLength = useMemo(
    () => (password ? password.length >= PASSWORD_POLICY.length : false),
    [password]
  );
  const hasNumbers = useMemo(
    () =>
      password ? (PASSWORD_POLICY.numbers ? /\d/.test(password) : true) : false,
    [password]
  );
  const hasSymbols = useMemo(
    () =>
      password ? (PASSWORD_POLICY.symbols ? /\W/.test(password) : true) : false,
    [password]
  );
  const hasLowercase = useMemo(
    () =>
      password
        ? PASSWORD_POLICY.lowercase
          ? /[a-z]/.test(password)
          : true
        : false,
    [password]
  );
  const hasUppercase = useMemo(
    () =>
      password
        ? PASSWORD_POLICY.uppercase
          ? /[A-Z]/.test(password)
          : true
        : false,
    [password]
  );

  const allConditionsMet = useMemo(
    () => hasLength && hasNumbers && hasSymbols && hasLowercase && hasUppercase,
    [hasLength, hasNumbers, hasSymbols, hasLowercase, hasUppercase]
  );

  return (
    <WBCollapse in={!!password && !allConditionsMet} sx={sx}>
      <WBFlex alignItems="center">
        <WBIcon
          name={hasLength ? 'Checkmark' : 'Close'}
          size="small"
          color={hasLength ? palette.success.dark : undefined}
        />
        <WBTypography
          variant="body2"
          color={hasLength ? 'success.dark' : undefined}
        >
          {t('common:8_or_more_characters')}
        </WBTypography>
      </WBFlex>
      <WBFlex alignItems="center">
        <WBIcon
          name={hasNumbers ? 'Checkmark' : 'Close'}
          size="small"
          color={hasNumbers ? palette.success.dark : undefined}
        />
        <WBTypography
          variant="body2"
          color={hasNumbers ? 'success.dark' : undefined}
        >
          {t('common:contains_a_number')}
        </WBTypography>
      </WBFlex>
      <WBFlex alignItems="center">
        <WBIcon
          name={hasSymbols ? 'Checkmark' : 'Close'}
          size="small"
          color={hasSymbols ? palette.success.dark : undefined}
        />
        <WBTypography
          variant="body2"
          color={hasSymbols ? 'success.dark' : undefined}
        >
          {t('common:contains_a_symbol')}
        </WBTypography>
      </WBFlex>
      <WBFlex alignItems="center">
        <WBIcon
          name={hasLowercase ? 'Checkmark' : 'Close'}
          size="small"
          color={hasLowercase ? palette.success.dark : undefined}
        />
        <WBTypography
          variant="body2"
          color={hasLowercase ? 'success.dark' : undefined}
        >
          {t('common:contains_a_lowercase_character')}
        </WBTypography>
      </WBFlex>
      <WBFlex alignItems="center">
        <WBIcon
          name={hasUppercase ? 'Checkmark' : 'Close'}
          size="small"
          color={hasUppercase ? palette.success.dark : undefined}
        />
        <WBTypography
          variant="body2"
          color={hasUppercase ? 'success.dark' : undefined}
        >
          {t('common:contains_an_uppercase_character')}
        </WBTypography>
      </WBFlex>
    </WBCollapse>
  );
};
