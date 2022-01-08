import * as React from 'react';
import { format } from 'date-fns';
import { FaPen } from 'react-icons/fa';
import Image from 'next/image';
import { IoClose, IoEllipsisHorizontalSharp, IoPersonCircle } from 'react-icons/io5';
import { MdStickyNote2 } from 'react-icons/md';
import useOnClickOutside from 'use-onclickoutside';

import { useLockBodyScroll } from '@hooks/useLockBodyScroll';
import { Board } from 'types/database';
import { getCloudinaryUrl, getInitials } from '@lib/utils';

interface SideMenuProps {
  board: Board;
}

export function SideMenu({ board }: SideMenuProps) {
  const sideMenuRef = React.useRef(null);
  const [openSideMenu, toggleSideMenu] = React.useState(false);

  useOnClickOutside(sideMenuRef, () => toggleSideMenu(false));
  useLockBodyScroll({ mounted: openSideMenu });

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
        className={`absolute right-0 top-0 bg-white w-full max-w-md h-full p-6 shadow-lg transition duration-500 ease-in-out overflow-y-auto ${
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
          <div className="relative w-10 overflow-hidden rounded-lg">
            {board.owner.image_id ? (
              <Image
                src={getCloudinaryUrl(
                  board.owner.image_id as string,
                  board.owner.image_version as string
                )}
                layout="fill"
                alt=""
              />
            ) : (
              <div className="w-full h-full">{getInitials(board.owner.name)}</div>
            )}
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

          <button className="flex items-center px-2 py-1 ml-auto border border-gray-400 rounded-xl">
            <FaPen className="text-sm" color="#828282" />
            <span className="ml-2 text-sm text-gray-400">Edit</span>
          </button>
        </div>

        <div className="mt-6">
          Simple board to start on a project. Each list can hold items (cards) that
          represent ideas or tasks. There 4 lists here: * Backlog 🤔 : Ideas are created
          here. Here people can describe the idea following three simple questions: Why
          you wish to do it, What it is, how can you do it. * In Progress📚: Once the
          ideas is clearly defined, the task can move to #todo stage. Here the owner of
          the idea can move to #doing once s/he is ready. He can also wait a bit for other
          members to join. * In Review ⚙️: On-going * Completed 🙌🏽**: Finished You could
          add other lists like labels holding labels (with colors) in order to tag each
          card by a label if you wish.
        </div>

        <div className="flex items-center mt-8 text-light-pencil">
          <MdStickyNote2 className="text-xl" />
          <span className="ml-2 text-gray-400">Team</span>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl">
                {board.owner.image_id ? (
                  <Image
                    src={getCloudinaryUrl(
                      board.owner.image_id as string,
                      board.owner.image_version as string
                    )}
                    layout="fill"
                    alt=""
                  />
                ) : (
                  <div className="w-full h-full">{getInitials(board.owner.name)}</div>
                )}
              </div>
              <div className="ml-4 text-sm font-medium text-pencil">
                {board.owner.name}
              </div>
            </div>
            <div className="text-[0.8rem] text-gray-400">Admin</div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <div className="h-10 bg-corn-blue w-11 rounded-xl"></div>
              <div className="ml-4 text-sm font-medium text-pencil">Daniel Jensen</div>
            </div>

            <button className="border border-alt-red-100 rounded-lg px-3 py-[0.3rem] text-[0.7rem] text-alt-red-100">
              Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
