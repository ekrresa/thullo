import * as React from 'react';
import Image from 'next/legacy/image';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BiPlus } from 'react-icons/bi';
import toast from 'react-hot-toast';

import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import { ImageWidget } from './ImageWidget';
import { VisibilitySelect } from './VisibilitySelect';
import { useGetCurrentUser } from '@hooks/user';
import { BoardInput, createBoard } from '@lib/api/board';
import { boardsQueryKeys } from '@hooks/board';
import { Input } from '@components/common/Input';

export function NewBoard() {
  const [isModalOpen, setModalOpen] = React.useState(false);

  const userProfile = useGetCurrentUser();
  const queryClient = useQueryClient();
  const newBoardMutation = useMutation((data: BoardInput) =>
    createBoard(data, userProfile?.id as string)
  );

  const formik = useFormik({
    initialValues: {
      image: undefined,
      cover: undefined,
      title: '',
      visibility: 'public',
    },
    onSubmit: async values => {
      newBoardMutation.mutate(
        {
          title: values.title,
          image: values.image,
          cover: values.cover,
          visibility: values.visibility as 'public' | 'private',
        },
        {
          onError: (error: any) => {
            toast.error(error.message);
          },
          onSuccess: async () => {
            toast.success('Board created!');
            await queryClient.invalidateQueries(boardsQueryKeys.all());
            setModalOpen(false);
          },
        }
      );
    },
  });

  const boardCover = formik.values.cover || null;
  const boardImage = formik.values.image || null;

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
      <form onSubmit={formik.handleSubmit}>
        {/* Modal to select online images and colors */}

        <div className="relative h-36 overflow-hidden rounded-lg bg-gray-200">
          {boardImage ? (
            <Image src={boardImage} layout="fill" alt="" />
          ) : boardCover ? (
            <div style={{ backgroundColor: boardCover }} className="h-full w-full"></div>
          ) : null}
        </div>

        <Input
          label="Board Title"
          className="mt-4 w-full rounded-lg border border-ash bg-white px-3 py-3 text-xs text-pencil drop-shadow-xl focus:outline-none"
          id="title"
          onChange={formik.handleChange}
          placeholder="Add board title"
          labelHidden
        />

        <div className="mt-6 flex items-center justify-between">
          <ImageWidget
            selectCover={(cover: string) => {
              formik.setFieldValue('cover', cover);
              formik.setFieldValue('image', null);
              toast.success('Color selected!');
            }}
            selectImage={(image: string) => {
              formik.setFieldValue('image', image);
              formik.setFieldValue('cover', null);
              toast.success('Image selected!');
            }}
          />
        </div>

        <VisibilitySelect
          getVisibility={(val: any) => formik.setFieldValue('visibility', val)}
          value={formik.values.visibility}
        />

        <div className="mt-8 flex gap-4">
          <Button onClick={() => setModalOpen(false)} variant="secondary" fullWidth>
            Cancel
          </Button>

          <Button
            className="gap-2"
            type="submit"
            disabled={newBoardMutation.isLoading}
            loading={newBoardMutation.isLoading}
            variant="primary"
            fullWidth
          >
            <BiPlus className="text-base" />
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}
