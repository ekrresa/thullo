import * as React from 'react';
import Image from 'next/image';

import { usePexelsPhotos } from '@hooks/photos';
import { Button } from '@components/common/Button';

interface PhotosGalleryProps {
  selectImage: (input: string) => void;
}

export function PhotosGallery({ selectImage }: PhotosGalleryProps) {
  const [page, setPage] = React.useState(1);
  const photos = usePexelsPhotos(page);

  if (photos.isLoading) {
    return <div className="">Loading...</div>;
  }

  if (photos.data?.error) {
    return (
      <div className="">
        There was a problem with fetching photos from Pexels. Please try again.
      </div>
    );
  }

  return (
    <div className="grid gap-2 grid-cols-colors">
      {photos.data?.photos.map(photo => (
        <Button
          key={photo.url}
          className="relative overflow-hidden rounded-lg cursor-pointer h-28 hover:opacity-70 focus:ring-offset-1 focus:ring-2 focus:ring-cyan-700"
          onClick={() => selectImage(photo.src.large2x)}
        >
          <Image src={photo.src.large2x} layout="fill" alt="" unoptimized />
        </Button>
      ))}
    </div>
  );
}
