import * as React from 'react';
import { format } from 'date-fns';
import {
  IoClose,
  IoEllipsisHorizontalSharp,
  IoPencil,
  IoPersonCircle,
} from 'react-icons/io5';
import { MdStickyNote2 } from 'react-icons/md';
import { useMutation, useQueryClient } from 'react-query';
import useOnClickOutside from 'use-onclickoutside';
import { toast } from 'react-hot-toast';

import { useLockBodyScroll } from '@hooks/useLockBodyScroll';
import { Board, UserProfile } from 'types/database';
import { Avatar } from '@components/common/Avatar';
import { updateBoard } from '@lib/api/board';
import { Button } from '@components/common/Button';
import { boardsQueryKeys } from '@hooks/board';
import { IsOwner } from '@components/common/IsOwner';
import { useUserProfile } from '@hooks/user';
import { TextArea } from '@components/common/TextArea';

interface SideMenuProps {
  board: Board;
  members: UserProfile[];
}

export function SideMenu({ board, members }: SideMenuProps) {
  const sideMenuRef = React.useRef(null);
  const loggedInUser = useUserProfile();
  const queryClient = useQueryClient();
  const [openSideMenu, toggleSideMenu] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [description, setDescription] = React.useState('');

  const descriptionMutation = useMutation((data: { description: string }) =>
    updateBoard(data, board.id)
  );
  const removeMemberMutation = useMutation((data: { members: string[] }) =>
    updateBoard(data, board.id)
  );

  useOnClickOutside(sideMenuRef, () => toggleSideMenu(false));
  useLockBodyScroll({ mounted: openSideMenu });

  React.useEffect(() => {
    (async function () {
      await queryClient.invalidateQueries(
        boardsQueryKeys.boardMembers(board.id, members.length),
        {
          refetchInactive: true,
        }
      );
    })();
  }, [board.id, members.length, queryClient]);

  const handleDescription = () => {
    descriptionMutation.mutate(
      { description },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(boardsQueryKeys.board(board.id));
          setIsEditing(false);
        },
      }
    );
  };

  const removeMember = (userId: string) => {
    const currentMembers = members
      .filter(user => user.id !== userId)
      .map(user => user.id);

    removeMemberMutation.mutate(
      { members: currentMembers },
      {
        onSuccess: () => {
          const user = members.find(user => user.id === userId);
          toast.success(user?.name + ' was removed');

          queryClient.setQueryData<Board | undefined>(
            boardsQueryKeys.board(board.id),
            oldData => {
              if (oldData) {
                return { ...oldData, members: currentMembers };
              }
            }
          );
        },
      }
    );
  };

  return (
    <>
      <button
        className="flex items-center px-3 py-2 text-sm rounded-lg bg-off-white text-gray3"
        onClick={() => toggleSideMenu(true)}
      >
        <IoEllipsisHorizontalSharp className="mr-2" />
        Show Menu
      </button>
      <div
        className={`absolute right-0 top-0 bg-white w-full max-w-md h-full p-6 shadow-lg transition duration-500 ease-in-out overflow-y-auto z-50 ${
          openSideMenu ? 'opacity-100 translate-x-0' : ' opacity-0 translate-x-full'
        }`}
        ref={sideMenuRef}
      >
        <div className="flex items-center justify-between pb-2 border-b border-ash">
          <h4 className="text-pencil">{board.title}</h4>

          <button className="p-1 border-0" onClick={() => toggleSideMenu(false)}>
            <IoClose className="text-xl" color="#4F4F4F" />
          </button>
        </div>

        <div className="flex items-center py-2 text-light-pencil">
          <IoPersonCircle className="text-lg" />
          <span className="ml-2 text-xs text-gray-400">Opened by</span>
        </div>

        <div className="flex mt-3">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl">
            <Avatar
              imageId={board.owner.image_id}
              imageVersion={board.owner.image_version}
              name={board.owner.name}
            />
          </div>
          <div className="ml-4">
            <div className="mb-1 text-sm font-medium text-pencil">{board.owner.name}</div>
            <div className="text-xs text-gray-400">
              on {format(new Date(board.created_at), 'd MMMM, yyyy')}
            </div>
          </div>
        </div>

        <div className="flex items-center mt-6 text-light-pencil">
          <MdStickyNote2 className="text-xl" />
          <p className="ml-2 text-gray-400">Description</p>

          <button
            className="flex items-center px-2 py-1 ml-auto border border-gray-400 rounded-xl"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <IoClose />
                <span className="ml-2 text-sm text-gray-400">Cancel</span>
              </>
            ) : board.description ? (
              <>
                <IoPencil />
                <span className="ml-2 text-sm text-gray-400">Edit</span>
              </>
            ) : (
              <>
                <IoPencil />
                <span className="ml-2 text-sm text-gray-400">Add</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6">
          {isEditing ? (
            <>
              <div className="p-4 text-sm border rounded-lg">
                <TextArea
                  content={board.description}
                  onChange={val => setDescription(val)}
                />
              </div>
              <Button
                className="items-stretch justify-center w-full px-4 py-3 mt-2 text-sm text-white rounded-lg bg-corn-blue"
                onClick={handleDescription}
                disabled={descriptionMutation.isLoading}
                loading={descriptionMutation.isLoading}
              >
                Submit
              </Button>
            </>
          ) : board.description ? (
            <div
              className="p-4 prose-sm border rounded-lg prose-p:mb-1 prose-p:mt-1"
              dangerouslySetInnerHTML={{ __html: board.description }}
            ></div>
          ) : (
            <p className="text-sm italic text-gray-400">No board description yet.</p>
          )}
        </div>

        <div className="flex items-center mt-8 text-light-pencil">
          <MdStickyNote2 className="text-xl" />
          <span className="ml-2 text-gray-400">Team</span>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl">
                <Avatar
                  imageId={board.owner.image_id}
                  imageVersion={board.owner.image_version}
                  name={board.owner.name}
                />
              </div>
              <div className="ml-4 text-sm font-medium text-pencil">
                {board.owner.name}
              </div>
            </div>
            <div className="text-[0.8rem] text-gray-400">Admin</div>
          </div>

          {members.length > 0 &&
            members.map(member => (
              <div key={member.id} className="flex items-center justify-between mt-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 overflow-hidden rounded-xl">
                    <Avatar
                      imageId={member.image_id}
                      imageVersion={member.image_version}
                      name={member.name}
                    />
                  </div>
                  <div className="ml-4 text-sm font-medium capitalize text-pencil">
                    {member.name}
                  </div>
                </div>

                <IsOwner
                  isOwner={board.owner.id === loggedInUser.data?.id}
                  fallback={<p className="text-[0.8rem] text-gray-400 italic">Member</p>}
                >
                  <Button
                    className="border border-alt-red-100 rounded-lg px-3 py-[0.3rem] text-[0.7rem] text-alt-red-100"
                    onClick={() => removeMember(member.id)}
                    disabled={removeMemberMutation.isLoading}
                  >
                    Remove
                  </Button>
                </IsOwner>
              </div>
            ))}
        </div>

        <IsOwner isOwner={board.owner.id === loggedInUser.data?.id}>
          <div className="mt-8">
            <Button className="px-3 py-2 text-sm border rounded-lg border-alt-red-100 text-alt-red-100">
              Delete Board
            </Button>
          </div>
        </IsOwner>
      </div>
    </>
  );
}
