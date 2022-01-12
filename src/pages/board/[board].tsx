import * as React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useQueryClient } from 'react-query';

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
import { createList } from '@lib/api/board';
import { useUserProfile } from '@hooks/user';

export default function Board() {
  const router = useRouter();
  const user = useUserProfile();
  const board = useFetchSingleBoard(Number(router.query.board));
  const lists = useFetchBoardLists(Number(router.query.board));
  const queryClient = useQueryClient();
  const handleDragEnd = (result: DropResult) => {
    console.log(result);
  };

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
            <section className="flex items-start p-8 mt-6 space-x-12 h-[93%] overflow-x-auto bg-off-white2 rounded-xl">
              {lists.data &&
                lists.data.map(list => (
                  <List
                    title={list.title}
                    boardId={list.board_id}
                    listId={list.id}
                    key={list.id}
                  />
                ))}

              {lists.data && (
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
