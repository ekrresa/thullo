import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';

interface DropdownProps {
  className: string;
  panel: ReactNode;
  list: ReactNode[];
}

export function Dropdown({ className, list, panel }: DropdownProps) {
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
        <Menu.Items className="absolute left-0 z-20 w-full mt-2 overflow-hidden origin-top-right bg-white border shadow-lg font-poppins rounded-xl border-ash">
          {list.map(item => (
            <Menu.Item key={item?.toString()}>{item}</Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
