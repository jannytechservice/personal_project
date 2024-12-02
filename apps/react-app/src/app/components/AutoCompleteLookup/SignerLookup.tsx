import { Contact, Entity, TaskDirection } from '@admiin-com/ds-graphql';
import {
  WBAutocomplete,
  WBBox,
  WBDivider,
  WBIcon,
  WBLink,
  WBListItemIcon,
  WBSvgIcon,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  AutocompleteRenderGroupParams,
  CircularProgress,
  MenuItem,
  Paper,
  debounce,
  styled,
  useTheme,
} from '@mui/material';
import { getContact as GET_CONTACT } from '@admiin-com/ds-graphql';
import React from 'react';
import { useLookupService } from './useLookupService';
import { useTranslation } from 'react-i18next';
import { ContactCreateModal } from '../../pages/ContactCreateModal/ContactCreateModal';
import { EntityCreateModal } from '../../pages/EntityCreateModal/EntityCreateModal';
import { v4 as uuidv4 } from 'uuid';
import { TextFieldProps } from 'libs/design-system-web/src/lib/components/composites/TextField/TextField';
import { useTaskCreationContext } from '../../pages/TaskCreation/TaskCreation';
import { getName } from '../../helpers/contacts';
import { useFormContext, useWatch } from 'react-hook-form';
import AddUserModal from '../AddUserModal/AddUserModal';
import UserIcon from '../../../assets/icons/user.svg';
import { useLocation, useParams } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';

export type AutoCompleteDataType =
  | 'Contact'
  | 'Entity'
  | 'EntityUser'
  | 'AutocompleteResults'
  | 'ContactsAndVerifiedEntity'
  | 'Service'
  | 'Signer';

export interface SignerLookupProps extends TextFieldProps {
  value?: any;
  label: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (option: any) => void;
  defaultValue?: any;
  getOptionLabel?: (option: any) => string;
  type: AutoCompleteDataType;
  entityId?: string;
  noPopupIcon?: boolean;
  noLookup?: boolean;
}

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  // top: '-8px',
  margin: '8px 16px',
  fontWeight: 'bold',
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  paddingBottom: theme.spacing(2),
}));

const GroupItems = styled('ul')(({ theme }) => ({
  padding: 0,
  marginBottom: theme.spacing(3.5),
}));

