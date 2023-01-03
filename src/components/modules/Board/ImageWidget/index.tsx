import * as React from 'react';
import Image from 'next/image';
import { BsImage } from 'react-icons/bs';
import { IoIosArrowBack } from 'react-icons/io';

import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import { PhotosGallery } from './PhotosGallery';
import { ColorsGallery } from './ColorsGallery';

interface ImageWidgetProps {
  selectCover: (input: string) => void;
  selectImage: (input: string) => void;
}

type ImageWidgetView = 'none' | 'pictures' | 'colors';

export function ImageWidget({ selectCover, selectImage }: ImageWidgetProps) {
  const [view, setView] = React.useState<ImageWidgetView>('none');

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
          className="mb-4 bg-gray-50 px-12 py-2.5 text-gray3 shadow-sm hover:bg-astronaut-100"
          variant="secondary"
          fullWidth
        >
          <BsImage className="mr-2" />
          Choose Board Cover
        </Button>
      }
      closeIcon
    >
      <h2 className="relative mb-8 flex justify-center font-medium">
        {view !== 'none' && (
          <Button className="absolute left-0 -top-[2%]" onClick={() => setView('none')}>
            <IoIosArrowBack className="text-2xl" />
          </Button>
        )}
        {title}
      </h2>

      {view === 'none' && (
        <div className="flex space-x-6">
          <div className="flex-1">
            {/* Photo by Taryn Elliott from Pexels https://www.pexels.com/photo/white-and-black-picture-frame-4340919/ */}
            <Button
              className="relative h-40 w-full overflow-hidden rounded-lg"
              onClick={() => setView('pictures')}
            >
              <Image src="/photo-cover.jpg" alt="Picture cover" fill unoptimized />
            </Button>
            <h3 className="mt-2 text-center text-sm">Pictures</h3>
          </div>

          <div className="flex-1">
            <Button
              className="relative h-40 w-full overflow-hidden rounded-lg"
              onClick={() => setView('colors')}
            >
              <Image src="/palette.jpg" alt="Color cover" fill unoptimized />
            </Button>
            <h3 className="mt-2 text-center text-sm">Colors</h3>
          </div>
        </div>
      )}

      {view === 'pictures' && <PhotosGallery selectImage={selectImage} />}

      {view === 'colors' && <ColorsGallery selectCover={selectCover} />}
    </Modal>
  );
}
