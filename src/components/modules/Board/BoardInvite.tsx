import * as React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BiPlus } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import differenceBy from 'lodash.differenceby';

import { useFetchUsers, useUserProfile } from '@hooks/user';
import { updateBoard } from '@lib/api/board';
import { Button } from '@components/common/Button';
import { Board, UserProfile } from '@models/database';
import { boardsQueryKeys } from '@hooks/board';

interface BoardInviteProps {
  board: Board;
  members: UserProfile[];
}

export function BoardInvite({ board, members }: BoardInviteProps) {
  const queryClient = useQueryClient();
  const [userIds, setUserIds] = React.useState<string[]>([]);
  const loggedInUser = useUserProfile();
  const allUsers = useFetchUsers(loggedInUser.data?.id);
  const inviteUserMutation = useMutation((data: { members: string[] }) =>
    updateBoard(data, board.id)
  );

  const nonMembers = React.useMemo(() => {
    return differenceBy(allUsers.data, members, 'id').filter(user => Boolean(user.name));
  }, [allUsers.data, members]);

  const handleInvite = () => {
    const newMembersIds = members.map(user => user.id).concat(userIds);
    inviteUserMutation.mutate(
      { members: newMembersIds },
      {
        onSuccess: data => {
          toast.success('users joined successfully');
          queryClient.setQueryData<Board | undefined>(
            boardsQueryKeys.board(board.id),
            oldData => {
              if (oldData) {
                //TODO: re-add members back
                return { ...oldData };
              }
            }
          );
        },
      }
    );
  };

  //TODO: Please check this later
  React.useEffect(() => {
    (async function () {
      await queryClient.invalidateQueries(
        boardsQueryKeys.boardMembers(board.id, members.length)
      );
    })();
  }, [board.id, members.length, queryClient]);

  const handleChecked = (checked: boolean, userId: string) => {
    if (checked) {
      setUserIds(userIds.concat(userId));
    } else {
      setUserIds(userIds.filter(id => id !== userId));
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="grid h-9 w-9 place-items-center rounded-xl bg-corn-blue">
        <BiPlus className="text-2xl" color="#fff" />
      </Menu.Button>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-20 mt-2 origin-top-right rounded-xl border border-ash bg-white px-3 py-2 shadow-lg ">
          <div className="mb-8">
            <h3 className="text-base text-gray4">Invite to Board</h3>
            <p className="whitespace-nowrap text-sm font-light text-gray3">
              Search users you want to invite to
            </p>
          </div>

          {/* <form className="flex flex-1 p-[2px] mb-4 rounded-lg shadow-md">
            <input
              className="flex-1 px-3 text-sm text-gray-500 focus:outline-none placeholder:text-gray-400"
              placeholder="User..."
            />
            <button
              className="px-3 py-2 text-xs text-white rounded-lg bg-corn-blue"
              type="submit"
            >
              <BiSearch className="text-xl" />
            </button>
          </form> */}

          {allUsers.isSuccess && (
            <div className="mb-6 h-36 overflow-y-auto rounded-lg border border-ash text-[0.85rem] drop-shadow">
              {nonMembers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center px-4 capitalize hover:bg-gray-100"
                >
                  <input
                    id={user.id}
                    type="checkbox"
                    className="mr-4 accent-corn-blue default:ring-2"
                    onChange={e => handleChecked(e.currentTarget.checked, user.id)}
                  />
                  <label className="flex-1 cursor-pointer py-[0.65rem]" htmlFor={user.id}>
                    {user.name}
                  </label>
                </div>
              ))}
            </div>
          )}

          <Button
            className="m-auto block rounded-lg bg-corn-blue px-6 py-2 text-sm text-white"
            onClick={handleInvite}
            disabled={inviteUserMutation.isLoading}
            loading={inviteUserMutation.isLoading}
          >
            Invite
          </Button>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
