import { Contact, Entity } from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBFlex,
  WBLink,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  Autocomplete,
  CircularProgress,
  InputBase,
  MenuItem,
  Paper,
  debounce,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useLookupService } from '../AutoCompleteLookup/useLookupService';
import CreateServiceModal from '../../pages/ServiceCreateModal';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { TextFieldProps } from 'libs/design-system-web/src/lib/components/composites/TextField/TextField';

export type ServicesLookupProps = TextFieldProps & {
  value: any;
  isFormField?: boolean;
  onChange: (value: any) => void;
};

const ServicesLookup = (
  props: ServicesLookupProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const { value, onChange } = props;
  const entityId = useCurrentEntityId();
  const { t } = useTranslation();
  const theme = useTheme();

  const [inputValue, setInputValue] = React.useState('');

  const [options, setOptions] = React.useState<readonly any[]>(
    value ? [{ description: value }] : []
  );

  const { lookup, loading } = useLookupService({ type: 'Service', entityId });
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  //TODO: refactor code a bit?
  const fetch = React.useMemo(() => {
    return debounce(async (inputValue) => {
      if (!lookup) return;
      const results = await lookup(inputValue);
      setOptions([
        ...(results && Array.isArray(results)
          ? results?.filter((result) => result) ?? []
          : []),
      ]);
    }, 150);
  }, [lookup]);

  const [open, setOpen] = React.useState(props.isFormField ? false : true);
  const initalLoading = !value && open;

  React.useEffect(() => {
    let active = true;

    if (!initalLoading) {
      return undefined;
    }

    (async () => {
      if (active) {
        fetch('');
      }
    })();

    return () => {
      active = false;
    };
  }, [fetch, initalLoading, entityId]);

  React.useEffect(() => {
    // if (inputValue === value?.label || (value && value?.label === undefined)) {
    // fetch('');
    // } else
    fetch(inputValue);
  }, [inputValue, entityId]);

  const handleNewClick = React.useCallback(() => {
    setModalOpen(true);
  }, []);

  // React.useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);

  React.useEffect(() => {
    if (value) setInputValue(value.description);
  }, [value]);

  const addNewBox = React.useMemo(
    () => (
      <WBBox>
        <WBBox p={2}>
          <WBLink
            variant="body2"
            component={'button'}
            // sx={{ marginTop: 3 }}
            underline="always"
            color={'text.primary'}
            fontWeight={'bold'}
            onClick={handleNewClick}
          >
            {`${t('addNew', { ns: 'taskbox' })} ${t('service', {
              ns: 'taskbox',
            })}`}
          </WBLink>
        </WBBox>
      </WBBox>
    ),
    [theme.palette.grey, theme.palette.common.black, handleNewClick, t]
  );
  // console.log("value**", value, !inputValue ? "noinput" : "input", options);
  const changedRef = React.useRef(false);
  return (
    <WBBox sx={{ width: '100%' }}>
      <Autocomplete
        fullWidth
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        getOptionLabel={(option) => {
          // console.log(option, "option", !option?.description ? "no description" : "description");
          return option?.description ?? '';
        }}
        filterOptions={(x) => x}
        options={options}
        autoComplete
        blurOnSelect={true}
        includeInputInList
        filterSelectedOptions
        value={value ?? null}
        noOptionsText={
          <WBBox mx={-2}>
            <WBTypography color={'inherit'} mb={1} ml={2}>
              {t(`no${'description'}`, { ns: 'taskbox' })}
            </WBTypography>
            {addNewBox}
          </WBBox>
        }
        forcePopupIcon={true}
        // inputValue={inputValue}
        onChange={(event: React.ChangeEvent<object>, newValue: any) => {
          onChange(newValue);
          changedRef.current = true;
          console.log('newValue', newValue);
        }}
        onInputChange={(event, newInputValue) => {
          // console.log("newInputValue", newInputValue);
          setInputValue(newInputValue);
          // onChange({ description: newInputValue });
        }}
        onFocus={(event) => {
          changedRef.current = false;
        }}
        onBlur={(event) => {
          if (!changedRef.current)
            onChange({ description: inputValue, id: null });
        }}
        // clearIcon={<WBIcon name="Close" color={'black'} size={'small'} />}
        loading={loading}
        freeSolo
        disableClearable
        loadingText={t('searchingService', { ns: 'services' })}
        renderInput={(params) => {
          return !props.isFormField ? (
            <InputBase
              inputRef={ref}
              {...params.InputProps}
              value={params.inputProps.value}
              inputProps={params.inputProps}
              fullWidth
              sx={{ paddingX: 1, fontSize: '14px' }}
              endAdornment={
                <WBFlex alignItems={'center'}>
                  {loading ? (
                    <CircularProgress color="inherit" size={18} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </WBFlex>
              }
              autoFocus
            />
          ) : (
            <WBTextField
              label={t('description', { ns: 'taskbox' })}
              ref={ref}
              {...params}
              placeholder={'Select a service'}
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              helperText={props.helperText}
              error={props.error}
            />
          );
        }}
        PaperComponent={({ children, ...props }) => (
          <Paper {...props} sx={{ px: 0 }}>
            {React.Children.map(children, (child) => child)}
          </Paper>
        )}
        renderOption={(props, option, state, ownerState) => {
          return (
            <React.Fragment key={uuidv4()}>
              <MenuItem {...props} value={option?.value} divider>
                {option.description}
              </MenuItem>
              {state.index + 1 === ownerState.options.length ? (
                <WBBox>{addNewBox}</WBBox>
              ) : null}
            </React.Fragment>
          );
        }}
        autoFocus
      />
      {
        <CreateServiceModal
          defaultZIndex={false}
          open={modalOpen}
          onClose={handleCloseModal}
          onSuccess={(user) => onChange(user)}
        />
      }
    </WBBox>
  );
};

export default React.forwardRef(ServicesLookup) as <
  T extends Entity | Contact | null
>(
  props: ServicesLookupProps & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
