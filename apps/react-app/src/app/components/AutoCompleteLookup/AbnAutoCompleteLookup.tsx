import {
  AbrNameSearchInformation,
  Contact,
  Entity,
} from '@admiin-com/ds-graphql';
import {
  WBAutocomplete,
  WBIcon,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { MenuItem, Paper, debounce } from '@mui/material';
import {
  abrLookup as ABR_LOOKUP,
  abrLookupByName as ABR_LOOKUP_BY_NAME,
} from '@admiin-com/ds-graphql';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { gql, useLazyQuery } from '@apollo/client';
import { TextFieldProps } from 'libs/design-system-web/src/lib/components/composites/TextField/TextField';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export type ABNResult = {
  name: string;
  abn?: string;
  acn?: string;
  state?: string | null | undefined;
  address?: string | null | undefined;
  type?: string;
  entityTypeName?: string;
};

export interface AutoCompleteLookupProps {
  value?: any;
  label: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (option: any) => void;
  defaultValue?: any;
  getOptionLabel?: (option: any) => string;
  noPopupIcon?: boolean;
  onLoading?: (value: boolean) => void;
  onSearch?: (result: ABNResult) => void;
  onError?: (error: any) => void;
  renderProps: TextFieldProps;
  nameOnly?: boolean;
}

const AutoCompleteLookup = (
  {
    onChange,
    label,
    placeholder,
    disabled = false,
    defaultValue,
    noPopupIcon = false,
    onSearch,
    value,
    renderProps,
    onError,
    onLoading,
    ...props
  }: AutoCompleteLookupProps,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState(value || '');

  const [options, setOptions] = React.useState<readonly any[]>([]);

  const [error, setError] = React.useState<string>('');

  const [abrLookupByName, { loading: abrLookupByNameLoading }] = useLazyQuery(
    gql`
      ${ABR_LOOKUP_BY_NAME}
    `
  );

  const [abrLookup, { loading: abrLookUpLoading }] = useLazyQuery(
    gql`
      ${ABR_LOOKUP}
    `
  );

  //React.useEffect(() => {
  //  if (onLoading) onLoading(loading);
  //}, [loading]);

  useEffect(() => {
    if (onLoading) onLoading(abrLookupByNameLoading || abrLookUpLoading);
  }, [abrLookupByNameLoading, abrLookUpLoading, onLoading]);

  //TODO: refactor code a bit?
  const isABN = (abn: string) => {
    return /^\d{11}$/.test(abn);
  };
  const isACN = (abn: string) => {
    return /^\d{9}$/.test(abn);
  };
  const abnLookup = async (abn: string) => {
    //setLoading(true);
    try {
      // onChange(abn);
      if (onLoading) onLoading(true);
      const abnInfoData: any = await abrLookup({
        variables: { abn: abn },
      });

      if (onLoading) onLoading(false);

      const abnInfo = abnInfoData?.data?.abrLookup;
      if (abnInfo && abnInfo.message === null && abnInfo.entityName) {
        // Set the business name in the form
        setOptions([abnInfo]);
        if (onSearch)
          onSearch({
            name: abnInfo.entityName ?? '',
            abn: abnInfo.abn,
            acn: abnInfo.acn,
            address: abnInfo.addressState,
            state: abnInfo.addressState,
            type: abnInfo.type ?? 'COMPANY',
            entityTypeName: abnInfo.entityTypeName,
          });
      } else throw new Error('AbnInvalid');
    } catch (error: any) {
      console.log(error);
      throw error;
    } finally {
      if (onLoading) onLoading(false);
    }
  };
  const nameLookup = async (name: string) => {
    //setLoading(true);
    try {
      const result: any = await abrLookupByName({
        variables: { name: name },
      });
      const items =
        result?.data?.abrLookupByName?.items?.filter(
          (item: any) => !!item.abn
        ) || [];
      setOptions(
        items.slice(0, 5).map((item: AbrNameSearchInformation) => ({
          ...item,
          label: `${item.name} - ${item.abn}`,
          value: item.abn,
        }))
      );
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      //setLoading(false);
    }
  };
  const fetch = React.useMemo(() => {
    return debounce(async (inputValue) => {
      try {
        if (isABN(inputValue) || isACN(inputValue)) {
          await abnLookup(inputValue);
        } else if (inputValue) {
          if (onSearch) onSearch({ name: '', abn: '', type: '' });
          await nameLookup(inputValue);
        }
      } catch (error: any) {
        console.log(error);
        if (onError) onError(error);
      }
    }, 500);
  }, []);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    fetch(inputValue);
  }, [inputValue, fetch]);

  return (
    <WBAutocomplete
      fullWidth
      open={
        inputValue && !isABN(inputValue) && !isACN(inputValue) ? open : false
      }
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(option) =>
        props.getOptionLabel
          ? props.getOptionLabel(option)
          : typeof option === 'string'
          ? option
          : option.label ??
            option.name ??
            option.searchName ??
            `${option.firstName} ${option.lastName}` ??
            ''
      }
      filterOptions={(x) => x}
      options={options}
      clearOnEscape
      autoComplete
      includeInputInList
      // filterSelectedOptions
      value={value || null}
      noOptionsText={
        inputValue ? (
          <WBTypography color={'inherit'}>
            {t(`noResultsTitle`, { ns: 'common' })}
          </WBTypography>
        ) : null
      }
      popupIcon={
        noPopupIcon ? undefined : (
          <WBIcon name="ChevronDown" size={1.3} color={'black'} />
        )
      }
      inputValue={inputValue}
      onChange={async (event: React.ChangeEvent<object>, newValue: any) => {
        onChange(newValue);
        await abnLookup(newValue?.abn);
        // event.target.blur();
      }}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      freeSolo
      isOptionEqualToValue={(option: any, value: any) => {
        if (isABN(value) || isACN(value)) return true;
        return option?.value === value;
      }}
      disableClearable
      clearIcon={undefined} //<WBIcon name="Close" color={'black'} size={'small'} />}
      loading={abrLookupByNameLoading || abrLookUpLoading}
      loadingText={'Loading...'}
      renderInput={(params) => {
        return (
          <WBTextField
            label={label}
            inputRef={ref}
            {...params}
            placeholder={placeholder}
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {abrLookupByNameLoading || abrLookUpLoading ? (
                    <LoadingSpinner />
                  ) : null}
                  {/* {params.InputProps.endAdornment} */}
                </React.Fragment>
              ),
            }}
            {...renderProps}
          />
        );
      }}
      PaperComponent={({ children, ...props }) => (
        <Paper {...props} sx={{ px: 2, py: 2.3 }}>
          {React.Children.map(children, (child) => child)}
        </Paper>
      )}
      renderOption={(props, option, state, ownerState) => {
        return (
          <React.Fragment key={option.id ?? uuidv4()}>
            <MenuItem
              {...props}
              value={option.value}
              sx={{ bgcolor: 'background.paper' }}
            >
              {option.label}
            </MenuItem>
          </React.Fragment>
        );
      }}
      disabled={disabled}
    />
  );
};

export default React.forwardRef(AutoCompleteLookup) as <
  T extends Entity | Contact | null
>(
  props: AutoCompleteLookupProps & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
