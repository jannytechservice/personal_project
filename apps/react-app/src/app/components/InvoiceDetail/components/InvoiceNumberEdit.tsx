import {
  WBButton,
  WBFlex,
  WBIconButton,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import LoadSvgIcon from '../../../component/LoadSvgIcon/LoadSvgIcon';
import PenIcon from '../../../../assets/icons/pen-icon.svg';
import { styled } from '@mui/material';
import { InvoiceStatus } from '@admiin-com/ds-graphql';

interface Props {
  hideToolbar?: boolean;
}

export const InvoiceNumberEdit = (props: Props) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const methods = useFormContext();
  const { t } = useTranslation();

  const [textWidth, setTextWidth] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth);
    }
  }, [isEditing]);

  useEffect(() => {
    if (inputRef.current) {
      setTextWidth(inputRef.current.scrollWidth + 10);
    }
  }, [methods.watch('reference')]);

  const invoiceStatus = useWatch({ name: 'invoiceStatus' });

  return (
    <WBFlex flexDirection={['column', 'row']}>
      {!props.hideToolbar && (
        <WBTypography variant="h3" mr={2} mb={0}>
          {t(
            invoiceStatus === InvoiceStatus.INVOICE ? 'invoiceNo' : 'quoteNo',
            { ns: 'taskbox' }
          )}
        </WBTypography>
      )}
      <Controller
        name="reference"
        defaultValue={'INVOICENAME-002'}
        control={methods.control}
        render={({ field }) =>
          isEditing ? (
            <ReferenceInput
              {...field}
              inputRef={inputRef}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditing(false);
                }
              }}
              placeholder="INVOICENAME-002"
              fullWidth={false}
              sx={{ width: textWidth, maxWidth: '100%' }}
            />
          ) : (
            <WBFlex alignItems={'center'} gap={1}>
              <RefererenceText noWrap ref={textRef}>
                {field.value}
              </RefererenceText>
              <WBIconButton size="small" onClick={() => setIsEditing(true)}>
                <LoadSvgIcon component={PenIcon} />
              </WBIconButton>
            </WBFlex>
          )
        }
      />
    </WBFlex>
  );
};
const ReferenceInput = styled(WBTextField)(({ theme }) => ({
  marginTop: -2,
  '& .MuiInput-input': {
    ...theme.typography.h4,
    fontWeight: 500,
    color: theme.palette.grey[800],
    marginBottom: 0,
  },
  height: 40,
  minWidth: 200,
}));

const RefererenceText = styled(WBTypography)(({ theme }) => ({
  ...theme.typography.h4,
  fontWeight: 500,
  marginBottom: 0,
  color: theme.palette.grey[600],
}));
