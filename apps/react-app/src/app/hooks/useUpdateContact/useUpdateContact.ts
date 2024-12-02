import { updateContact as UPDATE_CONTACT } from '@admiin-com/ds-graphql';
import { gql, useMutation } from '@apollo/client';
import { MutationTuple, OperationVariables } from '@apollo/client';

type UpdateContactMutationTuple = MutationTuple<any, OperationVariables>;

export function useUpdateContact(): [
  UpdateContactMutationTuple[0],
  { error: UpdateContactMutationTuple[1]['error'] }
] {
  const [updateContact, { error }] = useMutation(gql(UPDATE_CONTACT), {});

  return [updateContact, { error }];
}
