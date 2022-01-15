import * as React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useMutation, useQueryClient } from 'react-query';
import { BiPlus } from 'react-icons/bi';
import differenceBy from 'lodash.differenceby';

import { useFetchUsers, useUserProfile } from '@hooks/user';
import { updateBoard } from '@lib/api/board';
import { Button } from '@components/common/Button';
import { Board, UserProfile } from 'types/database';
import { boardsQueryKeys } from '@hooks/board';
import { toast } from 'react-hot-toast';

interface BoardInviteProps {
  boardId: number;
  members: UserProfile[];
}

export function BoardInvite({ boardId, members }: BoardInviteProps) {
  const queryClient = useQueryClient();
  const [userIds, setUserIds] = React.useState<string[]>([]);
  const loggedInUser = useUserProfile();
  const allUsers = useFetchUsers(loggedInUser.data?.id);
  const inviteUserMutation = useMutation((data: { members: string[] }) =>
    updateBoard(data, boardId)
  );

  const nonMembers = React.useMemo(() => {
    return differenceBy(allUsers.data, members, 'id');
  }, [allUsers.data, members]);

  const handleInvite = () => {
    const newMembersIds = members.map(user => user.id).concat(userIds);
    inviteUserMutation.mutate(
      { members: newMembersIds },
      {
        onSuccess: data => {
          toast.success('users joined successfully');
          queryClient.setQueryData<Board | undefined>(
            boardsQueryKeys.board(boardId),
            oldData => {
              if (oldData) {
                return { ...oldData, members: data.members };
              }
            }
          );
        },
      }
    );
  };

  React.useEffect(() => {
    (async function () {
      await queryClient.invalidateQueries(
        boardsQueryKeys.boardMembers(boardId, members.length),
        {
          refetchInactive: true,
        }
      );
    })();
  }, [boardId, members.length, queryClient]);

  const handleChecked = (checked: boolean, userId: string) => {
    if (checked) {
      setUserIds(userIds.concat(userId));
    } else {
      setUserIds(userIds.filter(id => id !== userId));
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="grid w-9 h-9 rounded-xl place-items-center bg-corn-blue">
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
        <Menu.Items className="absolute left-0 z-20 px-3 py-2 mt-2 origin-top-right bg-white border shadow-lg rounded-xl border-ash ">
          <div className="mb-8">
            <h3 className="text-base text-gray4">Invite to Board</h3>
            <p className="text-sm font-light text-gray3 whitespace-nowrap">
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
            <div className="mb-6 overflow-y-auto text-[0.85rem] border rounded-lg drop-shadow h-36 border-ash">
              {nonMembers.map(user => (
                <div key={user.id} className="flex px-4 capitalize hover:bg-gray-100">
                  <input
                    id={user.id}
                    type="checkbox"
                    className="mr-4 accent-corn-blue default:ring-2"
                    onChange={e => handleChecked(e.currentTarget.checked, user.id)}
                  />
                  <label className="flex-1 py-[0.65rem] cursor-pointer" htmlFor={user.id}>
                    {user.name}
                  </label>
                </div>
              ))}
            </div>
          )}

          <Button
            className="block px-6 py-2 m-auto text-sm text-white rounded-lg bg-corn-blue"
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
