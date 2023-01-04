import * as React from 'react';
import Image from 'next/legacy/image';

import { usePexelsPhotos } from '@hooks/photos';
import { Button } from '@components/common/Button';

interface PhotosGalleryProps {
  selectImage: (input: string) => void;
}

// TODO: Add next or random display of pictures functionality
export function PhotosGallery({ selectImage }: PhotosGalleryProps) {
  const [page, setPage] = React.useState(1);
  const photos = usePexelsPhotos(page);

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

  return (
    <div className="grid grid-cols-colors gap-2">
      {photos.data?.photos.map(photo => (
        <Button
          key={photo.url}
          className="relative h-28 cursor-pointer overflow-hidden rounded-lg hover:opacity-70 focus:ring-2 focus:ring-cyan-700 focus:ring-offset-1"
          onClick={() => selectImage(photo.src.landscape)}
        >
          <Image src={photo.src.large2x} layout="fill" alt="" unoptimized />
        </Button>
      ))}
    </div>
  );
}
