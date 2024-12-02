import {
  WBButton,
  WBFlex,
  WBForm,
  WBTypography,
  useMediaQuery,
  useSnackbar,
} from '@admiin-com/ds-web';
import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  BankAccountType,
  BankHolderType,
  Contact,
  ContactBankAccount,
  ContactBankAccountInput,
  ContactBpayInput,
  CreateContactInput,
  CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID,
} from '@admiin-com/ds-graphql';
import { useTheme } from '@mui/material';
import { useCreateContact } from '../../hooks/useCreateContact/useCreateContact';
import { useUpdateContact } from '../../hooks/useUpdateContact/useUpdateContact';
import { isDeepEqual } from '@mui/x-data-grid/internals';
import EntityCreateForm from '../../components/EntityCreateForm/EntityCreateForm';
import ContactBankForm from '../../components/ContactBankForm/ContactBankForm';
import ContactForm from '../../components/ContactForm/ContactForm';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
export interface ContactCreateFormData {
  client: Contact & {
    address: string;
  };
  entity: { name: string; taxNumber: string };
  bank: ContactBankAccount;
  bpay: ContactBpayInput;
}

interface ContactDetailFormProps {
  entityId?: string;
  selected?: Contact | null;
  onSubmitted?: (contact: Contact) => void;
}

export function ContactsCreateForm({
  selected = null,
  entityId: entityIdProps,
  onSubmitted,
}: ContactDetailFormProps) {
  const { t } = useTranslation();
  const methods = useForm<ContactCreateFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      bank: {
        holderType: BankHolderType.personal,
        accountType: BankAccountType.checking,
      },
    },
  });
  const { handleSubmit, setValue, reset } = methods;

  const [loading, setLoading] = useState(false);

  const [createContact, { error: createError }] = useCreateContact();
  const [updateContact, { error: updateError }] = useUpdateContact();

  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));

  const entityId = entityIdProps ?? selectedEntityIdData?.selectedEntityId;

  React.useEffect(() => {
    reset();
    if (selected) {
      setValue('client.firstName', selected.firstName ?? '');
      setValue('client.lastName', selected.lastName ?? '');
      setValue('client.phone', selected.phone ?? '');
      setValue('client.email', selected.email ?? '');
      setValue('entity.name', selected.companyName ?? '');
      setValue('entity.taxNumber', selected.taxNumber ?? '');
      setValue('bank.bankName', selected.bank?.bankName ?? '');
      if (selected.bpay?.billerCode)
        setValue('bpay.billerCode', selected.bpay?.billerCode);
      setValue('bpay.referenceNumber', selected.bpay?.referenceNumber ?? '');

      setValue('bank.accountName', selected.bank?.accountName ?? '');
      setValue('bank.accountNumber', selected.bank?.accountNumber ?? '');
      setValue('bank.routingNumber', selected.bank?.routingNumber ?? '');
      if (selected.bank?.accountType)
        setValue('bank.accountType', selected.bank?.accountType);
      if (selected.bank?.holderType)
        setValue('bank.holderType', selected.bank?.holderType);
    } else {
      console.log('no selected');
    }
  }, [selected]);

  const showSnackbar = useSnackbar();
  const onSubmit = async (data: ContactCreateFormData, event: any) => {
    event.stopPropagation();
    setLoading(true);
    try {
      const origialBank: ContactBankAccountInput | undefined | null | any = // TODO: remove any type
        selected?.bank
          ? {
              ...selected.bank,
            }
          : undefined;
      const newBank: ContactBankAccountInput | any = {
        // TODO: remove any type
        ...data.bank,
      };
      const bpay: ContactBpayInput = {
        ...data.bpay,
      };
      const isbankEmpty =
        !data.bank ||
        (data.bank && Object.values(data.bank).every((value) => value === ''));
      const isbpayEmpty =
        !data.bpay ||
        (data.bpay &&
          Object.values(data.bpay).every(
            (value) => value === '' || value === undefined || value === null
          ));
      const contact: CreateContactInput = {
        email: data.client.email ?? '',
        firstName: data.client.firstName ?? '',
        lastName: data.client.lastName ?? '',
        entityId,
      };
      if (!isDeepEqual(origialBank, newBank) && !isbankEmpty)
        contact.bank = { ...newBank };
      if (!isbpayEmpty) contact.bpay = { ...bpay };
      if (data.client.phone) contact.phone = data.client.phone;
      if (data.client.mobile) contact.mobile = data.client.mobile;
      if (data.entity.name && !selected) {
        contact.companyName = data.entity.name;
        if (data.entity.taxNumber) {
          contact.taxNumber = data.entity.taxNumber;
        }
      }
      console.log(data, contact);
      if (selected) {
        const updatedContact = await updateContact({
          variables: {
            input: {
              ...contact,
              id: selected.id,
            },
          },
        });
        onSubmitted && onSubmitted(updatedContact?.data.updateContact);
        showSnackbar({
          message: t('contactUpdated', { ns: 'contacts' }),
          severity: 'success',
          horizontal: 'right',
          vertical: 'bottom',
        });
      } else {
        const createdContact = await createContact({
          variables: {
            input: { ...contact },
          },
        });
        onSubmitted && onSubmitted(createdContact?.data.createContact);

        showSnackbar({
          message: t('contactCreated', { ns: 'contacts' }),
          severity: 'success',
          horizontal: 'right',
          vertical: 'bottom',
        });
      }

      setLoading(false);
    } catch (err) {
      console.log('error create contact: ', err);
      setLoading(false);
    }
  };
  const theme = useTheme();

  const islg = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <WBFlex flexDirection="column" alignItems="center" mb={4}>
      <FormProvider {...methods}>
        <WBForm
          mt={0}
          onSubmit={(e) => {
            e.stopPropagation(); // Prevent the event from bubbling up to the outer form
            handleSubmit(onSubmit)(e);
          }}
          alignSelf="stretch"
        >
          <WBTypography
            variant={islg ? 'h3' : 'h2'}
            noWrap
            component="div"
            color="dark"
            sx={{ flexGrow: 1, textAlign: 'left' }}
          >
            {t('contactsDetails', { ns: 'contacts' })}
          </WBTypography>
          <ContactForm />

          <WBTypography
            variant={islg ? 'h3' : 'h2'}
            noWrap
            mt={5}
            component="div"
            color="dark"
            sx={{ flexGrow: 1, textAlign: 'left' }}
          >
            {t('businessDetails', { ns: 'contacts' })}
          </WBTypography>
          <EntityCreateForm noType noAddress disabled={selected !== null} />
          <ContactBankForm selected={selected} />
          <WBButton
            sx={{
              mt: {
                xs: 6,
                sm: 8,
              },
            }}
            loading={loading}
          >
            {t(`${selected ? 'updateContact' : 'createContact'}`, {
              ns: 'contacts',
            })}
          </WBButton>
        </WBForm>
      </FormProvider>
      <ErrorHandler errorMessage={createError?.message} />
      <ErrorHandler errorMessage={updateError?.message} />
    </WBFlex>
  );
}
