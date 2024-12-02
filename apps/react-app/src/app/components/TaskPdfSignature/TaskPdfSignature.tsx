import { Task, TaskGuest } from '@admiin-com/ds-graphql';

import { WBFlex } from '@admiin-com/ds-web';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import PdfViewer from '../PdfViewer/PdfViewer';
import { useDocumentUrl } from '../../hooks/useDocumentUrl/useDocumentUrl';

/* eslint-disable-next-line */
export interface TaskPdfSignatureProps {
  task: Task | TaskGuest | null;
}

export function TaskPdfSignature({ task }: TaskPdfSignatureProps) {
  const context = useTaskBoxContext();
  const { pdfSignatureRef } = context ?? {};

  const documentUrl = useDocumentUrl(task);
  return (
    <WBFlex flex={1} sx={{ height: '100%' }}>
      {documentUrl && task && task.documents?.[0]?.key ? (
        <PdfViewer
          ref={pdfSignatureRef ?? null}
          annotations={task.annotations ?? ''}
          documentUrl={documentUrl}
        />
      ) : null}
    </WBFlex>
  );
}

export default TaskPdfSignature;
