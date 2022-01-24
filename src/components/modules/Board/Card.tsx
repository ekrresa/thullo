import { Draggable } from 'react-beautiful-dnd';
import { BiPlus } from 'react-icons/bi';
import { IoAttachSharp } from 'react-icons/io5';
import { useCardContext } from '@context/CardContext';

interface BoardCardProps {
  image?: boolean;
  id: number;
  title: string;
  listTitle: string;
  index: number;
}

export function Card({ listTitle, id, title, index, image }: BoardCardProps) {
  const { handleCardInfo } = useCardContext();

  return (
    <Draggable draggableId={String(id)} index={index}>
      {(provided, snapshot) => (
        <div
          className={`p-4 bg-white rounded-lg shadow-card transition ${
            snapshot.isDragging && 'bg-white/30'
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => handleCardInfo({ id, listTitle })}
        >
          {image && <div className="h-40 mb-3 rounded-lg bg-corn-blue"></div>}

          <h3 className="text-base font-open-sans">{title}</h3>

          <div className="flex items-center justify-between mt-4">
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
