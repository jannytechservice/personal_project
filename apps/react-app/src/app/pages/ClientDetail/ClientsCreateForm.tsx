import {
  WBButton,
  WBFlex,
  WBForm,
  WBTypography,
  useMediaQuery,
  useSnackbar,
} from '@admiin-com/ds-web';
import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ClientInput,
  Contact,
  CreateEntityInput,
  CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID,
  createClient as CREATE_CLIENT,
  entityUsersByUser as LIST_ENTITY_USERS,
  Entity,
  EntityType,
  EntityUser,
  EntityUserRole,
  updateEntity as UPDATE_ENTITY,
} from '@admiin-com/ds-graphql';
import { useTheme } from '@mui/material';
import { useUpdateContact } from '../../hooks/useUpdateContact/useUpdateContact';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import ContactForm from '../../components/ContactForm/ContactForm';
import EntityCreateForm from '../../components/EntityCreateForm/EntityCreateForm';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
export interface ContactCreateFormData {
  client: Contact & {
    address: string;
  };
}

interface ContactDetailFormProps {
  selected?: (Contact & { entity?: Entity }) | null;
  onSubmitted?: (contact: Contact) => void;
}

export type CreateClientForm = {
  client: ClientInput;
  entity: CreateEntityInput;
};

export function ClientsCreateForm({
  selected = null,
  onSubmitted,
}: ContactDetailFormProps) {
  const { t } = useTranslation();
  const methods = useForm<CreateClientForm>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = methods;

  const [loading, setLoading] = useState(false);

  const [createClient, { error: createError }] = useMutation(
    gql(CREATE_CLIENT)
  );
  const [updateEntity, { error: updateError }] = useMutation(
    gql(UPDATE_ENTITY)
  );

  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const [created, setCreated] = useState(false);

  const { entity } = useSelectedEntity();
  const entityId = selectedEntityIdData?.selectedEntityId;

  const resetForm = () => {
    reset();
    setValue('entity.firstName', '');
    setValue('entity.lastName', '');
    setValue('entity.type', '' as EntityType);
    setValue('entity.name', '');
    setValue('entity.taxNumber', '');
    setValue('entity.address.address1', '');
    setValue('entity.address.city', '');
    setValue('entity.address.state', '');
    setValue('entity.address.postalCode', '');
    setValue('entity.address.country', '');
    setValue('entity.address.streetName', '');
    setValue('entity.address.streetType', '');
    setValue('entity.address.streetNumber', '');
    setValue('entity.address.unitNumber', '');
  };

  useEffect(() => {
    if (!selected) {
      resetForm();
    } else {
      setValue('client.firstName', selected.firstName ?? '');
      setValue('client.lastName', selected.lastName ?? '');
      setValue('client.phone', selected.phone ?? '');
      setValue('client.email', selected.email ?? '');
      if (selected.entity) {
        // if (type !== 'ENTITY') setDisabledAbnSelection(true);
        setValue('entity.type', selected.entity.type);
        if (selected.entity.name) setValue('entity.name', selected.entity.name);
        if (selected.entity.contact?.firstName)
          setValue('entity.firstName', selected.entity.contact?.firstName);
        if (selected.entity.contact?.lastName)
          setValue('entity.lastName', selected.entity.contact?.lastName);
        setValue(
          'entity.address.address1',
          selected.entity.address?.address1 ?? ''
        );
        setValue('entity.taxNumber', selected.entity.taxNumber);
      }
    }
  }, [selected]);

  const showSnackbar = useSnackbar();
  const onSubmit = async (data: CreateClientForm) => {
    setLoading(true);
    try {
      const client: ClientInput = {
        ...data.client,
        name: `${data.client.firstName ?? ''}  ${data.client.lastName ?? ''}`,
      };
      const entity = data.entity;

      // if (data.entity.type === EntityType.INDIVIDUAL) {
      //   entity.name = `${data.entity.firstName ?? ''}  ${
      //     data.entity.lastName ?? ''
      //   }`;
      // }

      if (!selected) {
        const createdContact = await createClient({
          variables: {
            input: { entityId, client, entity },
          },
          update(cache, { data: { createClient } }) {
            cache.modify({
              fields: {
                entityUsersByUser(existingEntityUsersRef = {}, { readField }) {
                  // Create a new entity user object to add.
                  // Write the new entity user into the cache.
                  const createdClientRef = cache.writeFragment({
                    data: createClient,
                    fragment: gql`
                      fragment NewEntityUser on EntityUser {
                        id
                        entityId
                        userId
                        role
                        invitedEntityId
                        firstName
                        lastName
                        entitySearchName
                        entity
                        searchName
                        createdBy
                        createdAt
                        updatedAt
                      }
                    `,
                  });
                  // Prepare the updated items array.
                  // Ensure the existing `items` array is correctly read from the existing reference.
                  const existingItems = existingEntityUsersRef.items
                    ? (readField(
                        'items',
                        existingEntityUsersRef
                      ) as EntityUser[])
                    : [];
                  // Return the updated entityUsers object with the new entity user included.

                  return {
                    ...existingEntityUsersRef,
                    items: [...existingItems, createdClientRef],
                  };
                },
              },
            });
          },
        });
        onSubmitted && onSubmitted(createdContact?.data.createContact);
        setCreated(true);
        resetForm();
        showSnackbar({
          message: t('clientCreated', { ns: 'contacts' }),
          severity: 'success',
          horizontal: 'right',
          vertical: 'bottom',
        });
      } else {
        await updateEntity({
          variables: {
            input: {
              id: selected.entityId,
              address: data.entity.address,
            },
          },
        });
        showSnackbar({
          message: t('clientUpdated', { ns: 'contacts' }),
          severity: 'success',
          horizontal: 'right',
          vertical: 'bottom',
        });
      }

      setLoading(false);
    } catch (err) {
      console.log('error create client: ', err);
      setLoading(false);
    }
  };
  const theme = useTheme();

  const islg = useMediaQuery(theme.breakpoints.down('lg'));

  // if (notAbleToCreate) {
  //   return null; //<WBTypography>Clients are not enabled for this entity</WBTypography>;
  // }

  //@ts-ignore
  return (
    <WBFlex flexDirection="column" alignItems="center" mb={4}>
      <WBForm onSubmit={handleSubmit(onSubmit)} alignSelf="stretch">
        <FormProvider {...methods}>
          <WBTypography
            variant={islg ? 'h3' : 'h2'}
            noWrap
            component="div"
            color="dark"
            sx={{ flexGrow: 1, textAlign: 'left' }}
          >
            {t('clientDetails', { ns: 'contacts' })}
          </WBTypography>
          {selected !== null && (
            <WBTypography>
              {t('clientDetailsDescription', { ns: 'contacts' })}
            </WBTypography>
          )}
          <ContactForm disabled={selected !== null} />
          {/* {selected === null && ( */}
          <>
            <WBTypography
              variant={islg ? 'h3' : 'h2'}
              noWrap
              mt={5}
              component="div"
              color="dark"
              sx={{ flexGrow: 1, textAlign: 'left' }}
            >
              {t('entityDetails', { ns: 'contacts' })}
            </WBTypography>
            <EntityCreateForm
              type="CLIENT"
              key={created as any}
              disabled={selected !== null}
            />
          </>
          {/* )} */}
        </FormProvider>
        <WBButton
          sx={{
            mt: {
              xs: 6,
              sm: 8,
            },
          }}
          loading={loading}
        >
          {t(`${selected ? 'updateClient' : 'createClient'}`, {
            ns: 'contacts',
          })}
        </WBButton>
      </WBForm>
      <ErrorHandler errorMessage={createError?.message} />
      <ErrorHandler errorMessage={updateError?.message} />
    </WBFlex>
  );
}
