import { LineItem } from '@admiin-com/ds-graphql';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { WBBox, WBButton, WBDialog, WBForm } from '@admiin-com/ds-web';
import { useForm, useFormContext } from 'react-hook-form';
import LineItemsCreateForm from './LineItemCreateForm';
import { LineItemForm } from '.';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (lineItem: LineItemForm) => void;
  id: string | undefined;
}
export default function LineItemsCreateModal(props: Props) {
  const { t } = useTranslation();
  const { handleSubmit } = useFormContext();
  const handleAdd = (data: any) => {
    props.onAdd({
      ...data,
      description: data?.description?.description,
    });
  };
  return (
    <WBDialog fullScreen onClose={props.onClose} open={props.open}>
      <WBForm onSubmit={handleSubmit(handleAdd)} mt={0}>
        <DialogTitle textAlign={'center'} variant="h5">
          {props.id
            ? t('itemTitle', { ns: 'taskbox', id: props.id })
            : t('newItem', { ns: 'taskbox' })}
        </DialogTitle>
        <DialogContent dividers>
          <LineItemsCreateForm />
        </DialogContent>
        <DialogActions>
          <WBBox width="100%">
            <WBButton
              variant="outlined"
              type="button"
              onClick={props.onClose}
              sx={{ mt: 1 }}
              fullWidth
            >
              {t('cancel', { ns: 'taskbox' })}
            </WBButton>
            <WBButton type="submit" sx={{ mt: 1 }} fullWidth>
              {props.id
                ? t('save', { ns: 'taskbox' })
                : t('addItem', { ns: 'taskbox' })}
            </WBButton>
          </WBBox>
        </DialogActions>
      </WBForm>
    </WBDialog>
  );
}
