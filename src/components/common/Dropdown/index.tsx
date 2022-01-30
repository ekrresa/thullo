import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';

interface DropdownProps {
  className?: string;
  header?: ReactNode;
  list: ReactNode[];
  panel: ReactNode;
}

export function Dropdown({ className, header, list, panel }: DropdownProps) {
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
        <Menu.Items className="absolute right-0 z-20 mt-2 w-36  origin-top-right overflow-hidden rounded-xl border border-ash bg-white shadow-lg sm:left-0 sm:w-full">
          {header}
          {list.map((item, index) => (
            <Menu.Item key={index}>{item}</Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
