import { Fragment } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';
import { Menu, Transition } from '@headlessui/react';
import { AddNewItem } from './AddNewItem';

interface BoardProps extends React.PropsWithChildren<unknown> {
  title: string;
}

export function Column({ children, title }: BoardProps) {
  return (
    <div className="flex-grow max-w-[20rem] min-w-[17rem]">
      <header className="flex items-center justify-between mb-4">
        <div className="">{title}</div>
        <Ellipsis />
      </header>

      <Droppable droppableId={title}>
        {provided => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid gap-4"
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <AddNewItem text="Add new task" />
    </div>
  );
}

function Ellipsis() {
  return (
    <Menu as="div" className="relative">
      <Menu.Button>
        <IoEllipsisHorizontalSharp className="text-base cursor-pointer" color="#828282" />
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
        <Menu.Items className="absolute left-0 z-10 p-4 bg-white border rounded-lg shadow-lg border-ash">
          <div className="text-xs divide-y divide-ash text-gray3">
            <button className="block py-2 whitespace-nowrap">Rename</button>
            <button className="block py-2 whitespace-nowrap">Delete this list</button>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
