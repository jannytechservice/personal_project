import { DialogTitle } from '@mui/material';
import SimpleDrawDlg from '../../SimpleDrawDlg/SimpleDrawDlg';
import { useTranslation } from 'react-i18next';

import { Signer } from '../../../pages/TaskCreation/TaskCreation';
import { RecipientAddForm } from './RecipientAddForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onDone: (signers: Signer[]) => void;
}
export const AddRecipientSignModal = (props: Props) => {
  const { t } = useTranslation();

  return (
    props.open && (
      <SimpleDrawDlg
        open={props.open}
        handleClose={props.onClose}
        maxWidth="md"
      >
        <DialogTitle variant="h3">
          {t('addRecipientSignatureTitle', { ns: 'taskbox' })}
        </DialogTitle>
        <RecipientAddForm
          onSubmit={(data) => {
            props.onDone(data);
            props.onClose();
          }}
          onClose={props.onClose}
        />
      </SimpleDrawDlg>
    )
  );
};
