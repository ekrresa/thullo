import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useQueryClient } from 'react-query';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';
import { Menu, Transition } from '@headlessui/react';
import { useFormik } from 'formik';

import { AddNewItem } from './AddNewItem';
import { boardsQueryKeys, useFetchListCards } from '@hooks/board';
import { createCard, renameList } from '@lib/api/board';
import { useUserProfile } from '@hooks/user';
import { Card } from './Card';
import { List } from 'types/database';

interface BoardProps extends React.PropsWithChildren<unknown> {
  title: string;
  boardId: number;
  listId: number;
}

export function List({ boardId, listId, title }: BoardProps) {
  const user = useUserProfile();
  const cards = useFetchListCards(listId);
  const queryClient = useQueryClient();
  const [editing, setEditing] = React.useState(false);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: { title },
    onSubmit: async values => {
      if (title === values.title) return;

      const result = await renameList(values.title, listId);
      queryClient.setQueryData(boardsQueryKeys.boardLists(boardId), (oldData: any) => {
        return oldData.map((list: List) => {
          if (list.id === listId) list.title = result.title;

          return list;
        });
      });

      setEditing(false);
    },
  });

  React.useEffect(() => {
    if (editing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editing]);

  return (
    <div className="flex-grow max-w-[20rem] min-w-[17rem]">
      <header className="flex items-center justify-between mb-4">
        {editing ? (
          <form className="flex-1 mr-4" onSubmit={formik.handleSubmit}>
            <input
              className="w-full pl-1 bg-inherit font-poppins"
              ref={titleInputRef}
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={() => {
                formik.handleSubmit();
              }}
            />
          </form>
        ) : (
          <h2
            className="pl-1"
            onClick={() => {
              setEditing(true);
            }}
          >
            {title}
          </h2>
        )}

        <Menu as="div" className="relative">
          <Menu.Button>
            <IoEllipsisHorizontalSharp
              className="text-base cursor-pointer"
              color="#828282"
            />
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
            <Menu.Items className="absolute left-0 z-10 overflow-hidden bg-white border rounded-lg shadow-lg border-ash">
              <div className="text-xs divide-y divide-ash text-gray3">
                <Menu.Item>
                  <button
                    className="block w-full px-2 py-2 text-left hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => {
                      setEditing(true);
                    }}
                  >
                    Rename
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="block w-full px-2 py-2 text-left hover:bg-gray-100 whitespace-nowrap">
                    Delete this list
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
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
