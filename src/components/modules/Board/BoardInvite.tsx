import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BiPlus, BiSearch } from 'react-icons/bi';

export function BoardInvite() {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="px-1 py-1 rounded-lg bg-corn-blue">
        <BiPlus className="text-2xl" color="#fff" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-20 px-3 py-2 mt-2 origin-top-right bg-white border shadow-lg font-poppins rounded-xl border-ash ">
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray4">Invite to Board</h3>
            <p className="text-sm font-light text-gray3 whitespace-nowrap">
              Search users you want to invite to
            </p>
          </div>

          <form className="flex flex-1 p-[2px] mb-4 rounded-lg shadow-md">
            <input
              className="flex-1 px-3 text-sm text-gray-600 focus:outline-none"
              placeholder="User..."
            />
            <button
              className="px-3 py-[0.67rem] text-xs text-white rounded-lg bg-corn-blue"
              type="submit"
            >
              <BiSearch className="text-xl" />
            </button>
          </form>

          <div className="shadow-md"></div>

          <button className="block px-6 py-2 m-auto text-sm text-white rounded-lg bg-corn-blue">
            Invite
          </button>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
