import * as React from 'react';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { IoSearch } from 'react-icons/io5';
import { useMutation, useQueryClient } from 'react-query';

import { Button } from '@components/common/Button';
import { CardCoverInput, updateCardCover } from '@lib/api/board';
import { usePexelsPhotos } from '@hooks/photos';
import { boardsQueryKeys } from '@hooks/board';
import { Card } from '../../../types/database';

interface CardLabelProps {
  cardId: number;
}

export function CardCover({ cardId }: CardLabelProps) {
  const queryClient = useQueryClient();
  const [imageInfo, setImageInfo] = React.useState({ url: '', id: '' });
  const [page, setPage] = React.useState(1);

  const photos = usePexelsPhotos(page);
  const updateCardCoverMutation = useMutation((data: CardCoverInput) =>
    updateCardCover(data)
  );

  if (photos.isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  if (photos.data?.error) {
    return (
      <p className="text-center">
        There was a problem with fetching photos from Pexels. Please try again.
      </p>
    );
  }

  const addCover = () => {
    if (!imageInfo) return;

    updateCardCoverMutation.mutate(
      {
        cardId,
        photoId: imageInfo.id,
        photoUrl: imageInfo.url,
      },
      {
        onSuccess: data => {
          queryClient.setQueryData<Card>(boardsQueryKeys.card(cardId), oldData => {
            if (oldData) {
              oldData.image_id = data.image_id;
              oldData.image_version = data.image_version;
            }
            return oldData as Card;
          });
        },
      }
    );
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        as={Button}
        className="block w-full justify-center rounded-lg bg-off-white px-4 py-2 text-xs text-gray3"
      >
        Cover
      </Menu.Button>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute top-0 left-0 w-56 rounded-lg border border-ash bg-white p-3 shadow">
          <h3 className="mb-1 text-sm text-gray-600">Photo Search</h3>
          <p className="text-xs text-gray-400">Search Pexels for photos</p>

          <form className="mt-4 flex items-center rounded-lg border border-slate-50 p-[1px] shadow">
            <input
              className="flex-1 py-2 pl-2 pr-1 text-xs text-gray-600 focus:outline-none"
              placeholder="Keywords..."
            />
            <Button
              className="flex-shrink-0 flex-grow-0 rounded-lg bg-corn-blue px-2 py-2 text-xs text-white"
              type="submit"
            >
              <IoSearch className="text-base" />
            </Button>
          </form>

          <div className="mt-6 grid grid-cols-4 gap-y-3 gap-x-2">
            {photos.data?.photos.map(photo => (
              <Button
                key={photo.url}
                className="relative h-10 cursor-pointer overflow-hidden rounded-lg hover:opacity-70 focus:ring-2 focus:ring-cyan-700 focus:ring-offset-1"
                onClick={() =>
                  setImageInfo({ id: String(photo.id), url: photo.src.landscape })
                }
              >
                <Image src={photo.src.large2x} layout="fill" alt="" unoptimized />
              </Button>
            ))}
          </div>

          <Button
            className="mx-auto mt-4 rounded-lg bg-corn-blue px-5 py-[0.4rem] text-xs text-white"
            onClick={addCover}
            disabled={updateCardCoverMutation.isLoading}
            loading={updateCardCoverMutation.isLoading}
          >
            Update
          </Button>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
