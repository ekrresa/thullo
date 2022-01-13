import * as React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useQueryClient } from 'react-query';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';
import { Menu, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import UseOnClickOutside from 'use-onclickoutside';

import { AddNewItem } from './AddNewItem';
import { boardsQueryKeys, useFetchListCards } from '@hooks/board';
import { createCard, renameList } from '@lib/api/board';
import { useUserProfile } from '@hooks/user';
import { Card } from './Card';
import { Card as CardType, List } from 'types/database';

interface BoardProps extends React.PropsWithChildren<unknown> {
  title: string;
  boardId: number;
  listId: number;
  index: number;
}

export function List({ boardId, listId, title, index }: BoardProps) {
  const user = useUserProfile();
  const cards = useFetchListCards(listId);
  const queryClient = useQueryClient();
  const [editing, setEditing] = React.useState(false);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  UseOnClickOutside(titleInputRef, () => setEditing(false));

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

  const addNewCard = (title: string) => {
    let maxPosition =
      cards.data?.length === 0 ? -1 : Math.max(...cards.data!.map(card => card.position));

    return createCard({
      title,
      board_id: boardId,
      list_id: listId,
      created_by: user.data!.id,
      position: ++maxPosition!,
    });
  };

  return (
    <Draggable draggableId={String(listId)} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="flex-grow max-w-[20rem] min-w-[17rem]"
        >
          <header
            {...provided.dragHandleProps}
            className="flex items-center justify-between mb-4"
          >
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
                className="flex-1 pl-1"
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
                  <div className="text-xs text-gray3">
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

          <Droppable droppableId={String(listId)} type="CARD">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`grid min-h-[10px] gap-4 rounded-lg ${
                  snapshot.isDraggingOver && 'bg-sky-100'
                }`}
              >
                {cards.data && <InnerList list={cards.data} />}
                {/* {cards.data &&
                  cards.data.map((card, index) => (
                    <Card key={card.id} id={card.id} index={index} title={card.title} />
                  ))} */}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {cards.isSuccess && user.data && (
            <div className="pt-4">
              <AddNewItem
                text="Add new task"
                submitAction={addNewCard}
                onSuccessCallback={data => {
                  queryClient.setQueryData(
                    boardsQueryKeys.boardListCards(listId),
                    (oldData: any) => {
                      return [...oldData, data];
                    }
                  );
                }}
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

interface InnerListProps<T> {
  list: T[];
}

function InnerList({ list }: InnerListProps<CardType>) {
  return (
    <>
      {list.map((card, index) => (
        <Card key={card.id} id={card.id} index={index} title={card.title} />
      ))}
    </>
  );
}
