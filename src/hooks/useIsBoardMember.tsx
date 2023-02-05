import { useUserProfile } from './user'

export function useIsBoardMember(members: string[]) {
  const loggedInUser = useUserProfile()

  if (!loggedInUser.data?.id) return false

  const isMemberOfTheBoard = members.includes(loggedInUser.data.id)

  return isMemberOfTheBoard
}
