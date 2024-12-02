import { Task, TaskGuest } from '@admiin-com/ds-graphql';
import { WBDialog, WBFlex, WBIconButton } from '@admiin-com/ds-web';
import { useRef } from 'react';
import { useDocumentUrl } from '../../hooks/useDocumentUrl/useDocumentUrl';
import PdfViewer from '../PdfViewer/PdfViewer';

/* eslint-disable-next-line */
export interface PdfViewModalProps {
  open: boolean;
  onClose: () => void;
  task: TaskGuest | null | undefined | Task;
  annotations?: any;
}

export function PdfViewModal({
  open,
  annotations,
  onClose,
  task,
}: PdfViewModalProps) {
  const documentUrl = useDocumentUrl(task);
  const pdfSignatureRef = useRef(null);
  const updatingAnnotions = annotations ?? task?.annotations;
  return (
    <WBDialog
      open={open}
      maxWidth={'sm'}
      fullWidth
      sx={{ '& .MuiPaper-root': { overflow: 'visible' } }}
    >
      <WBFlex
        flexDirection={'row'}
        height={'70vh'}
        overflow={'visible'}
        position={'relative'}
      >
        {task && (
          <WBFlex flex={1}>
            {documentUrl && task.documents?.[0]?.key ? (
              <PdfViewer
                ref={pdfSignatureRef ?? null}
                annotations={updatingAnnotions}
                documentUrl={documentUrl}
              />
            ) : null}
          </WBFlex>
        )}
        <WBIconButton
          aria-label="close"
          icon="Close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          sx={{
            position: 'absolute',
            right: -40,
            top: -40,
            color: (theme) => theme.palette.grey[500],
          }}
        />
      </WBFlex>
    </WBDialog>
  );
}

export default PdfViewModal;
