import { Fragment } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useQueryClient } from 'react-query';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';
import { Menu, Transition } from '@headlessui/react';

import { AddNewItem } from './AddNewItem';
import { boardsQueryKeys, useFetchListCards } from '@hooks/board';
import { createCard } from '@lib/api/board';
import { useUserProfile } from '@hooks/user';
import { Card } from './Card';

interface BoardProps extends React.PropsWithChildren<unknown> {
  title: string;
  boardId: number;
  listId: number;
}

export function List({ boardId, listId, title }: BoardProps) {
  const user = useUserProfile();
  const cards = useFetchListCards(listId);
  const queryClient = useQueryClient();

  return (
    <div className="flex-grow max-w-[20rem] min-w-[17rem]">
      <header className="flex items-center justify-between mb-4">
        <h2 className="">{title}</h2>
        <Ellipsis />
      </header>

      <Droppable droppableId={String(listId)}>
        {provided => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid gap-4"
          >
            {cards.data &&
              cards.data.map(card => (
                <Card key={card.id} id={String(card.id)} title={card.title} />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {cards.isSuccess && user.data && (
        <div className="mt-4">
          <AddNewItem
            text="Add new task"
            submitAction={(title: string) => {
              const maxPosition = Math.max(...cards.data.map(card => card.position));
              return createCard({
                title,
                board_id: boardId,
                list_id: listId,
                created_by: user.data.id,
                position: Number(maxPosition) + 1,
              });
            }}
            onSuccessCallback={data => {
              queryClient.setQueryData(
                boardsQueryKeys.boardListCards(listId),
                (oldData: any) => {
                  return [data, ...oldData];
                }
              );
            }}
          />
        </div>
      )}
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
