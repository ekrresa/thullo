import { supabase } from '@lib/supabase';
import { useQuery } from 'react-query';
import { Board } from 'types/database';

export const boardsQueryKeys = {
  all: () => ['boards', 'all'],
};

const ONE_HOUR_IN_MILLISECONDS = 3600000;

export function useFetchBoards() {
  return useQuery(
    boardsQueryKeys.all(),
    async () =>
      supabase
        .from<Board>('boards')
        .select(
          `id, title, cover, image_id, image_version, visibility, owner (name, username, image_id, image_version)`
        )
        .order('updated_at', { ascending: false }),
    { staleTime: ONE_HOUR_IN_MILLISECONDS }
  );
}
