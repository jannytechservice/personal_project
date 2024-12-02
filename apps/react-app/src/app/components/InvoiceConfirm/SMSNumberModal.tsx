import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { WBButton, WBForm, WBTelInput, WBTypography } from '@admiin-com/ds-web';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import { t } from 'i18next';
import {
  Contact,
  updateContact as UPDATE_CONTACT,
} from '@admiin-com/ds-graphql';
import { Controller, useForm } from 'react-hook-form';
import { matchIsValidTel } from 'mui-tel-input';
import { gql, useMutation } from '@apollo/client';

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onOK: (number: string) => Promise<void>;
  defaultNumber?: string;
  contact?: Contact;
}

function SMSNumberModal(props: ConfirmationDialogProps) {
  const { onClose, open, onOK, defaultNumber, contact, ...other } = props;

  const handleCancel = () => {
    onClose();
  };
  const [updateContact] = useMutation(gql(UPDATE_CONTACT));

  const isCreate = Boolean(defaultNumber) === false;

  const title = isCreate
    ? t('addContactNumberTitle', { ns: 'taskbox', contact: contact?.name })
    : t('editContactNumberTitle', { ns: 'taskbox', contact: contact?.name });
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = React.useState(false);
  const onSubmit = async (data: any) => {
    console.log(contact);
    setLoading(true);
    if (contact?.id)
      await updateContact({
        variables: {
          input: {
            id: contact?.id,
            entityId: contact.entityId,
            phone: '123456789',
          },
        },
      });
    await onOK(data.phone);
    setLoading(false);
    onClose();
  };

  return (
    <SimpleDrawDlg open={open} handleClose={onClose}>
      <WBForm onSubmit={handleSubmit(onSubmit)} mt={0}>
        <DialogTitle variant="h3" textAlign={'center'} sx={{ p: 0 }}>
          {title}
          <WBTypography textAlign={'center'}>
            {t('contactNumberDescription', { ns: 'taskbox' })}
          </WBTypography>
        </DialogTitle>
        <DialogContent sx={{ px: [2, 10] }}>
          <Controller
            control={control}
            name="phone"
            defaultValue={defaultNumber}
            rules={{
              required: t('phoneRequired', { ns: 'common' }),
              validate: (value: string | null | undefined) =>
                value === null ||
                value === undefined ||
                value === '' ||
                matchIsValidTel(value) ||
                t('invalidPhone', { ns: 'common' }),
            }}
            render={({ field, fieldState }) => (
              //@ts-ignore - value shouldn't be null but is possible by react-form-hooks
              <WBTelInput
                {...field}
                variant="standard"
                helperText={
                  fieldState.invalid ? t('invalidPhone', { ns: 'common' }) : ''
                }
                error={fieldState.invalid}
                focusOnSelectCountry
                defaultCountry="AU"
                label={''}
                margin="dense"
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ width: '100%', px: [2, 10] }}>
          <WBButton
            autoFocus
            variant="outlined"
            onClick={handleCancel}
            fullWidth
            type="button"
          >
            {t('cancel', { ns: 'common' })}
          </WBButton>
          <WBButton type="submit" loading={loading} fullWidth>
            {t('add', { ns: 'common' })}
          </WBButton>
        </DialogActions>
      </WBForm>
    </SimpleDrawDlg>
  );
}
export default SMSNumberModal;
