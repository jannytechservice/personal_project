import {
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  RadioGroup,
  Switch,
} from '@mui/material';
import InformationIcon from '../../../../../../libs/design-system-web/src/lib/components/primatives/InformationIcon/InformationIcon';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import { useTranslation } from 'react-i18next';
import {
  WBButton,
  WBForm,
  WBIcon,
  WBRadio,
  WBTextField,
  WBTooltip,
  useSnackbar,
  WBTypography,
  WBBox,
} from '@admiin-com/ds-web';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import { REGEX } from '@admiin-com/ds-common';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import {
  createEntityUser as CREATE_ENTITY_USER,
  CreateEntityUserRole,
  EntityUser,
} from '@admiin-com/ds-graphql';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { gql, useMutation, useQuery } from '@apollo/client';

import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { useOwnerPermission } from '../../hooks/useCurrentUser/useCurrentUser';

/* eslint-disable-next-line */
export interface AddUserModalProps {
  open: boolean;
  handleClose: () => void;
  onSuccess?: (user: EntityUser) => void;
}

type CreateUserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: CreateEntityUserRole;
  paymentsEnabled: boolean;
};

export function AddUserModal({
  open,
  onSuccess,
  handleClose,
}: AddUserModalProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const inputs = React.useMemo(
    () => ({
      firstName: {
        label: t('firstName', { ns: 'contacts' }),
        name: 'firstName' as const,
        type: 'text',
        placeholder: t('John', { ns: 'contacts' }),
        defaultValue: '',
        rules: { required: t('firstNameRequired', { ns: 'contacts' }) },
      },
      lastName: {
        label: t('lastName', { ns: 'contacts' }),
        name: 'lastName' as const,
        type: 'text',
        placeholder: t('Smith', { ns: 'contacts' }),
        defaultValue: '',
        rules: { required: t('lastNameRequired', { ns: 'contacts' }) },
      },
      email: {
        label: t('email', { ns: 'contacts' }),
        name: 'email' as const,
        type: 'email',
        defaultValue: '',
        placeholder: t('hello@email.com', { ns: 'contacts' }),
        rules: {
          required: t('emailRequired', { ns: 'common' }),
          pattern: {
            value: REGEX.EMAIL,
            message: t('invalidEmail', { ns: 'common' }),
          },
        },
      },
      role: {
        label: t('role', { ns: 'settings' }),
        name: 'role' as const,
        type: 'text',
        defaultValue: CreateEntityUserRole.ADMIN,
        rules: {
          required: t('roleRequired', { ns: 'settings' }),
        },
      },
      paymentsEnabled: {
        label: t('paymentsEnabled', { ns: 'settings' }),
        name: 'paymentsEnabled' as const,
        type: 'checkbox',
        defaultValue: true,
        rules: {},
      },
    }),
    [t]
  );
  const entityId = useCurrentEntityId();
  const [createEntityUser, { error: createError }] = useMutation(
    gql(CREATE_ENTITY_USER),
    {
      update(cache, { data: { createEntityUser } }) {
        cache.modify({
          fields: {
            entityUsersByEntityId(
              existingEntityUsersByEntityId = { items: [] }
            ) {
              console.log(createEntityUser);
              const dataRef = cache.writeFragment({
                data: createEntityUser,
                fragment: gql`
                  fragment NewEntityUser on EntityUser {
                    id
                    entityId
                    firstName
                    lastName
                    email
                    role
                    createdAt
                    updatedAt
                  }
                `,
              });
              return {
                ...existingEntityUsersByEntityId,
                items: existingEntityUsersByEntityId.items.concat(dataRef),
              };
            },
          },
        });
      },
    }
  );

  const { data: subData } = useQuery(gql(GET_SUB));

  const [loading, setLoading] = React.useState(false);
  const showSnackbar = useSnackbar();

  const ownerPermission = useOwnerPermission();

  const onSubmit = async (data: CreateUserFormData, event: any) => {
    event.stopPropagation();
    setLoading(true);
    try {
      if (entityId) {
        const createdEntityUserData = await createEntityUser({
          variables: {
            input: {
              entityId,
              userId: subData?.sub,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              role: data.role,
              paymentsEnabled: data.paymentsEnabled,
            },
          },
        });
        const createdEntityUser = createdEntityUserData?.data?.createEntityUser;
        if (!createdEntityUser) return;
        onSuccess && onSuccess(createdEntityUser);
        showSnackbar({
          message: t('entityUserCreated', { ns: 'settings' }),
          severity: 'success',
          horizontal: 'right',
          vertical: 'bottom',
        });
        reset();
        handleClose();
      }
    } catch (err) {
      console.log('error updating entity: ', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SimpleDrawDlg
      open={open}
      handleClose={handleClose}
      maxWidth={'xs'}
      fullWidth={true}
    >
      <DialogTitle variant="h3" fontWeight={'bold'}>
        {t('addUser', {
          ns: 'settings',
        })}
      </DialogTitle>
      <DialogContent>
        <WBTypography>
          {t('addUserDescription', { ns: 'settings' })}
        </WBTypography>
        <WBForm
          onSubmit={(e) => {
            e.stopPropagation(); // Prevent the event from bubbling up to the outer form
            handleSubmit(onSubmit)(e);
          }}
        >
          <Controller
            control={control}
            name={inputs.firstName.name}
            rules={inputs.firstName.rules}
            defaultValue={inputs.firstName.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type={inputs.firstName.type}
                variant="standard"
                label={inputs.firstName.label}
                placeholder={inputs.firstName.placeholder}
                error={!!errors?.firstName}
                helperText={errors?.firstName?.message || ''}
              />
            )}
          />
          <Controller
            control={control}
            name={inputs.lastName.name}
            rules={inputs.lastName.rules}
            defaultValue={inputs.lastName.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type={inputs.lastName.type}
                variant="standard"
                label={inputs.lastName.label}
                placeholder={inputs.lastName.placeholder}
                error={!!errors?.lastName}
                helperText={errors?.lastName?.message || ''}
              />
            )}
          />

          <Controller
            control={control}
            name={inputs.email.name}
            rules={inputs.email.rules}
            defaultValue={inputs.email.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type={inputs.email.type}
                variant="standard"
                label={inputs.email.label}
                placeholder={inputs.email.placeholder}
                error={!!errors?.email}
                helperText={errors?.email?.message || ''}
              />
            )}
          />
          <Controller
            control={control}
            name={inputs.paymentsEnabled.name}
            rules={inputs.paymentsEnabled.rules}
            defaultValue={inputs.paymentsEnabled.defaultValue}
            render={({ field }) => (
              <WBBox mt={2}>
                <InputLabel>
                  {t(field.value ? 'paymentsEnabled' : 'paymentsDisabled', {
                    ns: 'settings',
                  })}
                </InputLabel>
                {
                  <Switch
                    inputProps={{ 'aria-label': 'controlled' }}
                    checked={field.value}
                    onChange={async (e) => {
                      field.onChange(e);
                    }}
                    sx={{ marginLeft: -1.5, mt: 1 }}
                    disabled={!ownerPermission}
                  />
                }
              </WBBox>
            )}
          />
          <Controller
            control={control}
            name={inputs.role.name}
            rules={inputs.role.rules}
            defaultValue={inputs.role.defaultValue}
            render={({ field }) => (
              <FormControl sx={{ mt: 3 }}>
                <FormLabel sx={{ verticalAlign: 'center' }}>
                  {inputs.role.label}
                  &nbsp;
                  <InformationIcon title={'Roles coming soon'} />
                </FormLabel>
                <RadioGroup row {...field}>
                  {Object.values(CreateEntityUserRole)
                    .filter(
                      (role) =>
                        //role !== CreateEntityUserRole.ACCOUNTANT &&
                        role !== CreateEntityUserRole.CONTRIBUTOR
                    )
                    .map((value) => (
                      <FormControlLabel
                        value={value}
                        control={<WBRadio size="small" />}
                        sx={{ marginRight: 2, fontSize: 'body2.fontSize' }}
                        label={t(value, { ns: 'settings' })}
                        key={value}
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            )}
          />

          <WBButton
            sx={{
              mt: {
                xs: 4,
                sm: 6,
              },
            }}
            loading={loading}
          >
            {t('addUser', {
              ns: 'settings',
            })}
          </WBButton>
        </WBForm>
        <ErrorHandler errorMessage={createError?.message} />
      </DialogContent>
    </SimpleDrawDlg>
  );
}

export default AddUserModal;
