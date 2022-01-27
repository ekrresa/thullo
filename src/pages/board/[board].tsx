import * as React from 'react';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

import { Layout } from '@components/common/Layout';
import { List } from '@components/modules/Board/List';
import { SideMenu } from '@components/modules/Board/SideMenu';
import { VisibilitySwitch } from '@components/modules/Board/VisibilitySwitch';
import { BoardInvite } from '@components/modules/Board/BoardInvite';
import { CardProvider } from '@context/CardContext';
import { CardDetails } from '@components/modules/Board/CardDetails';
import { AddNewItem } from '@components/modules/Board/AddNewItem';
import {
  boardsQueryKeys,
  useFetchBoardLists,
  useFetchBoardMembers,
  useFetchSingleBoard,
} from '@hooks/board';
import {
  createList,
  sortCards,
  SortItemInput,
  sortLists,
  updateCard,
} from '@lib/api/board';
import { useUserProfile } from '@hooks/user';
import { Card, List as ListType } from 'types/database';
import { Avatar } from '@components/common/Avatar';
import { IsOwner } from '@components/common/IsOwner';

export default function Board() {
  const router = useRouter();
  const loggedInUser = useUserProfile();
  const board = useFetchSingleBoard(Number(router.query.board));
  const lists = useFetchBoardLists(Number(router.query.board));
  const boardMembers = useFetchBoardMembers(
    Number(router.query.board),
    board.data?.members
  );

  const queryClient = useQueryClient();
  const sortCardsMutation = useMutation((data: SortItemInput) => sortCards(data));
  const sortListsMutation = useMutation((data: SortItemInput) => sortLists(data));
  const updateCardListMutation = useMutation((data: any) =>
    updateCard(data.input, data.cardId)
  );

  const addNewList = React.useCallback(
    (title: string) => {
      let maxPosition =
        lists.data?.length === 0
          ? -1
          : Math.max(...lists.data!.map(list => list.position));

      return createList({
        title,
        board_id: board.data?.id!,
        user_id: loggedInUser.data?.id!,
        position: ++maxPosition!,
      });
    },
    [board.data?.id, lists.data, loggedInUser.data?.id]
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

    // moving cards between lists
    if (destination.droppableId !== source.droppableId && type === 'CARD') {
      console.log(result);
      const sourceList = queryClient.getQueryData<Card[]>(
        boardsQueryKeys.boardListCards(Number(source.droppableId))
      );

      if (Array.isArray(sourceList) && sourceList.length) {
        const card = Array.from(sourceList).find(card => card.id === Number(draggableId));

        if (!card) return;

        card.list_id = Number(destination.droppableId);
        const destinationList = Array.from(
          queryClient.getQueryData<Card[]>(
            boardsQueryKeys.boardListCards(Number(destination.droppableId))
          ) ?? []
        );

        destinationList.splice(destination.index, 0, card);

        const newSourceList = sourceList
          .filter(card => card.id !== Number(draggableId))
          .map((card, index) => {
            card.position = index;
            return card;
          });

        const newDestinationList = destinationList.map((card, index) => {
          card.position = index;
          return card;
        });

        // Update client state for destination list
        queryClient.setQueryData(
          boardsQueryKeys.boardListCards(Number(destination.droppableId)),
          newDestinationList
        );

        // Update client state for source list
        queryClient.setQueryData(
          boardsQueryKeys.boardListCards(Number(source.droppableId)),
          newSourceList
        );

        const sourceListUpdate = newSourceList.map(card => ({
          id: card.id,
          position: card.position,
        }));

        const destinationListUpdate = newDestinationList.map(card => ({
          id: card.id,
          position: card.position,
        }));

        updateCardListMutation.mutate(
          {
            input: { list_id: destination.droppableId },
            cardId: Number(draggableId),
          },
          {
            onError: () => {
              toast.error('Cards sync failed.');
            },
            onSuccess: () => {
              // Update database with new lists order
              sortCardsMutation.mutate(destinationListUpdate, {
                onError: () => {
                  toast.error('Cards sync failed.');
                },
              });

              // Update database with new lists order
              sortCardsMutation.mutate(sourceListUpdate, {
                onError: () => {
                  toast.error('Cards sync failed.');
                  queryClient.setQueryData(
                    boardsQueryKeys.boardListCards(Number(destination.droppableId)),
                    sourceList
                  );
                },
              });
            },
          }
        );
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
    return <div className="mt-9 text-center">Loading...</div>;
  }

  if (board.isError) {
    return <div className="mt-9 text-center">An error occurred...</div>;
  }

  return (
    <>
      {board.data && (
        <section className="container relative mt-9 h-[95%] overflow-hidden">
          <CardDetails />

          <div className="flex justify-between">
            <div className="flex items-center">
              <VisibilitySwitch
                boardId={board.data.id}
                visibility={board.data.visibility}
              />

              <div className="ml-4 mr-4 flex items-center space-x-4">
                <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-corn-blue">
                  <Avatar
                    imageId={board.data?.owner.image_id}
                    imageVersion={board.data?.owner.image_version}
                    name={board.data?.owner.name}
                  />
                </div>

                {boardMembers.data &&
                  boardMembers.data.map(user => (
                    <div
                      key={user.id}
                      className="relative h-9 w-9 overflow-hidden rounded-xl bg-corn-blue"
                    >
                      <Avatar
                        imageId={user.image_id}
                        imageVersion={user.image_version}
                        name={user.name}
                      />
                    </div>
                  ))}
              </div>

              {board.data && (
                <IsOwner isOwner={board.data.owner.id === loggedInUser.data?.id}>
                  <BoardInvite board={board.data} members={boardMembers.data ?? []} />
                </IsOwner>
              )}
            </div>

            <SideMenu board={board.data} members={boardMembers.data ?? []} />
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <section className="mt-6 flex h-[93%] items-start space-x-12 overflow-x-auto rounded-xl bg-off-white2 p-4">
              <Droppable droppableId="lists" type="LIST" direction="horizontal">
                {provided => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex h-full items-start space-x-12 p-4"
                  >
                    {lists.data && <InnerList list={lists.data} />}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {lists.data && (
                <div className="py-4 pr-3">
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

interface InnerListProps<T> {
  list: T[];
}

function InnerList({ list }: InnerListProps<ListType>) {
  return (
    <>
      {list.map((list, index) => (
        <List
          key={list.id}
          index={index}
          title={list.title}
          boardId={list.board_id}
          listId={list.id}
        />
      ))}
    </>
  );
}
