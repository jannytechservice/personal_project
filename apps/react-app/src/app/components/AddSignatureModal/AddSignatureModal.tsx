import SimpleDrawDlg, {
  SimpleDrawDlgProps,
} from '../SimpleDrawDlg/SimpleDrawDlg';
import { DialogTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AddSignatureForm } from './AddSignatureForm';

export interface AddSignatureModalProps
  extends Omit<SimpleDrawDlgProps, 'children'> {
  open: boolean;
  handleClose: () => void;
  handleSave?: (signatureKey?: string | Blob) => void;
  descriptionLabel?: string;
  isGuest?: boolean;
  onApplyToAll?: (checked: boolean) => void;
  applyToAll?: boolean;
  signerName?: string;
}

export function AddSignatureModal({
  open,
  handleClose,
  isGuest,
  handleSave,
  descriptionLabel,
  applyToAll,
  onApplyToAll,
  signerName,
  ...props
}: AddSignatureModalProps) {
  const { t } = useTranslation();

  return (
    <SimpleDrawDlg
      open={open}
      handleClose={handleClose}
      maxWidth="xs"
      fullWidth={true}
      noPadding
      {...props}
    >
      <DialogTitle variant="h3" fontWeight={'bold'} mt={4}>
        {t('signatureRequiredTitle', { ns: 'settings' })}
        <Typography>
          {descriptionLabel ??
            t('signatureRequiredDescription', { ns: 'settings' })}
        </Typography>
      </DialogTitle>
      <AddSignatureForm
        handleSave={(data) => {
          if (handleSave) handleSave(data);
          handleClose();
        }}
        handleClose={handleClose}
        isGuest={isGuest}
        applyToAll={applyToAll}
        onApplyToAll={onApplyToAll}
        signerName={signerName}
      />
    </SimpleDrawDlg>
  );
}

export default AddSignatureModal;
