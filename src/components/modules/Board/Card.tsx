import Image from 'next/image';
import { Draggable } from 'react-beautiful-dnd';
import { BiPlus } from 'react-icons/bi';
import { IoAttachSharp } from 'react-icons/io5';
import { useCardContext } from '@context/CardContext';
import { Card as CardType } from 'types/database';
import { getCloudinaryUrl } from '@lib/utils';

interface CardProps {
  cardInfo: CardType;
  listTitle: string;
  boardId: number;
  index: number;
}

export function Card({ boardId, cardInfo, listTitle, index }: CardProps) {
  const { handleCardInfo, handleCardModal } = useCardContext();

  return (
    <Draggable draggableId={String(cardInfo.id)} index={index}>
      {(provided, snapshot) => (
        <div
          className={`rounded-lg bg-white p-4 shadow-card transition ${
            snapshot.isDragging && 'bg-white/30'
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => {
            handleCardInfo({
              id: cardInfo.id,
              listTitle,
              list_id: cardInfo.list_id,
              board_id: boardId,
            });
            handleCardModal();
          }}
        >
          {cardInfo.image_id && cardInfo.image_version && (
            <div className="relative mb-3 h-40 overflow-hidden rounded-lg">
              <Image
                src={getCloudinaryUrl(cardInfo.image_id, cardInfo.image_version)}
                layout="fill"
                alt=""
              />
            </div>
          )}

          <h3 className="font-open-sans text-base">{cardInfo.title}</h3>

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
