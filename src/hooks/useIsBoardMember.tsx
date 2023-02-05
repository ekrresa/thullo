import { useUserProfile } from './user';

export function useIsBoardMember(ownerId: string, members: string[]) {
  const loggedInUser = useUserProfile();

  if (!loggedInUser.data?.id) return false;

  const isMemberOfTheBoard =
    loggedInUser.data.id === ownerId || members.includes(loggedInUser.data.id);

  return isMemberOfTheBoard;
}
