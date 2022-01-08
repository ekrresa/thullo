import * as React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Layout } from '@components/common/Layout';
import { Task } from '@components/modules/Board/Task';
import { Column } from '@components/modules/Board/Column';
import { SideMenu } from '@components/modules/Board/SideMenu';
import { VisibilitySwitch } from '@components/modules/Board/VisibilitySwitch';
import { BoardInvite } from '@components/modules/Board/BoardInvite';
import { TaskProvider } from '@context/taskContext';
import { TaskDetails } from '@components/modules/Board/TaskDetails';
import { AddNewItem } from '@components/modules/Board/AddNewItem';
import { useFetchSingleBoard } from '@hooks/board';
import { getCloudinaryUrl, getInitials } from '@lib/utils';

export default function Board() {
  const router = useRouter();
  const board = useFetchSingleBoard(Number(router.query.board));
  const handleDragEnd = (result: DropResult) => {
    console.log(result);
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
        <section className="container relative overflow-hidden mt-9">
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
            <section className="flex items-start p-8 mt-6 space-x-12 overflow-x-auto bg-off-white2 rounded-xl">
              <Column title="Backlog">
                <Task id="1" image />
                <Task id="2" />
              </Column>
              <Column title="In Progress">
                <Task id="3" />
                <Task id="4" image />
                <Task id="5" image />
              </Column>

              <AddNewItem text="Add new list" />
            </section>
          </DragDropContext>
        </section>
      )}
    </>
  );
}

Board.getLayout = (page: React.ComponentType) => (
  <Layout>
    <TaskProvider>{page}</TaskProvider>
  </Layout>
);
Board.protected = true;
