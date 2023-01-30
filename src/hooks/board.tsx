import { supabase } from '@lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Board, Card, Comment, List, UserProfile } from '@models/database';
import { createBoard, fetchBoards, getSingleBoard, updateBoard } from '@lib/api/board';
import { BoardInput, BoardUpdate } from '@models/board';
import { parseError } from '@lib/utils';

export const boardsQueryKeys = {
  all: () => ['boards'],
  board: (boardOwner: string, boardId: string) => ['board', { boardId, boardOwner }],
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

export function useCreateBoard() {
  const queryClient = useQueryClient();

  const { mutate, isLoading, ...mutationProps } = useMutation(
    (payload: BoardInput) => createBoard(payload),
    {
      onError(error) {
        const errorMessage = parseError(error);
        toast.error(errorMessage);
      },
      onSuccess() {
        queryClient.invalidateQueries(boardsQueryKeys.all());
      },
    }
  );

  return {
    createBoard: mutate,
    creatingBoard: isLoading,
    ...mutationProps,
  };
}

export function useFetchBoards() {
  const { data, error, ...result } = useQuery({
    queryKey: boardsQueryKeys.all(),
    queryFn: async () => fetchBoards(),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  });

  return {
    boards: data?.data.data,
    error: error ? parseError(error) : undefined,
    ...result,
  };
}

export function useGetSingleBoard(boardOwner: string, boardId: string) {
  const { data, error, ...queryResult } = useQuery({
    queryKey: boardsQueryKeys.board(boardOwner, boardId),
    queryFn: async () => getSingleBoard(boardOwner, boardId),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
    enabled: Boolean(boardId && boardOwner),
  });

  return {
    board: data?.data.data,
    error: error ? parseError(error) : undefined,
    ...queryResult,
  };
}

export function useUpdateBoard(boardOwner: string, boardId: string) {
  const queryClient = useQueryClient();

  const { mutate, isLoading, ...mutationResult } = useMutation(
    (payload: BoardUpdate) => updateBoard(boardId, payload),
    {
      onError(error) {
        const errorMessage = parseError(error);
        toast.error(errorMessage);
      },
      onSuccess() {
        toast.success('Board updated!');
        return queryClient.invalidateQueries(boardsQueryKeys.board(boardOwner, boardId));
      },
    }
  );

  return {
    updateBoard: mutate,
    updatingBoard: isLoading,
    ...mutationResult,
  };
}

export function useFetchBoardMembers(boardId: number, members: string[]) {
  return useQuery({
    queryKey: boardsQueryKeys.boardMembers(boardId, members.length),
    queryFn: async () => {
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
    enabled: Boolean(members && members?.length),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  });
}

export function useFetchBoardLists(boardId: number) {
  return useQuery({
    queryKey: boardsQueryKeys.boardLists(boardId),
    queryFn: async () => {
      const result = await supabase
        .from<List>('lists')
        .select()
        .match({ board_id: boardId })
        .order('position', { ascending: true });

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    enabled: Boolean(boardId),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  });
}

export function useFetchListCards(listId: number) {
  return useQuery({
    queryKey: boardsQueryKeys.boardListCards(listId),
    queryFn: async () => {
      const result = await supabase
        .from<Card>('cards')
        .select()
        .match({ list_id: listId })
        .order('position', { ascending: true });

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    enabled: Boolean(listId),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  });
}

export function useFetchCardInfo(cardId: number) {
  return useQuery({
    queryKey: boardsQueryKeys.card(cardId),
    queryFn: async () => {
      const result = await supabase
        .from<Card>('cards')
        .select()
        .match({ id: cardId })
        .single();

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    enabled: Boolean(cardId),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  });
}

export function useFetchCardComments(cardId: number) {
  return useQuery({
    queryKey: boardsQueryKeys.cardComments(cardId),
    queryFn: async () => {
      const result = await supabase
        .from<Comment>('comments')
        .select(`id, text, created_at, user(id, name, username, image_id, image_version)`)
        .match({ card_id: cardId })
        .order('created_at', { ascending: false });

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    enabled: Boolean(cardId),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  });
}
