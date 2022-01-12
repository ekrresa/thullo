import { supabase } from '@lib/supabase';
import { useQuery } from 'react-query';
import { Board, Card, List } from 'types/database';

export const boardsQueryKeys = {
  all: () => ['boards', 'all'],
  board: (boardId: number) => ['boards', { boardId }],
  boardLists: (boardId: number) => ['boards', 'lists', { boardId }],
  boardListCards: (listId: number) => ['boards', 'lists', 'cards', { listId }],
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

export function useFetchBoardLists(boardId: number) {
  return useQuery(
    boardsQueryKeys.boardLists(boardId),
    async () => {
      const result = await supabase
        .from<List>('lists')
        .select()
        .match({ board_id: boardId })
        .order('position', { ascending: true });

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    { enabled: Boolean(boardId), staleTime: ONE_HOUR_IN_MILLISECONDS }
  );
}

export function useFetchListCards(listId: number) {
  return useQuery(
    boardsQueryKeys.boardListCards(listId),
    async () => {
      const result = await supabase
        .from<Card>('cards')
        .select()
        .match({ list_id: listId })
        .order('position', { ascending: true });

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    { enabled: Boolean(listId), staleTime: ONE_HOUR_IN_MILLISECONDS }
  );
}
