import * as React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdStickyNote2 } from 'react-icons/md';
import { useMutation, useQueryClient } from 'react-query';
import { IoClose, IoPencil } from 'react-icons/io5';
import { formatDistanceToNow } from 'date-fns';

import { Modal } from '../../common/Modal';
import { useCardContext } from '@context/CardContext';
import { boardsQueryKeys, useFetchCardComments, useFetchCardInfo } from '@hooks/board';
import { TextArea } from '@components/common/TextArea';
import { Button } from '@components/common/Button';
import { addComment, CommentInput, updateCard } from '@lib/api/board';
import { useUserProfile } from '@hooks/user';
import { Avatar } from '@components/common/Avatar';
import { supabase } from '@lib/supabase';
import { Comment } from '../../../types/database';

export function CardDetails() {
  const queryClient = useQueryClient();
  const commentRef = React.useRef<any>(null);
  const { cardInfo, handleCardModal, openCardModal } = useCardContext();
  const cardData = useFetchCardInfo(cardInfo.id);
  const loggedInUser = useUserProfile();
  const cardComments = useFetchCardComments(cardInfo.id);

  const [isEditing, setIsEditing] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [showCommentsInput, setShowCommentsInput] = React.useState(false);

  const addCommentMutation = useMutation((data: CommentInput) => addComment(data));
  const descriptionMutation = useMutation((data: { description: string }) =>
    updateCard(data, cardInfo.id)
  );

  React.useEffect(() => {
    (async () => {
      const result = await supabase
        .from(`comments:card_id=eq.${cardInfo.id}`)
        .on('INSERT', payload => {
          const oldComments = queryClient.getQueryData<Comment[]>(
            boardsQueryKeys.cardComments(cardInfo.id)
          );
          if (Array.isArray(oldComments)) {
            const newComments = [payload.new, ...oldComments].map(comment => {
              if (typeof comment.user === 'string') {
                comment.user = loggedInUser.data;
              }
              return comment;
            });

            queryClient.setQueryData(
              boardsQueryKeys.cardComments(cardInfo.id),
              newComments
            );
          }
        })
        .subscribe();

      return () => {
        result.unsubscribe();
      };
    })();
  }, [cardInfo.id, queryClient]);

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

  const handleComment = () => {
    if (!comment) return;

    addCommentMutation.mutate(
      {
        text: comment,
        card_id: cardInfo.id,
        board_id: cardInfo.board_id,
        user: loggedInUser.data?.id!,
      },
      {
        onSuccess: () => {
          if (commentRef.current) {
            commentRef.current.clearEditor();
          }
        },
      }
    );
  };

  return (
    <Modal
      isOpen={openCardModal}
      className="max-w-2xl overflow-visible pb-10"
      closeModal={handleCardModal}
      closeIcon
    >
      {cardData.isLoading ? (
        <p className="text-center text-sm">Loading...</p>
      ) : (
        <>
          <div className="h-40 rounded bg-corn-blue"></div>
          <div className="mt-8 flex space-x-8">
            <div className="flex-1">
              <h2>{cardData.data?.title}</h2>
              <p className="mt-2 space-x-2">
                <span className="text-xs text-gray4">in list</span>
                <span className="text-sm font-medium text-pencil">
                  {cardInfo.listTitle}
                </span>
              </p>

              <div className="mt-6 flex items-center justify-between text-light-pencil">
                <div className="flex">
                  <MdStickyNote2 />
                  <span className="ml-2 text-sm font-medium">Description</span>
                </div>

                <button
                  className="ml-8 flex items-center rounded-xl border border-light-pencil px-2 py-1"
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
                    <div className="rounded-lg border p-4 text-sm">
                      <TextArea
                        content={cardData.data?.description}
                        onChange={val => setDescription(val)}
                      />
                    </div>
                    <Button
                      className="mt-2 w-full items-stretch justify-center rounded-lg bg-corn-blue px-4 py-3 text-sm text-white"
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

              {!showCommentsInput && (
                <div className="mt-8">
                  <Button
                    className="inline-block rounded-lg border bg-corn-blue py-2 px-4 text-xs text-white"
                    onClick={() => setShowCommentsInput(!showCommentsInput)}
                  >
                    Add Comment
                  </Button>
                </div>
              )}

              {showCommentsInput && (
                <div className="mt-8 overflow-hidden rounded-lg border border-ash pb-3 shadow-md">
                  <div className="p-4 text-sm">
                    <TextArea
                      content=""
                      onChange={val => setComment(val)}
                      ref={commentRef}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="mr-3 rounded bg-corn-blue px-4 py-2 text-xs text-white"
                      onClick={handleComment}
                      disabled={addCommentMutation.isLoading}
                      loading={addCommentMutation.isLoading}
                    >
                      Comment
                    </Button>
                    <Button
                      className="mr-3 rounded bg-gray-100 px-4 py-2 text-xs text-gray-400"
                      onClick={() => setShowCommentsInput(!showCommentsInput)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-12 space-y-8">
                {cardComments.data &&
                  cardComments.data.map(comment => (
                    <div className="" key={comment.id}>
                      <div className="flex justify-between ">
                        <div className="mb-3 flex space-x-4">
                          <div className="h-9 w-9 overflow-hidden rounded-xl">
                            <Avatar
                              imageId={comment.user.image_id}
                              imageVersion={comment.user.image_version}
                              name={comment.user.name}
                            />
                          </div>
                          <div className="">
                            <p className="text-sm">{comment.user.name}</p>
                            <p className="text-xs text-light-pencil">
                              {formatDistanceToNow(new Date(comment.created_at), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className="prose-sm text-gray4"
                        dangerouslySetInnerHTML={{ __html: comment.text }}
                      />
                    </div>
                  ))}
              </div>
            </div>

            <aside className="max-w-[10rem] flex-1 flex-shrink-0">
              <h2 className="flex items-center text-sm text-light-pencil">
                <FaUserCircle />
                <span className="ml-2">Actions</span>
              </h2>

              <div className="mt-4 space-y-3">
                <button className="block w-full rounded-lg bg-off-white px-4 py-2 text-xs text-gray3">
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
