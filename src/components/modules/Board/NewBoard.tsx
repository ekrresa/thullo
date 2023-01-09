import * as React from 'react';
import Image from 'next/image';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';

import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import { BoardCoverWidget } from '../../BoardCoverWidget';
import { VisibilitySelect } from './VisibilitySelect';
import { useCreateBoard } from '@hooks/board';
import { Input } from '@components/Input';
import { BoardCreateSchema, BoardInput } from '@models/index';

export function NewBoard() {
  const [isModalOpen, setModalOpen] = React.useState(false);

  const { createBoard, creatingBoard, reset: resetMutation } = useCreateBoard();

  const formMethods = useForm<BoardInput>({
    defaultValues: {
      title: '',
      image: null,
      cover: null,
      visibility: 'PRIVATE',
    },
    resolver: zodResolver(BoardCreateSchema),
  });

  const onBoardFormSubmit = (values: BoardInput) => {
    if (!values.image && !values.cover) {
      return toast.error('Please select a cover for the board.');
    }

    createBoard(values, {
      onSuccess() {
        setModalOpen(false);
        reset({ title: '', image: null, cover: null, visibility: 'PRIVATE' });
        toast.success('Board created successfully.');
      },
    });
  };

  const { control, register, handleSubmit, reset, watch } = formMethods;

  const boardCover = watch('cover');
  const boardImage = watch('image');

  return (
    <Modal
      trigger={
        <Button
          className="flex items-center rounded-md px-3 py-2 text-xs"
          variant="primary"
        >
          <BiPlus className="mr-2 text-sm" />
          Add
        </Button>
      }
      className="max-w-md overflow-visible"
      open={isModalOpen}
      onOpenChange={modalStatus => {
        setModalOpen(modalStatus);
        if (!modalStatus) {
          reset({ title: '', image: null, cover: null, visibility: 'PRIVATE' });
          resetMutation();
        }
      }}
      closeIcon
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onBoardFormSubmit)}>
          <div className="relative h-36 overflow-hidden rounded-lg bg-gray-200">
            {boardImage && (
              <Image
                className="object-cover"
                src={boardImage}
                width={400}
                height={144}
                alt="board cover"
              />
            )}

            {boardCover && (
              <div
                style={{ backgroundColor: boardCover }}
                className="h-full w-full"
              ></div>
            )}
          </div>

          <Input
            {...register('title')}
            label="Board Title"
            className="mt-4 w-full rounded-lg border border-ash bg-white px-3 py-2.5 text-sm drop-shadow-xl focus:outline-none"
            id="title"
            placeholder="Enter board title"
            labelHidden
          />

          <BoardCoverWidget />

          <Controller
            control={control}
            name="visibility"
            render={({ field }) => (
              <VisibilitySelect
                getVisibility={(val: BoardInput['visibility']) => field.onChange(val)}
                value={field.value}
              />
            )}
          />

          <div className="mt-8 flex gap-4">
            <Button onClick={() => setModalOpen(false)} variant="secondary" fullWidth>
              Cancel
            </Button>

            <Button
              className="gap-2"
              type="submit"
              loading={creatingBoard}
              variant="primary"
              fullWidth
            >
              <BiPlus className="text-base" />
              Create
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
