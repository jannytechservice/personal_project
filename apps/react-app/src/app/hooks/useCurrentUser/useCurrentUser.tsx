import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { CSGetSub as GET_SUB, User, getUser } from '@admiin-com/ds-graphql';
import { useUserEntities } from '../useUserEntities/useUserEntities';

export function useCurrentUser() {
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;

  const { data: userData } = useQuery(gql(getUser), {
    variables: {
      id: userId,
    },
    skip: !userId,
  });
  const user: User = useMemo(() => userData?.getUser || {}, [userData]);

  return user;
}
export function useUserId() {
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;
  return userId;
}
export function useOwnerPermission() {
  const userId = useUserId();
  const { users } = useUserEntities();
  const isOwner = users.some(
    (user) => user.userId === userId && user.role === 'OWNER'
  );
  return isOwner;
}
