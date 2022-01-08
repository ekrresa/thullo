import * as React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { IoMdGlobe, IoMdLock } from 'react-icons/io';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

import { BoardUpdate, updateBoard } from '@lib/api/board';
import { boardsQueryKeys } from '@hooks/board';

interface VisibilitySwitchProps {
  visibility: 'public' | 'private';
  boardId: number;
}

export function VisibilitySwitch({ boardId, visibility }: VisibilitySwitchProps) {
  const queryClient = useQueryClient();
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
        },
      }
    );
  };

  return (
    <Listbox value={visibility} onChange={val => handleVisibilityChange(val)}>
      <div className="relative">
        <Listbox.Button className="relative w-full px-4 py-2 rounded-lg cursor-pointer bg-off-white sm:text-sm text-gray3">
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
          <Listbox.Options className="absolute p-4 mt-2 overflow-auto bg-white rounded-lg shadow-lg focus:outline-none sm:text-sm">
            <div className="mb-4">
              <h3 className="font-medium mb-1 text-[1.025rem] text-gray4">Visibility</h3>
              <p className="text-xs font-light text-gray3 whitespace-nowrap">
                Choose who can see this board.
              </p>
            </div>

            <Listbox.Option value="public">
              <div className="p-4 rounded-lg cursor-pointer hover:bg-off-white">
                <div className="flex items-center">
                  <IoMdGlobe className="mr-2" />
                  <span className="font-medium text-gray4">Public</span>
                </div>
                <p className="text-xs font-light text-gray3 whitespace-nowrap">
                  Anyone on the internet can see this.
                </p>
              </div>
            </Listbox.Option>
            <Listbox.Option value="private">
              <div className="p-4 rounded-lg cursor-pointer hover:bg-off-white">
                <div className="flex items-center">
                  <IoMdLock className="mr-2" />
                  <span className="font-medium text-gray4">Private</span>
                </div>
                <p className="text-xs font-light text-gray3 whitespace-nowrap">
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
