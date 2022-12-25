import * as React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { IoMdGlobe, IoMdLock } from 'react-icons/io';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { BoardUpdate, updateBoard } from '@lib/api/board';
import { boardsQueryKeys } from '@hooks/board';
import { useIsBoardMember } from '@hooks/useIsBoardMember';

interface VisibilitySwitchProps {
  visibility: 'public' | 'private';
  boardId: number;
  boardOwner: string;
  members: string[];
}

export function VisibilitySwitch({
  boardOwner,
  boardId,
  members,
  visibility,
}: VisibilitySwitchProps) {
  const queryClient = useQueryClient();
  const isBoardMember = useIsBoardMember(boardOwner, members);
  const { mutate } = useMutation((data: Partial<BoardUpdate>) =>
    updateBoard(data, boardId)
  );

  const handleVisibilityChange = (val: 'public' | 'private') => {
    mutate(
      { visibility: val },
      {
        onError: (error: any) => {
          toast.error(error.message);
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries(boardsQueryKeys.board(boardId));
          toast.success(`Board is ${val}`);
        },
      }
    );
  };

  return (
    <Listbox
      value={visibility}
      onChange={val => handleVisibilityChange(val)}
      disabled={!isBoardMember}
    >
      <div className="relative">
        <Listbox.Button
          className={`relative w-full cursor-pointer rounded-lg bg-off-white px-4 py-2 text-gray3 sm:text-sm ${
            !isBoardMember && 'cursor-not-allowed'
          }`}
        >
          <span className="flex items-center capitalize">
            {visibility === 'private' ? (
              <IoMdLock className="mr-2" />
            ) : (
              <IoMdGlobe className="mr-2" />
            )}
            {visibility}
          </span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-40 mt-2 overflow-auto rounded-lg bg-white p-4 shadow-lg focus:outline-none sm:text-sm">
            <div className="mb-4">
              <h3 className="mb-1 text-[1.025rem] font-medium text-gray4">Visibility</h3>
              <p className="whitespace-nowrap text-xs font-light text-gray3">
                Choose who can see this board.
              </p>
            </div>

            <Listbox.Option value="public">
              <div className="cursor-pointer rounded-lg p-4 hover:bg-off-white">
                <div className="flex items-center">
                  <IoMdGlobe className="mr-2" />
                  <span className="font-medium text-gray4">Public</span>
                </div>
                <p className="whitespace-nowrap text-xs font-light text-gray3">
                  Anyone on the internet can see this.
                </p>
              </div>
            </Listbox.Option>
            <Listbox.Option value="private">
              <div className="cursor-pointer rounded-lg p-4 hover:bg-off-white">
                <div className="flex items-center">
                  <IoMdLock className="mr-2" />
                  <span className="font-medium text-gray4">Private</span>
                </div>
                <p className="whitespace-nowrap text-xs font-light text-gray3">
                  Only board members can see this.
                </p>
              </div>
            </Listbox.Option>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
