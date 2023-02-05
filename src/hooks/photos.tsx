import { useQuery } from '@tanstack/react-query';
import { ErrorResponse, pexelsClient, Photos } from '@lib/pexels';

export const pexelsPhotosQueryKeys = {
  photos: (page: number) => ['pexels', 'photos', { page }],
};

const ONE_HOUR_IN_MILLISECONDS = 3600000;

export function usePexelsPhotos(page: number) {
  return useQuery({
    queryKey: pexelsPhotosQueryKeys.photos(page),
    queryFn: async () => {
      return (await pexelsClient.photos.search({
        query: 'landscape',
        orientation: 'landscape',
        page,
        per_page: 8,
      })) as Photos & ErrorResponse;
    },
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  });
}
