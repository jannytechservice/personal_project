import {
  AutocompleteResult,
  autocompleteResultsByType,
  AutocompleteType,
  Task,
  TaskDirection,
  TaskType,
} from '@admiin-com/ds-graphql';
import { gql, useLazyQuery } from '@apollo/client';
import React from 'react';
import { getName } from '../../helpers/contacts';
import { AnnotationDocument } from '../../helpers/tasks';

export const GET_AUTO_COMPLETE = `
  query GetAutoComplete(
    $id: ID!
  ){
    getAutoComplete(id: $id){
      contact {
        id
        firstName
        lastName
        companyName
        searchName
        contactType
        entityId
        email
      }
      entity {
        id
        name
        legalName
        searchName
        logo {
          alt
          identityId
          type
        }
        gstRegistered
        verificationStatus
      }
    }
  }
`;

export const useTaskToContactName = (task: Task | null) => {
  const [contactLoading, setContactLoading] = React.useState(false);
  const [contactName, setContactName] = React.useState<string | null>(null);
  const getTaskToName = useTaskToName();
  React.useEffect(() => {
    if (task?.contactId) {
      setContactLoading(true);
      getTaskToName(task?.contactId).then((data) => {
        setContactName(data.name ?? '');
        setContactLoading(false);
      });
    } else if (task?.type === TaskType.SIGN_ONLY) {
      const annotations = task?.annotations;
      if (typeof annotations === 'string') {
        try {
          const annotationsObj = JSON.parse(annotations) as AnnotationDocument;
          const names: string[] = [];
          const parsedAnnotations = annotationsObj.annotations;

          if (task?.direction === TaskDirection.SENDING) {
            for (const annotation of parsedAnnotations) {
              if (
                (annotation?.customData?.signerType === 'CONTACT' ||
                  annotation?.customData?.signerType === 'GUEST') &&
                annotation?.customData.type === 'SIGNATURE' &&
                annotation?.customData.name &&
                !names.includes(annotation?.customData?.name as string)
              ) {
                names.push(annotation?.customData?.name as string);
              }
            }

            setContactName(names.join(', '));
          }

          // RECEIVING
          else {
            if (task?.fromId) {
              getTaskToName(task.fromId).then((data) => {
                setContactName(data.name ?? '');
                setContactLoading(false);
              });
            } else {
              setContactLoading(false);
            }
          }
        } catch (err) {
          console.error('Error parsing annotations:', err);
        }
      }
      setContactLoading(false);
    } else {
      setContactName(null);
      setContactLoading(false);
    }
  }, [task]);
  return { contactName, contactLoading };
};

export const useTaskToName = () => {
  const [getAutoComplete] = useLazyQuery(gql(GET_AUTO_COMPLETE), {
    nextFetchPolicy: 'cache-first',
    returnPartialData: true,
  });
  const [getAutoCompletes] = useLazyQuery(gql(autocompleteResultsByType), {
    variables: {
      type: AutocompleteType.ENTITY,
      searchName: '',
    },
    nextFetchPolicy: 'cache-first',
    returnPartialData: true,
  });
  const getTaskToName = React.useCallback(
    async (
      id: string | null | undefined,
      inAutoCompletes: boolean | undefined = false
    ) => {
      if (id) {
        try {
          if (inAutoCompletes) {
            const { data: autoCompleteResultsData } = await getAutoCompletes();
            const autoCompleteResults =
              autoCompleteResultsData?.autocompleteResultsByType?.items ?? [];
            const autoCompleteResult = autoCompleteResults.find(
              (item: AutocompleteResult) => item.id === id
            );
            if (autoCompleteResult) return { data: autoCompleteResult };
          }

          const data = await getAutoComplete({
            variables: { id },
          });
          const contactData = data?.data;
          const contact =
            contactData?.getAutoComplete?.contact ||
            contactData?.getAutoComplete?.entity;
          return { data: contact, name: getName(contact) ?? '' };
        } catch (e: any) {
          console.error('Error reading cache:', e);
          throw new Error(e);
        }
      } else {
        return { name: '', data: null };
      }
    },
    []
  );
  return getTaskToName;
};
