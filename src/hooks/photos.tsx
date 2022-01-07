import { ErrorResponse, pexelsClient, Photos } from '@lib/pexels';
import { useQuery } from 'react-query';

export const pexelsPhotosQueryKeys = {
  photos: (page: number) => ['pexels', 'photos', { page }],
};

const ONE_HOUR_IN_MILLISECONDS = 3600000;

export function usePexelsPhotos(page: number) {
  return useQuery(
    pexelsPhotosQueryKeys.photos(page),
    async () => {
      return (await pexelsClient.photos.search({
        query: 'nature',
        page,
        per_page: 9,
      })) as Photos & ErrorResponse;
    },
    { staleTime: ONE_HOUR_IN_MILLISECONDS }
  );
}
