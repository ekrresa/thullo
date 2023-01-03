import * as React from 'react';
import Image from 'next/legacy/image';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BiPlus } from 'react-icons/bi';
import { BsImage } from 'react-icons/bs';
import toast from 'react-hot-toast';

import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import { ImageWidget } from './ImageWidget';
import { VisibilitySelect } from './VisibilitySelect';
import { useUserProfile } from '@hooks/user';
import { BoardInput, createBoard } from '@lib/api/board';
import { boardsQueryKeys } from '@hooks/board';
import { Input } from '@components/common/Input';

export function NewBoard() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isWidgetOpen, setWidgetOpen] = React.useState(false);
  const user = useUserProfile();
  const queryClient = useQueryClient();
  const newBoardMutation = useMutation((data: BoardInput) =>
    createBoard(data, user.data?.id as string)
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
            setIsOpen(false);
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
      closeIcon
    >
      <form onSubmit={formik.handleSubmit}>
        {/* Modal to select online images and colors */}
        <ImageWidget
          isOpen={isWidgetOpen}
          closeHandler={() => setWidgetOpen(false)}
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
          <Button
            className="flex items-center rounded-lg border border-slate-300 bg-gray-50 px-12 py-3 text-xs text-gray3 shadow-sm"
            onClick={() => setWidgetOpen(true)}
          >
            <BsImage className="mr-2" />
            Cover
          </Button>

          <VisibilitySelect
            getVisibility={(val: any) => formik.setFieldValue('visibility', val)}
            value={formik.values.visibility}
          />
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            className="rounded-lg border px-3 py-3 text-xs text-gray3 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button
            className="ml-4 flex items-center rounded-lg bg-corn-blue px-3 py-3 text-xs text-white"
            type="submit"
            disabled={newBoardMutation.isLoading}
            loading={newBoardMutation.isLoading}
          >
            <BiPlus className="mr-2 text-sm" />
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}
