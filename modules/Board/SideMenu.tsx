import React from 'react';
import { FaPen } from 'react-icons/fa';
import { IoClose, IoPersonCircle } from 'react-icons/io5';
import { MdStickyNote2 } from 'react-icons/md';
import useOnClickOutside from 'use-onclickoutside';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

interface SideMenuProps {
  open: boolean;
  closeSideMenu: () => void;
}

export function SideMenu({ open, closeSideMenu }: SideMenuProps) {
  const sideMenuRef = React.useRef(null);

  useOnClickOutside(sideMenuRef, closeSideMenu);
  useLockBodyScroll({ mounted: open });

  return (
    <div
      className={`absolute right-0 top-0 bg-white w-full max-w-md h-full p-6 font-poppins shadow-lg transition duration-500 ease-in-out overflow-y-auto ${
        open ? 'opacity-100 translate-x-0' : ' opacity-0 translate-x-full'
      }`}
      ref={sideMenuRef}
    >
      <div className="flex items-center justify-between pb-2 border-b border-ash">
        <h4 className="text-sm font-semibold text-pencil">DevChallenges Board</h4>

        <button className="p-1 border-0" onClick={closeSideMenu}>
          <IoClose className="text-xl" color="#4F4F4F" />
        </button>
      </div>

      <div className="flex items-center py-2 text-light-pencil">
        <IoPersonCircle className="text-base" />
        <span className="ml-2 text-xs font-medium">Made by</span>
      </div>

      <div className="flex mt-3">
        <div className="w-10 rounded-lg bg-corn-blue"></div>
        <div className="ml-4">
          <div className="mb-1 text-sm font-medium text-pencil">Daniel Jensen</div>
          <div className="text-xs font-medium text-light-pencil">on 4 July, 2020</div>
        </div>
      </div>

      <div className="flex items-center mt-6 text-light-pencil">
        <MdStickyNote2 className="text-xl" />
        <span className="ml-2 font-medium">Description</span>

        <button className="flex items-center px-4 py-2 ml-8 border-2 border-light-pencil rounded-2xl">
          <FaPen color="#828282" />
          <span className="ml-4 text-sm text-gray3">Edit</span>
        </button>
      </div>

      <div className="mt-6">
        Simple board to start on a project. Each list can hold items (cards) that
        represent ideas or tasks. There 4 lists here: * Backlog 🤔 : Ideas are created
        here. Here people can describe the idea following three simple questions: Why you
        wish to do it, What it is, how can you do it. * In Progress📚: Once the ideas is
        clearly defined, the task can move to #todo stage. Here the owner of the idea can
        move to #doing once s/he is ready. He can also wait a bit for other members to
        join. * In Review ⚙️: On-going * Completed 🙌🏽**: Finished You could add other
        lists like labels holding labels (with colors) in order to tag each card by a
        label if you wish.
      </div>

      <div className="flex items-center mt-4 text-light-pencil">
        <MdStickyNote2 className="text-xl" />
        <span className="ml-2 text-sm font-medium">Team</span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 bg-corn-blue w-11 rounded-xl"></div>
            <div className="ml-4 text-sm font-medium text-pencil">Daniel Jensen</div>
          </div>
          <div className="text-xs text-light-pencil">Admin</div>
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
  );
}
