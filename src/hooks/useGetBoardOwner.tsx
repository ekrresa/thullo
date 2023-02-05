import { BoardWithMembers } from '@models/board'

export function useGetBoardOwner(board: BoardWithMembers) {
  return board.members.find(member => member.isOwner)?.member
}
