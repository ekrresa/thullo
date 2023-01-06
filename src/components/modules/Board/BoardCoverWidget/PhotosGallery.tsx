import * as React from 'react';
import Image from 'next/image';

import { usePexelsPhotos } from '@hooks/photos';
import { Button } from '@components/common/Button';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { LoaderWrapper } from '@components/LoaderWrapper';
import { cn } from '@lib/utils';

interface PhotosGalleryProps {
  selectImage: (input: string) => void;
}
export function PhotosGallery(props: PhotosGalleryProps) {
  const { selectImage } = props;

  const [page, setPage] = React.useState(1);
  const photos = usePexelsPhotos(page);

  return (
    <LoaderWrapper
      loading={photos.isLoading}
      errorMessage={
        photos.error
          ? 'There was a problem with fetching pictures from Pexels. Please try again.'
          : undefined
      }
      loaderContent={
        <div className="grid grid-cols-colors gap-2">
          {Array(8)
            .fill(true)
            .map((_, index) => (
              <EmptyTile key={index} />
            ))}
        </div>
      }
      onRetryClick={photos.refetch}
    >
      <div className="grid grid-cols-colors gap-2">
        {photos.data?.photos.map(photo => (
          <Button
            key={photo.url}
            className={cn(
              'relative h-28 cursor-pointer overflow-hidden rounded-lg p-0 hover:opacity-70'
            )}
            onClick={() => selectImage(photo.src.landscape)}
            disabled={photos.isFetching}
          >
            <Image src={photo.src.large2x} alt="" fill unoptimized />
          </Button>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <Button
          className="flex h-10 w-10 items-center justify-center rounded-full border bg-slate-50 p-0 shadow-sm"
          onClick={() => {
            setPage(page => page - 1);
          }}
          disabled={page === 1}
        >
          <BiLeftArrow className="text-slate-500" />
        </Button>

        <Button
          className="flex h-10 w-10 items-center justify-center rounded-full border bg-slate-50 p-0 shadow-sm"
          onClick={() => {
            setPage(page => page + 1);
          }}
        >
          <BiRightArrow className="text-slate-500" />
        </Button>
      </div>
    </LoaderWrapper>
  );
}

function EmptyTile() {
  return (
    <div className="relative h-28 animate-pulse overflow-hidden rounded-lg bg-slate-200 shadow-none"></div>
  );
}
