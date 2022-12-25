import * as React from 'react';
import Image from "next/legacy/image";
import { IoIosArrowBack } from 'react-icons/io';

import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import { PhotosGallery } from './PhotosGallery';
import { ColorsGallery } from './ColorsGallery';

interface ImageWidgetProps {
  isOpen: boolean;
  closeHandler: () => void;
  selectCover: (input: string) => void;
  selectImage: (input: string) => void;
}

type ImageWidgetView = 'none' | 'photos' | 'colors';

export function ImageWidget({
  isOpen,
  closeHandler,
  selectCover,
  selectImage,
}: ImageWidgetProps) {
  const [view, setView] = React.useState<ImageWidgetView>('none');

  const title =
    view === 'none'
      ? 'Choose Cover Image'
      : view === 'photos'
      ? 'Photos by Pexels'
      : view === 'colors' && 'Colors';

  return (
    <Modal
      className="max-w-[26rem] overflow-visible"
      isOpen={isOpen}
      closeModal={closeHandler}
      closeIcon
    >
      <h2 className="relative flex justify-center mb-8 font-medium">
        {view !== 'none' && (
          <Button className="absolute left-0 -top-[2%]" onClick={() => setView('none')}>
            <IoIosArrowBack className="text-2xl" />
          </Button>
        )}
        {title}
      </h2>
      {view === 'none' ? (
        <div className="flex space-x-6">
          <div className="flex-1">
            {/* Photo by Taryn Elliott from Pexels https://www.pexels.com/photo/white-and-black-picture-frame-4340919/ */}
            <Button
              className="relative w-full h-40 overflow-hidden rounded-lg"
              onClick={() => setView('photos')}
            >
              <Image src="/photo-cover.jpg" layout="fill" unoptimized alt="" />
            </Button>
            <h3 className="mt-2 text-sm text-center">Photos</h3>
          </div>

          <div className="flex-1">
            <Button
              className="relative w-full h-40 overflow-hidden rounded-lg"
              onClick={() => setView('colors')}
            >
              <Image src="/palette.jpg" layout="fill" unoptimized alt="" />
            </Button>
            <h3 className="mt-2 text-sm text-center">Colors</h3>
          </div>
        </div>
      ) : view === 'photos' ? (
        <PhotosGallery selectImage={selectImage} />
      ) : (
        view === 'colors' && <ColorsGallery selectCover={selectCover} />
      )}
    </Modal>
  );
}
