import React, { ComponentType, useState } from 'react';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';
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

export default function Board() {
  const [sideMenu, setSideMenu] = useState(false);
  const handleDragEnd = (result: DropResult) => {
    console.log(result);
  };

  return (
    <section className="container relative overflow-hidden mt-9">
      <SideMenu open={sideMenu} closeSideMenu={() => setSideMenu(false)} />
      <TaskDetails />

      <div className="flex justify-between">
        <div className="flex items-center">
          <VisibilitySwitch />

          <div className="flex items-center ml-4 mr-4 space-x-4">
            <div className="w-8 h-8 rounded-lg bg-corn-blue"></div>
            <div className="w-8 h-8 rounded-lg bg-corn-blue"></div>
            <div className="w-8 h-8 rounded-lg bg-corn-blue"></div>
          </div>

          <BoardInvite />
        </div>

        <button
          className="flex items-center px-3 py-2 text-sm rounded-lg bg-off-white text-gray3"
          onClick={() => setSideMenu(true)}
        >
          <IoEllipsisHorizontalSharp className="mr-2" />
          Show Menu
        </button>
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
  );
}

Board.getLayout = (page: ComponentType) => (
  <Layout>
    <TaskProvider>{page}</TaskProvider>
  </Layout>
);
Board.protected = true;
