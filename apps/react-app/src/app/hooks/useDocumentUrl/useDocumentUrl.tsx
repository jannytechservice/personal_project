import { gql, useMutation } from '@apollo/client';
import React from 'react';
import {
  createTaskDocumentUrl as CREATE_TASK_DOCUMENT_URL,
  createTaskDocumentUrlGuest as CREATE_TASK_DOCUMENT_URL_GUEST,
  Task,
  TaskGuest,
} from '@admiin-com/ds-graphql';
import { useClientContext } from '../../components/ApolloClientProvider/ApolloClientProvider';
export const useDocumentUrl = (task?: Task | TaskGuest | null) => {
  const { clientType } = useClientContext();
  const isGuest = clientType === 'iam';
  const [createTaskDocumentUrl] = useMutation(gql(CREATE_TASK_DOCUMENT_URL));
  const [createTaskDocumentUrlGuest] = useMutation(
    gql(CREATE_TASK_DOCUMENT_URL_GUEST)
  );
  const [documentUrl, setDocumentUrl] = React.useState<string>('');

  React.useEffect(() => {
    const fetchDocumentUrl = async () => {
      if (task?.documents?.[0]?.key) {
        try {
          setDocumentUrl('');
          const getTaskDocumentUrl = !isGuest
            ? createTaskDocumentUrl
            : createTaskDocumentUrlGuest;
          const documentUrlData = await getTaskDocumentUrl({
            variables: {
              input: {
                taskId: task.id,
                entityId: task.entityId,
              },
            },
          });
          setDocumentUrl(
            isGuest
              ? documentUrlData?.data?.createTaskDocumentUrlGuest?.url
              : documentUrlData?.data?.createTaskDocumentUrl?.url
          );
        } catch (err) {
          console.log('ERROR CREATING DOCUMENT URL', err);
        }
      } else setDocumentUrl('');
    };

    fetchDocumentUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTaskDocumentUrl, task?.documents?.[0]?.key]);
  return documentUrl;
};
