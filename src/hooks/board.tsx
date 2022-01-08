import { supabase } from '@lib/supabase';
import { useQuery } from 'react-query';
import { Board } from 'types/database';

export const boardsQueryKeys = {
  all: () => ['boards', 'all'],
  board: (boardId: number) => ['boards', 'single', { boardId }],
};

const ONE_HOUR_IN_MILLISECONDS = 3600000;

export function useFetchBoards() {
  return useQuery(
    boardsQueryKeys.all(),
    async () => {
      const result = await supabase
        .from<Board>('boards')
        .select(
          `id, title, cover, image_id, image_version, visibility, owner (name, username, image_id, image_version)`
        )
        .order('updated_at', { ascending: false });

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    { staleTime: ONE_HOUR_IN_MILLISECONDS }
  );
}

export function useFetchSingleBoard(boardId: number) {
  return useQuery(
    boardsQueryKeys.board(boardId),
    async () => {
      const result = await supabase
        .from<Board>('boards')
        .select(
          `id, title, cover, image_id, image_version, visibility, created_at, updated_at, owner (name, username, image_id, image_version)`
        )
        .match({ id: boardId })
        .single();

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    { enabled: Boolean(boardId), staleTime: ONE_HOUR_IN_MILLISECONDS }
  );
}
