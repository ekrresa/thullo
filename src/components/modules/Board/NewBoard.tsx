import * as React from 'react';
import Image from 'next/image';
import { useFormik } from 'formik';
import { BiPlus } from 'react-icons/bi';
import { BsImage } from 'react-icons/bs';
import { IoMdLock } from 'react-icons/io';

import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import { Dropdown } from '@components/common/Dropdown';
import { ImageWidget } from './ImageWidget';

export function NewBoard() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isWidgetOpen, setWidgetOpen] = React.useState(false);
  const formik = useFormik({
    initialValues: { image: null, cover: '', title: '' },
    onSubmit: () => {},
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
            }}
            selectImage={(image: string) => {
              formik.setFieldValue('image', image);
              formik.setFieldValue('cover', null);
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
            className="w-full px-3 py-3 mt-4 text-xs bg-white border rounded-lg shadow-lg border-ash focus:outline-none text-light-pencil"
            id="title"
            onChange={formik.handleChange}
            placeholder="Add board title"
          />
          <div className="flex justify-between mt-6">
            <Button
              className="flex items-center px-12 py-3 text-xs bg-gray-100 rounded-lg text-gray3"
              onClick={() => setWidgetOpen(true)}
            >
              <BsImage className="mr-2" />
              Cover
            </Button>

            <Button className="flex items-center px-12 py-3 text-xs bg-gray-100 rounded-lg text-gray3">
              <IoMdLock className="mr-2" />
              Private
            </Button>
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
