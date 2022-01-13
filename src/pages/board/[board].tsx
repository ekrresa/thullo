import * as React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

import { Layout } from '@components/common/Layout';
import { List } from '@components/modules/Board/List';
import { SideMenu } from '@components/modules/Board/SideMenu';
import { VisibilitySwitch } from '@components/modules/Board/VisibilitySwitch';
import { BoardInvite } from '@components/modules/Board/BoardInvite';
import { CardProvider } from '@context/CardContext';
import { TaskDetails } from '@components/modules/Board/TaskDetails';
import { AddNewItem } from '@components/modules/Board/AddNewItem';
import { boardsQueryKeys, useFetchBoardLists, useFetchSingleBoard } from '@hooks/board';
import { getCloudinaryUrl, getInitials } from '@lib/utils';
import { createList, sortCards, SortItemInput, sortLists } from '@lib/api/board';
import { useUserProfile } from '@hooks/user';
import { Card, List as ListType } from 'types/database';

export default function Board() {
  const router = useRouter();
  const user = useUserProfile();
  const board = useFetchSingleBoard(Number(router.query.board));
  const lists = useFetchBoardLists(Number(router.query.board));
  const queryClient = useQueryClient();
  const sortCardsMutation = useMutation((data: SortItemInput) => sortCards(data));
  const sortListsMutation = useMutation((data: SortItemInput) => sortLists(data));

  const addNewList = React.useCallback(
    (title: string) => {
      let maxPosition =
        lists.data?.length === 0
          ? -1
          : Math.max(...lists.data!.map(list => list.position));

      return createList({
        title,
        board_id: board.data?.id!,
        user_id: user.data?.id!,
        position: ++maxPosition!,
      });
    },
    [board.data?.id, lists.data, user.data?.id]
  );

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    // Item was not dropped on a Droppable
    if (!destination) return;

    // Item was dropped in its initial location
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (destination.droppableId === source.droppableId && type === 'LIST') {
      const grid = queryClient.getQueryData<ListType[]>(
        boardsQueryKeys.boardLists(Number(router.query.board))
      );

      if (Array.isArray(grid)) {
        const columnList = Array.from(grid);

        columnList.splice(source.index, 1);
        columnList.splice(
          destination.index,
          0,
          grid.find(list => list.id === Number(draggableId))!
        );

        const newColumnList = columnList.map((card, index) => {
          card.position = index;
          return card;
        });

        // Update client state
        queryClient.setQueryData(
          boardsQueryKeys.boardLists(Number(router.query.board)),
          newColumnList
        );

        const sortListsInput = newColumnList.map(list => ({
          id: list.id,
          position: list.position,
        }));

        // Update database with new lists order
        sortListsMutation.mutate(sortListsInput, {
          onError: () => {
            toast.error('Lists sync failed.');
            queryClient.setQueryData(
              boardsQueryKeys.boardLists(Number(router.query.board)),
              grid
            );
          },
        });
      }
    }

    if (destination.droppableId === source.droppableId && type === 'CARD') {
      const column = queryClient.getQueryData<Card[]>(
        boardsQueryKeys.boardListCards(Number(source.droppableId))
      );

      if (Array.isArray(column)) {
        const cardsList = Array.from(column);

        cardsList.splice(source.index, 1);
        cardsList.splice(
          destination.index,
          0,
          column.find(card => card.id === Number(draggableId))!
        );

        const newCardsList = cardsList.map((card, index) => {
          card.position = index;
          return card;
        });

        // Update client state
        queryClient.setQueryData(
          boardsQueryKeys.boardListCards(Number(source.droppableId)),
          newCardsList
        );

        const sortCardsInput = newCardsList.map(card => ({
          id: card.id,
          position: card.position,
        }));

        // Update database with new lists order
        sortCardsMutation.mutate(sortCardsInput, {
          onError: () => {
            toast.error('Cards sync failed.');
            queryClient.setQueryData(
              boardsQueryKeys.boardListCards(Number(source.droppableId)),
              column
            );
          },
        });
      }
    }
  };

  if (board.isLoading) {
    return <div className="text-center mt-9">Loading...</div>;
  }

  if (board.isError) {
    return <div className="text-center mt-9">An error occurred...</div>;
  }

  return (
    <>
      {board.data && (
        <section className="container relative overflow-hidden mt-9 h-[95%]">
          <TaskDetails />

          <div className="flex justify-between">
            <div className="flex items-center">
              <VisibilitySwitch
                boardId={board.data.id}
                visibility={board.data.visibility}
              />

              <div className="flex items-center ml-4 mr-4 space-x-4">
                <div className="relative w-8 h-8 overflow-hidden rounded-lg bg-corn-blue">
                  {board.data.owner.image_id ? (
                    <Image
                      src={getCloudinaryUrl(
                        board.data?.owner.image_id as string,
                        board.data?.owner.image_version as string
                      )}
                      layout="fill"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full">
                      {getInitials(board.data?.owner.name as string)}
                    </div>
                  )}
                </div>
              </div>

              <BoardInvite />
            </div>

            <SideMenu board={board.data} />
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <section className="flex items-start p-4 mt-6 space-x-12 h-[93%] overflow-x-auto bg-off-white2 rounded-xl">
              <Droppable droppableId="lists" type="LIST" direction="horizontal">
                {provided => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex items-start flex-1 h-full p-4 space-x-12"
                  >
                    {lists.data &&
                      lists.data.map((list, index) => (
                        <List
                          title={list.title}
                          boardId={list.board_id}
                          listId={list.id}
                          key={list.id}
                          index={index}
                        />
                      ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {lists.data && (
                <div className="p-4">
                  <AddNewItem
                    text="Add new list"
                    submitAction={addNewList}
                    onSuccessCallback={data => {
                      queryClient.setQueryData(
                        boardsQueryKeys.boardLists(board.data.id),
                        (oldData: any) => {
                          return [...oldData, data];
                        }
                      );
                    }}
                  />
                </div>
              )}
            </section>
          </DragDropContext>
        </section>
      )}
    </>
  );
}

Board.getLayout = (page: React.ComponentType) => (
  <Layout>
    <CardProvider>{page}</CardProvider>
  </Layout>
);
Board.protected = true;
