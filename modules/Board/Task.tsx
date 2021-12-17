import { Draggable } from 'react-beautiful-dnd';
import { BiPlus } from 'react-icons/bi';
import { IoAttachSharp } from 'react-icons/io5';
import { useTaskContext } from '../../context/taskContext';

interface BoardCardProps {
  image?: boolean;
  id: string;
}

export function Task({ id, image }: BoardCardProps) {
  const { handleTaskId } = useTaskContext();

  return (
    <Draggable draggableId={id} index={Number(id)}>
      {provided => (
        <div
          className="p-4 bg-white rounded-lg shadow-card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => handleTaskId(id)}
        >
          {image && <div className="h-40 mb-3 rounded-lg bg-corn-blue"></div>}

          <h3 className="text-base">New phone: Who this?</h3>

          <div className="flex items-center my-4">
            <span className="bg-[#EBDCF9] px-2 py-[0.09rem] rounded-lg text-xs text-[#9B51E0]">
              concept
            </span>
          </div>

          <div className="flex items-center justify-between">
            <button className="p-1 text-white rounded-lg bg-corn-blue">
              <BiPlus className="text-2xl" />
            </button>
            <div className="">
              <div className="flex items-center text-light-pencil">
                <IoAttachSharp className="mr-[0.1rem]" />1
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
