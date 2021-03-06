import { supabase } from '@lib/supabase';
import { useQuery } from 'react-query';
import { Board, Card, Comment, List, UserProfile } from 'types/database';

export const boardsQueryKeys = {
  all: () => ['boards', 'all'],
  board: (boardId: number) => ['board', { boardId }],
  boardMembers: (boardId: number, numOfMembers: number) => [
    'board',
    'members',
    { boardId, numOfMembers },
  ],
  boardLists: (boardId: number) => ['board', 'lists', { boardId }],
  boardListCards: (listId: number) => ['board', 'lists', 'cards', { listId }],
  card: (cardId: number) => ['list', 'card', { cardId }],
  cardComments: (cardId: number) => ['card', 'comments', { cardId }],
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
          `id, title, cover, description, image_id, image_version, visibility, created_at, updated_at, members, owner (id, name, username, image_id, image_version)`
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

export function useFetchBoardMembers(boardId: number, members: string[]) {
  return useQuery(
    boardsQueryKeys.boardMembers(boardId, members.length),
    async () => {
      const boardMembersP = members.map(async userId => {
        const result = await supabase
          .from<UserProfile>('profiles')
          .select()
          .match({ id: userId })
          .single();

        if (result.status === 401) await supabase.auth.signOut();
        if (result.error) throw result.error;

        return result.data;
      });

      return await Promise.all(boardMembersP);
    },
    { enabled: Boolean(members && members?.length), staleTime: ONE_HOUR_IN_MILLISECONDS }
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

export function useFetchCardInfo(cardId: number) {
  return useQuery(
    boardsQueryKeys.card(cardId),
    async () => {
      const result = await supabase
        .from<Card>('cards')
        .select()
        .match({ id: cardId })
        .single();

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    {
      enabled: Boolean(cardId),
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }
  );
}

export function useFetchCardComments(cardId: number) {
  return useQuery(
    boardsQueryKeys.cardComments(cardId),
    async () => {
      const result = await supabase
        .from<Comment>('comments')
        .select(`id, text, created_at, user(id, name, username, image_id, image_version)`)
        .match({ card_id: cardId })
        .order('created_at', { ascending: false });

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    {
      enabled: Boolean(cardId),
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }
  );
}
