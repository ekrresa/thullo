import * as React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BiPlus, BiSearch } from 'react-icons/bi'

import { Input } from '@components/Input'
import { Button } from '@components/common/Button'
import { BoardWithMembers } from '@models/board'

interface Props {
  board: BoardWithMembers
}
export function BoardInvite(props: Props) {
  const { board } = props

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="grid h-8 w-8 place-items-center rounded-full bg-brand-500">
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
        <Menu.Items className="absolute left-1/2 z-20 mt-2 origin-top-right -translate-x-1/2 rounded-xl border border-ash bg-white p-4 shadow-lg ">
          <div className="mb-6">
            <h3 className="mb-1 font-semibold text-slate-600">Invite users</h3>
            <p className="whitespace-nowrap text-xs text-slate-500">
              Search users you want to invite to
            </p>
          </div>

          <form className="mb-4 flex flex-1 rounded-lg border border-slate-300 p-[2px] focus-within:ring-1  focus-within:ring-brand-500 focus-within:ring-offset-1 focus:outline-none">
            <Input
              label="User"
              className="flex-1 border-none text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              placeholder="User..."
              labelHidden
            />
            <Button
              className="rounded-lg px-3 py-2 text-xs text-white"
              type="submit"
              variant="primary"
            >
              <BiSearch className="text-xl" />
            </Button>
          </form>

          {/* {allUsers.isSuccess && (
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
          )} */}

          <Button className="w-full rounded-lg px-6 py-2" variant="primary">
            Invite
          </Button>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
