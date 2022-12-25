import Image from "next/legacy/image";
import { Draggable } from 'react-beautiful-dnd';
import { useCardContext } from '@context/CardContext';
import { Card as CardType } from 'types/database';
import { getCloudinaryUrl } from '@lib/utils';
import { useIsBoardMember } from '@hooks/useIsBoardMember';

interface CardProps {
  cardInfo: CardType;
  listTitle: string;
  boardId: number;
  index: number;
  boardOwner: string;
  members: string[];
}

export function Card({
  boardOwner,
  boardId,
  cardInfo,
  listTitle,
  index,
  members,
}: CardProps) {
  const { handleCardInfo, handleCardModal } = useCardContext();
  const interactWithCard = useIsBoardMember(boardOwner, members);

  return (
    <Draggable
      draggableId={String(cardInfo.id)}
      index={index}
      isDragDisabled={!interactWithCard}
    >
      {(provided, snapshot) => (
        <div
          className={`cursor-pointer rounded-lg bg-white p-4 shadow-card transition ${
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
        </div>
      )}
    </Draggable>
  );
}
