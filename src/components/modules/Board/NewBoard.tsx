import * as React from 'react';
import Image from "next/legacy/image";
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
    <>
      <Button
        className="flex items-center px-3 py-2 text-xs text-white rounded-lg bg-corn-blue"
        onClick={() => setIsOpen(true)}
      >
        <BiPlus className="mr-2 text-sm" />
        Add
      </Button>

      <Modal
        isOpen={isOpen}
        className="max-w-md overflow-visible"
        closeModal={() => setIsOpen(false)}
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

          <div className="relative overflow-hidden bg-gray-200 rounded-lg h-36">
            {boardImage ? (
              <Image src={boardImage} layout="fill" alt="" />
            ) : boardCover ? (
              <div
                style={{ backgroundColor: boardCover }}
                className="w-full h-full"
              ></div>
            ) : null}
          </div>

          <input
            className="w-full px-3 py-3 mt-4 text-xs bg-white border rounded-lg shadow-lg border-ash focus:outline-none text-pencil"
            id="title"
            onChange={formik.handleChange}
            placeholder="Add board title"
          />
          <div className="flex items-center justify-between mt-6">
            <Button
              className="flex items-center px-12 py-3 text-xs bg-gray-100 rounded-lg text-gray3"
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

          <div className="flex justify-end mt-8">
            <Button
              className="rounded-lg px-3 py-3 text-[0.625rem] text-gray3 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className="bg-corn-blue flex items-center ml-4 rounded-lg px-3 py-3 text-[0.625rem] text-white"
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
    </>
  );
}
