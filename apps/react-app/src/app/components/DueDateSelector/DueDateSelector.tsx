import {
  WBFlex,
  WBIcon,
  WBMenuItem,
  WBSelect,
  WBTypography,
} from '@admiin-com/ds-web';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { SelectProps } from 'libs/design-system-web/src/lib/components/primatives/Select/Select';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { styled, useTheme } from '@mui/material';
import { DATE_FORMATS, userDateFromBackendDate } from '@admiin-com/ds-common';

/* eslint-disable-next-line */
export interface DueDateSelectorProps extends SelectProps {}
export const DueDateSelector = React.forwardRef<any, DueDateSelectorProps>(
  (props: DueDateSelectorProps, ref) => {
    const daysToString = (days: number) =>
      days === 0
        ? t('today', { ns: 'taskbox' })
        : t('days', { ns: 'taskbox', day: days });

    const today = DateTime.now();

    const { t } = useTranslation();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const theme = useTheme();
    const onChange = (value: string) => {
      if (props.onChange) props.onChange({ target: { value: value } } as any);
    };

    const renderDate = (date: string) => {
      const dueDateFormat = DateTime.fromFormat(
        date,
        DATE_FORMATS.BACKEND_DATE
      ).toFormat(DATE_FORMATS.DUE_DATE);
      const days = Math.ceil(
        DateTime.fromFormat(date, DATE_FORMATS.BACKEND_DATE).diffNow('days')
          .days
      );
      return `${dueDateFormat} (${daysToString(days)})`;
    };
    return (
      <>
        <WBSelect
          {...props}
          ref={ref}
          onChange={(e) => {
            if (e.target.value === 'custom') {
              inputRef.current?.click();
              e.stopPropagation();
              e.preventDefault();
            } else {
              onChange(e.target.value);
            }
          }}
          SelectProps={{
            ...props.SelectProps,
            renderValue: (selected: any) => {
              if (selected === '' || selected?.length === 0) {
                return (
                  <>
                    <WBIcon
                      color={theme.palette.grey[500]}
                      name="Calendar"
                      size={2}
                    />
                    <WBTypography
                      component={'span'}
                      ml={1}
                      sx={{ opacity: 0.3 }}
                      fontSize={'inherit'}
                    >
                      {t('selectDate', { ns: 'taskbox' })}
                    </WBTypography>
                  </>
                ); // Render placeholder when value is empty
              }
              // Display the selected option(s) as a label
              return (
                <WBTypography sx={{ opacity: 1 }} fontSize={'inherit'}>
                  {renderDate(selected)}
                </WBTypography>
              );
            },
          }}
        >
          {[0, 7, 14, 30].map((days) => (
            <StyledMenuItem
              key={days}
              value={today
                .plus({ days: days })
                .toFormat(DATE_FORMATS.BACKEND_DATE)}
              sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}` }}
            >
              <WBFlex justifyContent={'space-between'} width={'100%'}>
                <WBTypography>{daysToString(days)}</WBTypography>
                <WBTypography>
                  {today.plus({ days: days }).toFormat('dd MMM')}
                </WBTypography>
              </WBFlex>
            </StyledMenuItem>
          ))}
          <StyledMenuItem value="custom">
            <WBIcon name="Calendar" size={2} color={'black'} />
            <WBTypography ml={1}>
              {t('customDate', { ns: 'taskbox' })}
            </WBTypography>
          </StyledMenuItem>
        </WBSelect>
        <MobileDatePicker
          sx={{ display: 'none' }}
          inputRef={inputRef}
          onAccept={(date: any) => {
            onChange(date.toFormat(DATE_FORMATS.BACKEND_DATE));
          }}
        />
      </>
    );
  }
);

export default DueDateSelector;

const StyledMenuItem = styled(WBMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));
