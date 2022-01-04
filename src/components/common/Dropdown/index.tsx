import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Button } from '../Button';
import { supabase } from '@lib/supabase';

interface DropdownProps {
  className: string;
  panel: ReactNode;
}

export function Dropdown({ className, panel }: DropdownProps) {
  return (
    <Menu as="div" className={`relative ${className}`}>
      <Menu.Button>{panel}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-20 w-full px-3 py-2 mt-2 origin-top-right bg-white border shadow-lg font-poppins rounded-xl border-ash">
          <Menu.Item>
            <Button className="w-full" onClick={() => supabase.auth.signOut()}>
              Log out
            </Button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
