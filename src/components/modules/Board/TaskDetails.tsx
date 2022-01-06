import React from 'react';
import { FaPen, FaUserCircle } from 'react-icons/fa';
import { MdStickyNote2 } from 'react-icons/md';
import { Modal } from '../../common/Modal';
import { useTaskContext } from '@context/taskContext';

export function TaskDetails() {
  const { taskId, handleTaskId } = useTaskContext();

  return (
    <Modal
      isOpen={Boolean(taskId)}
      className="max-w-2xl pb-10"
      closeModal={() => handleTaskId('')}
    >
      <div className="h-32 rounded bg-corn-blue"></div>
      <div className="flex mt-8 space-x-8">
        <div className="flex-1">
          <h2>✋🏿 Move anything that is actually started here</h2>
          <p className="mt-2 space-x-2">
            <span className="text-xs text-gray4">in list</span>
            <span className="text-sm font-medium text-pencil">In Progress</span>
          </p>

          <div className="flex items-center mt-6 text-light-pencil">
            <MdStickyNote2 className="text-lg " />
            <span className="ml-2 text-sm font-medium">Description</span>

            <button className="flex items-center px-4 py-[0.4rem] ml-8 border border-light-pencil rounded-xl">
              <FaPen color="#828282" className="text-xs" />
              <span className="ml-4 text-xs text-gray3">Edit</span>
            </button>
          </div>

          <p className="mt-6 text-sm leading-6">
            Simple board to start on a project. Each list can hold items (cards) that
            represent ideas or tasks. There 4 lists here: * Backlog 🤔 : Ideas are created
            here. Here people can describe the idea following three simple questions: Why
            you wish to do it, What it is, how can you do it. * In Progress📚: Once the
            ideas is clearly defined, the task can move to #todo stage. Here the owner of
            the idea can move to #doing once s/he is ready. He can also wait a bit for
            other members to join. * In Review ⚙️: On-going * Completed 🙌🏽**: Finished You
            could add other lists like labels holding labels (with colors) in order to tag
            each card by a label if you wish.
          </p>

          <div className="pb-3 mt-8 overflow-hidden text-right border rounded-lg shadow-md border-ash">
            <textarea
              id=""
              rows={5}
              className="block w-full px-4 py-2 text-sm appearance-none"
              placeholder="Write a comment..."
            ></textarea>
            <button className="px-4 py-2 ml-auto mr-3 text-xs text-white rounded-lg bg-corn-blue">
              Comment
            </button>
          </div>

          <div className="mt-8">
            <div className="">
              <div className="flex justify-between ">
                <div className="flex mb-3 space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-corn-blue"></div>
                  <div className="">
                    <p className="text-sm">Mikael Stanley</p>
                    <p className="text-xs text-light-pencil">24 August at 20:43</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-[0.7rem] font-light text-gray3">
                  <span>Edit</span>
                  <span>&#8212;</span>
                  <span>Delete</span>
                </div>
              </div>

              <p className="text-sm text-gray4">
                “The gladdest moment in human life, methinks, is a departure into unknown
                lands.” – Sir Richard Burton
              </p>
            </div>
          </div>
        </div>
        <aside className="flex-1 flex-shrink-0 max-w-[10rem]">
          <h2 className="flex items-center text-sm text-light-pencil">
            <FaUserCircle />
            <span className="ml-2">Actions</span>
          </h2>

          <div className="mt-4 space-y-3">
            <button className="block w-full px-4 py-2 text-xs rounded-lg bg-off-white text-gray3">
              Members
            </button>
            <button className="block w-full px-4 py-2 text-xs rounded-lg bg-off-white text-gray3">
              Labels
            </button>
            <button className="block w-full px-4 py-2 text-xs rounded-lg bg-off-white text-gray3">
              Cover
            </button>
          </div>
        </aside>
      </div>
    </Modal>
  );
}
