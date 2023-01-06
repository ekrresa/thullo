import * as React from 'react';
import Image from 'next/image';
import { Controller, useFormContext } from 'react-hook-form';
import { BsImage } from 'react-icons/bs';
import { IoIosArrowBack } from 'react-icons/io';

import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import { PhotosGallery } from './PhotosGallery';
import { ColorsGallery } from './ColorsGallery';
import { BoardInput } from '@models/board';
import { FileUpload } from './FileUpload';

type ImageWidgetView = 'none' | 'pictures' | 'colors';

export function BoardCoverWidget() {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [view, setView] = React.useState<ImageWidgetView>('none');

  const { control } = useFormContext<BoardInput>();

  const title =
    view === 'none'
      ? 'Choose Cover'
      : view === 'pictures'
      ? 'Pictures by Pexels'
      : view === 'colors' && 'Colors';

  return (
    <Modal
      className="max-w-[26rem] overflow-visible"
      trigger={
        <Button
          className="mb-4 mt-6 bg-gray-50 px-12 py-2.5 text-slate-500 shadow-sm hover:bg-astronaut-100"
          variant="secondary"
          fullWidth
        >
          <BsImage className="mr-2" />
          Choose Board Cover
        </Button>
      }
      open={isModalOpen}
      onOpenChange={modalStatus => {
        setModalOpen(modalStatus);
        if (!modalStatus) {
          setView('none');
        }
      }}
      closeIcon
    >
      <div className="relative mb-8 flex justify-center font-medium">
        {view !== 'none' && (
          <Button
            className="absolute left-0 -top-0.5 flex h-8 w-8 items-center justify-center rounded-full p-0 hover:bg-slate-100"
            onClick={() => setView('none')}
          >
            <IoIosArrowBack className="text-2xl" />
          </Button>
        )}

        <h2 className="text-lg font-medium">{title}</h2>
      </div>

      {view === 'none' && (
        <div className="flex flex-wrap gap-4">
          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <FileUpload
                selectFile={fileString => {
                  field.onChange(fileString);
                  setModalOpen(false);
                  setView('none');
                }}
              />
            )}
          />

          <div className="min-w-[200px] flex-1">
            {/* Photo by Taryn Elliott from Pexels https://www.pexels.com/photo/white-and-black-picture-frame-4340919/ */}
            <Button
              className="relative h-40 w-full overflow-hidden rounded-lg"
              onClick={() => setView('pictures')}
            >
              <Image src="/photo-cover.jpg" alt="Picture cover" fill unoptimized />
            </Button>
            <h3 className="mt-2 text-center text-sm">Choose a Picture</h3>
          </div>

          <div className="min-w-[200px] flex-1">
            <Button
              className="relative h-40 w-full overflow-hidden rounded-lg"
              onClick={() => setView('colors')}
            >
              <Image src="/palette.jpg" alt="Color cover" fill unoptimized />
            </Button>
            <h3 className="mt-2 text-center text-sm">Choose a Color</h3>
          </div>
        </div>
      )}

      {view === 'pictures' && (
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <PhotosGallery
              selectImage={url => {
                field.onChange(url);
                setModalOpen(false);
                setView('none');
              }}
            />
          )}
        />
      )}

      {view === 'colors' && (
        <Controller
          control={control}
          name="cover"
          render={({ field }) => (
            <ColorsGallery
              selectCover={color => {
                field.onChange(color);
                setModalOpen(false);
                setView('none');
              }}
            />
          )}
        />
      )}
    </Modal>
  );
}
