import * as React from 'react';
import Image from 'next/image';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { BiPlus } from 'react-icons/bi';
import { zodResolver } from '@hookform/resolvers/zod';

import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import { ImageWidget } from './ImageWidget';
import { VisibilitySelect } from './VisibilitySelect';
import { useCreateBoard } from '@hooks/board';
import { Input } from '@components/common/Input';
import { BoardCreateSchema, BoardInput } from '@models/board';
import { toast } from 'react-hot-toast';

export function NewBoard() {
  const [isModalOpen, setModalOpen] = React.useState(false);

  const { createBoard, creatingBoard } = useCreateBoard();

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

    createBoard(values);
  };

  const { control, register, handleSubmit, watch } = formMethods;

  const boardCover = watch('cover');
  const boardImage = watch('image');

  return (
    <Modal
      trigger={
        <Button className="flex items-center rounded-lg bg-corn-blue px-3 py-2 text-xs text-white">
          <BiPlus className="mr-2 text-sm" />
          Add
        </Button>
      }
      className="max-w-md overflow-visible"
      open={isModalOpen}
      onOpenChange={modalStatus => setModalOpen(modalStatus)}
      closeIcon
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onBoardFormSubmit)}>
          <div className="relative h-36 overflow-hidden rounded-lg bg-gray-200">
            {boardImage && (
              <Image className="object-cover" src={boardImage} alt="board cover" fill />
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

          <ImageWidget />

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
