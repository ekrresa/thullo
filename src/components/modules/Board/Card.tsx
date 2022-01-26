import { Draggable } from 'react-beautiful-dnd';
import { BiPlus } from 'react-icons/bi';
import { IoAttachSharp } from 'react-icons/io5';
import { useCardContext } from '@context/CardContext';

interface BoardCardProps {
  image?: boolean;
  id: number;
  title: string;
  listTitle: string;
  boardId: number;
  index: number;
}

export function Card({ listTitle, id, boardId, title, index, image }: BoardCardProps) {
  const { handleCardInfo } = useCardContext();

  return (
    <Draggable draggableId={String(id)} index={index}>
      {(provided, snapshot) => (
        <div
          className={`rounded-lg bg-white p-4 shadow-card transition ${
            snapshot.isDragging && 'bg-white/30'
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => handleCardInfo({ id, listTitle, board_id: boardId })}
        >
          {image && <div className="mb-3 h-40 rounded-lg bg-corn-blue"></div>}

          <h3 className="font-open-sans text-base">{title}</h3>

          <div className="mt-4 flex items-center justify-between">
            <button
              className="rounded-lg bg-corn-blue p-1 text-white"
              onClick={e => {
                e.stopPropagation();
              }}
            >
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
