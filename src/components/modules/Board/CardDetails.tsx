import * as React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdStickyNote2 } from 'react-icons/md';
import { useMutation, useQueryClient } from 'react-query';
import { IoClose, IoPencil } from 'react-icons/io5';

import { Modal } from '../../common/Modal';
import { useCardContext } from '@context/CardContext';
import { boardsQueryKeys, useFetchCardInfo } from '@hooks/board';
import { TextArea } from '@components/common/TextArea';
import { Button } from '@components/common/Button';
import { updateCard } from '@lib/api/board';

export function CardDetails() {
  const queryClient = useQueryClient();
  const { cardInfo, handleCardModal, openCardModal } = useCardContext();
  const cardData = useFetchCardInfo(cardInfo.id);
  const [isEditing, setIsEditing] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const descriptionMutation = useMutation((data: { description: string }) =>
    updateCard(data, cardInfo.id)
  );

  const handleCardDescription = () => {
    descriptionMutation.mutate(
      { description },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(boardsQueryKeys.card(cardInfo.id));
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <Modal
      isOpen={openCardModal}
      className="max-w-2xl pb-10 overflow-visible"
      closeModal={handleCardModal}
      closeIcon
    >
      {cardData.isLoading ? (
        <p className="text-sm text-center">Loading...</p>
      ) : (
        <>
          <div className="h-40 rounded bg-corn-blue"></div>
          <div className="flex mt-8 space-x-8">
            <div className="flex-1">
              <h2>{cardData.data?.title}</h2>
              <p className="mt-2 space-x-2">
                <span className="text-xs text-gray4">in list</span>
                <span className="text-sm font-medium text-pencil">
                  {cardInfo.listTitle}
                </span>
              </p>

              <div className="flex items-center justify-between mt-6 text-light-pencil">
                <div className="flex">
                  <MdStickyNote2 />
                  <span className="ml-2 text-sm font-medium">Description</span>
                </div>

                <button
                  className="flex items-center px-2 py-1 ml-8 border border-light-pencil rounded-xl"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <IoClose />
                      <span className="ml-2 text-xs text-gray-400">Cancel</span>
                    </>
                  ) : cardData.data?.description ? (
                    <>
                      <IoPencil />
                      <span className="ml-2 text-xs text-gray-400">Edit</span>
                    </>
                  ) : (
                    <>
                      <IoPencil />
                      <span className="ml-2 text-xs text-gray-400">Add</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-2">
                {isEditing ? (
                  <>
                    <div className="p-4 text-sm border rounded-lg">
                      <TextArea
                        content={cardData.data?.description}
                        onChange={val => setDescription(val)}
                      />
                    </div>
                    <Button
                      className="items-stretch justify-center w-full px-4 py-3 mt-2 text-sm text-white rounded-lg bg-corn-blue"
                      onClick={handleCardDescription}
                      disabled={descriptionMutation.isLoading}
                      loading={descriptionMutation.isLoading}
                    >
                      Submit
                    </Button>
                  </>
                ) : cardData.data?.description ? (
                  <div
                    className="prose-sm prose-p:mb-1 prose-p:mt-1"
                    dangerouslySetInnerHTML={{ __html: cardData.data?.description }}
                  ></div>
                ) : (
                  <p className="text-xs italic text-gray-400">No description yet</p>
                )}
              </div>

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
                    “The gladdest moment in human life, methinks, is a departure into
                    unknown lands.” – Sir Richard Burton
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
        </>
      )}
    </Modal>
  );
}