const SignerLookup = (
  {
    onChange,
    label,
    placeholder,
    disabled = false,
    type,
    defaultValue,
    noPopupIcon = false,
    value,
    entityId,
    noLookup: noLookupProps,
    ...props
  }: SignerLookupProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [inputValue, setInputValue] = React.useState('');

  const [options, setOptions] = React.useState<readonly any[]>([]);

  const { lookup, loading } = useLookupService({ type, entityId });

  const [modalOpen, setModalOpen] = React.useState<AutoCompleteDataType | null>(
    null
  );
  const handleCloseModal = () => {
    setModalOpen(null);
  };

  const { id: contactId } = useParams();
  const { pathname } = useLocation();

  const [getContact, { data: contactOnUrl }] = useLazyQuery(
    gql(GET_CONTACT),
    {}
  );

  React.useEffect(() => {
    console.log('contactId', contactId, pathname);
    if (pathname.includes('contacts') && contactId) {
      getContact({ variables: { id: contactId } });
    }
  }, [contactId, pathname]);

  //TODO: refactor code a bit?
  const fetch = React.useMemo(() => {
    return debounce(async (inputValue) => {
      if (!lookup) return;
      const results = await lookup(inputValue);
      const contact = contactOnUrl?.getContact;
      const newResults = [
        ...(results && Array.isArray(results)
          ? results?.filter((result) => result) ?? []
          : []),
      ];
      if (contact)
        setOptions([
          {
            ...contact,
            name: `${contact.firstName} ${contact.lastName}`,
            id: contact.id,
            email: contact.email,
            searchType: 'CONTACT',
            noLookup: true,
          },
          ...newResults,
        ]);
      else setOptions(newResults);
    }, 150);
  }, [lookup, contactOnUrl]);

  const [open, setOpen] = React.useState(false);
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
    if (noLookup) return;
    if (inputValue === value?.label || (value && value?.label === undefined)) {
      fetch('');
    } else fetch(inputValue);
  }, [inputValue, fetch, entityId]);

  const handleNewClick = React.useCallback(() => {
    setModalOpen(type);
    setNoLookup(true);

    onChange({
      name: inputValue,
      noLookup: true,
    });
  }, [type, inputValue]);

  const [noLookup, setNoLookup] = React.useState(false);

  React.useEffect(() => {
    setNoLookup(!!noLookupProps);
  }, [noLookupProps]);

  // React.useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);

  const addNewBox = React.useMemo(
    () =>
      type !== 'AutocompleteResults' ? (
        <WBBox>
          <WBBox p={2} pb={0}>
            <WBLink
              variant="body2"
              component={'button'}
              // sx={{ marginTop: 3 }}
              underline="always"
              color={'text.primary'}
              fontWeight={'bold'}
              onClick={handleNewClick}
            >
              {`${t('addNew', { ns: 'taskbox' })} ${t(type, {
                ns: 'taskbox',
              })}`}
            </WBLink>
          </WBBox>
        </WBBox>
      ) : (
        <WBBox />
      ),
    [theme.palette.grey, theme.palette.common.black, handleNewClick, t, type]
  );

  const groupCounts: any = {};

  options.forEach((option) => {
    const groupKey = option?.searchType; // Assuming `searchType` defines the group
    groupCounts[groupKey] = (groupCounts[groupKey] || 0) + 1;
  });

  const renderCounter: any = {};

  const renderGroup = (params: AutocompleteRenderGroupParams) => {
    const groupKey = params.key;
    renderCounter[groupKey] = (renderCounter[groupKey] || 0) + 1;

    const isLastGroupItem =
      Object.values(renderCounter).length === Object.values(groupCounts).length;
    return (
      <li key={params.key}>
        <GroupHeader>{params.group}</GroupHeader>
        <GroupItems>{params.children}</GroupItems>

        {isLastGroupItem ? addNewBox : null}
      </li>
    );
  };

  const getGroupLabel = (option: any) => {
    switch (option.searchType) {
      case 'Contacts':
        return t('yourContacts', { ns: 'taskbox' });
      case 'AutoCompleteResults':
        return t('admiinBusinesses', { ns: 'taskbox' });
      default:
        return option.searchType;
    }
  };

  return (
    <>
      <WBAutocomplete
        fullWidth
        groupBy={
          type === 'ContactsAndVerifiedEntity' ? getGroupLabel : undefined
        }
        renderGroup={renderGroup}
        open={open && !noLookup}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        getOptionLabel={(option) => {
          return option ? option?.name ?? '' : '';
        }}
        filterOptions={(x) => x}
        options={options}
        clearOnEscape
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value ?? null}
        noOptionsText={
          <WBBox mx={-2}>
            <WBTypography color={'inherit'} mb={1} ml={2}>
              {t(`no${type}`, { ns: 'taskbox' })}
            </WBTypography>
            {addNewBox}
          </WBBox>
        }
        popupIcon={
          noPopupIcon ? null : (
            <WBIcon name="ChevronDown" size={1.3} color={'black'} />
          )
        }
        inputValue={inputValue}
        onChange={(event: React.ChangeEvent<object>, newValue: any) => {
          onChange({ ...newValue, noLookup: false });
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onBlur={(event) => {
          if (noLookup)
            onChange({ name: inputValue, noLookup: true, id: null });
        }}
        freeSolo={noLookup}
        clearIcon={<WBIcon name="Close" color={'black'} size={'small'} />}
        loading={loading}
        loadingText={t('searchingSigner', { ns: 'taskbox' })}
        renderInput={(params) => (
          <WBTextField
            label={label}
            ref={ref}
            {...params}
            error={props.error}
            helperText={props.helperText}
            placeholder={placeholder}
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <React.Fragment>
                  <WBSvgIcon fontSize="small" sx={{ mr: 1 }}>
                    <UserIcon />
                  </WBSvgIcon>
                  {params.InputProps.startAdornment}
                </React.Fragment>
              ),
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        PaperComponent={({ children, ...props }) => (
          <Paper {...props} sx={{ px: 0 }}>
            {React.Children.map(children, (child) => child)}
          </Paper>
        )}
        renderOption={(props, option, state, ownerState) => {
          return (
            <React.Fragment key={option.id ?? uuidv4()}>
              <MenuItem {...props} value={option?.value} divider>
                {option?.name}
              </MenuItem>

              {state.index + 1 === ownerState.options.length ? (
                <WBBox>{addNewBox}</WBBox>
              ) : null}
            </React.Fragment>
          );
        }}
        disabled={disabled}
      />
      {
        <>
          <ContactCreateModal
            onSuccess={(contact) => {
              onChange(contact);
            }}
            entityId={entityId}
            handleCloseModal={handleCloseModal}
            open={
              modalOpen === 'Contact' ||
              modalOpen === 'ContactsAndVerifiedEntity'
            }
          />
          <AddUserModal
            open={modalOpen === 'EntityUser'}
            handleClose={handleCloseModal}
            onSuccess={(user) => onChange(user)}
          />
        </>
      }
    </>
  );
};

export default React.forwardRef(SignerLookup) as <
  T extends Entity | Contact | null
>(
  props: SignerLookupProps & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
