import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import {
  IoClose,
  IoEllipsisHorizontalSharp,
  IoMenu,
  IoPencil,
  IoPersonCircle,
} from 'react-icons/io5'
import { MdStickyNote2 } from 'react-icons/md'

import { boardsQueryKeys } from '@hooks/board'
import { useGetBoardOwner } from '@hooks/useGetBoardOwner'
import { useIsBoardMember } from '@hooks/useIsBoardMember'
import { useProfileStore } from '@stores/profile'
import { Avatar } from '@components/Avatar'
import { Button } from '@components/common/Button'
import { IsOwner } from '@components/common/IsOwner'
import { TextArea } from '@components/common/TextArea'
import { BoardWithMembers } from '@models/index'
import { useUpdateBoard } from '../hooks'
import SideMenuDrawer from './SideMenuDrawer'

interface SideMenuProps {
  board: BoardWithMembers
}
export function SideMenu({ board }: SideMenuProps) {
  const sideMenuRef = React.useRef(null)
  const userProfile = useProfileStore(state => state.info)
  const queryClient = useQueryClient()
  const isBoardMember = useIsBoardMember(board.members.map(member => member.memberId))

  const boardOwner = useGetBoardOwner(board)

  const [isEditing, setIsEditing] = React.useState(false)
  const [description, setDescription] = React.useState('')

  const descriptionMutation = useUpdateBoard(boardOwner?.username ?? '', board.slug)

  const removeMemberMutation = useUpdateBoard(boardOwner?.username ?? '', board.slug)

  // React.useEffect(() => {
  //   ;(async function () {
  //     await queryClient.invalidateQueries(
  //       boardsQueryKeys.boardMembers(board.id, members.length)
  //     )
  //   })()
  // }, [board.id, members.length, queryClient])

  // const handleDescription = () => {
  //   descriptionMutation.updateBoard(
  //     { description },
  //     {
  //       onSuccess: async () => {
  //         setIsEditing(false)
  //       },
  //     }
  //   )
  // }

  // const removeMember = (userId: string) => {
  //   const currentMembers = members.filter(user => user.id !== userId).map(user => user.id)

  //   removeMemberMutation.updateBoard(
  //     { members: currentMembers },
  //     {
  //       onSuccess: () => {
  //         const user = members.find(user => user.id === userId)
  //         toast.success(user?.name + ' was removed')
  //       },
  //     }
  //   )
  // }

  return (
    <SideMenuDrawer>
      <div className="flex items-center justify-between border-b pb-2">
        <h4 className="font-medium text-slate-600">{board.title}</h4>
      </div>

      <div className="flex items-center pt-2 text-slate-400">
        <IoPersonCircle className="text-lg" />
        <span className="ml-2 text-xs font-medium">Created by</span>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <Avatar image={boardOwner?.image ?? ''} name={boardOwner?.name ?? ''} />

        <div className="">
          <h4 className="mb-1 text-left text-sm font-medium text-slate-500">
            {boardOwner?.name}
          </h4>
          <p className="text-xs text-slate-400">
            on {format(new Date(board.createdAt), 'd MMMM, yyyy')}
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center text-slate-400">
        <MdStickyNote2 className="text-xl" />
        <p className="ml-2 text-xs font-medium">Description</p>

        {isBoardMember && (
          <button
            className="ml-auto flex items-center rounded-xl border border-gray-400 px-2 py-1"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <IoClose />
                <span className="ml-2 text-xs text-gray-400">Cancel</span>
              </>
            ) : board.description ? (
              <>
                <IoPencil />
                <span className="ml-2 text-xs text-gray-400">Edit</span>
              </>
            ) : (
              <>
                <IoPencil />
                <span className="ml-2 text-xs text-gray-400">Add</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* <div className="mt-6">
          {isEditing ? (
            <>
              <div className="rounded-lg border p-4 text-sm">
                <TextArea
                  content={board.description}
                  onChange={val => setDescription(val)}
                />
              </div>
              <Button
                className="mt-2 w-full items-stretch justify-center rounded-lg bg-corn-blue px-4 py-3 text-sm text-white"
                onClick={handleDescription}
                loading={descriptionMutation.updatingBoard}
              >
                Submit
              </Button>
            </>
          ) : board.description ? (
            <div
              className="prose-sm rounded-lg border p-4 prose-p:my-1"
              dangerouslySetInnerHTML={{ __html: board.description }}
            ></div>
          ) : (
            <p className="text-sm italic text-gray-400">No board description yet.</p>
          )}
        </div> */}

      <div className="mt-8 flex items-center text-slate-400">
        <MdStickyNote2 className="text-xl" />
        <span className="ml-2 text-xs font-medium">Team</span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar image={boardOwner?.image ?? ''} name={boardOwner?.name ?? ''} />
            <div className="text-sm font-medium text-slate-500">{boardOwner?.name}</div>
          </div>

          <div className="text-xs text-gray-400">Admin</div>
        </div>

        {/* {members.length > 0 &&
            members.map(member => (
              <div key={member.id} className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 overflow-hidden rounded-xl">
                    <Avatar image={member.image_id} name={member.name} />
                  </div>
                  <div className="ml-4 text-sm font-medium capitalize text-pencil">
                    {member.name}
                  </div>
                </div>

                <IsOwner
                  isOwner={boardOwner?.id === loggedInUser.data?.id}
                  fallback={<p className="text-[0.8rem] italic text-gray-400">Member</p>}
                >
                  <Button
                    className="rounded-lg border border-alt-red-100 px-3 py-[0.3rem] text-[0.7rem] text-alt-red-100"
                    // onClick={() => removeMember(member.id)}
                    disabled={removeMemberMutation.updatingBoard}
                  >
                    Remove
                  </Button>
                </IsOwner>
              </div>
            ))} */}
      </div>

      <IsOwner isOwner={boardOwner?.id === userProfile?.id}>
        <div className="mt-8">
          <Button
            className="rounded-lg bg-roman-100 px-4 py-2 text-roman-500 shadow shadow-roman-200 ring-1 ring-black/5 hover:bg-roman-400 hover:text-white"
            variant="plain"
          >
            Delete Board
          </Button>
        </div>
      </IsOwner>
    </SideMenuDrawer>
  )
}
