import * as React from 'react'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import { signOut } from 'next-auth/react'
import { IoPersonCircle } from 'react-icons/io5'

import { useProfileStore } from '@stores/profile'
import { ROUTES } from '@lib/constants'
import { Avatar } from '../Avatar'
import { Button } from '../common/Button'

export function ProfileDropdown() {
  const userProfile = useProfileStore(state => state.info)

  return (
    <Popover className="relative">
      <Popover.Button
        as={Button}
        className="overflow-hidden rounded-full"
        variant="plain"
      >
        <div className="h-9 w-9">
          {userProfile?.image || userProfile?.name ? (
            <Avatar image={userProfile.image} name={userProfile.name} />
          ) : (
            <IoPersonCircle className="h-full w-full" />
          )}
        </div>
      </Popover.Button>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <Popover.Panel className="absolute top-10 left-1/2 z-10 flex min-w-max -translate-x-1/2 flex-col items-center gap-1 overflow-hidden rounded-lg bg-white p-2 shadow-popover ring-1 ring-black/5 md:w-32">
          <Popover.Button
            as={Link}
            href={ROUTES.profile}
            className="block w-full rounded-lg py-2 text-center hover:bg-gray-50"
          >
            Profile
          </Popover.Button>

          <Popover.Button
            as={Button}
            className="w-full rounded-lg py-2 text-roman-500 transition-colors hover:bg-roman-50"
            onClick={() => signOut()}
            variant="plain"
          >
            Log out
          </Popover.Button>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
