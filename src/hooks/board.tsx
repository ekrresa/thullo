import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { createBoard, fetchBoards } from '@lib/api/board'
import { supabase } from '@lib/supabase'
import { parseError } from '@lib/utils'
import { BoardCreateInput } from '@models/board'
import { Card, Comment, List, UserProfile } from '@models/database'

export const boardsQueryKeys = {
  all: () => ['boards'],
  board: (ownerUsername: string, slug: string) => ['board', { slug, ownerUsername }],
  boardMembers: (boardId: number, numOfMembers: number) => [
    'board',
    'members',
    { boardId, numOfMembers },
  ],
  boardLists: (boardId: number) => ['board', 'lists', { boardId }],
  boardListCards: (listId: number) => ['board', 'lists', 'cards', { listId }],
  card: (cardId: number) => ['list', 'card', { cardId }],
  cardComments: (cardId: number) => ['card', 'comments', { cardId }],
}

const ONE_HOUR_IN_MILLISECONDS = 3600000

export function useCreateBoard() {
  const queryClient = useQueryClient()

  const { mutate, isLoading, ...mutationProps } = useMutation(
    (payload: BoardCreateInput) => createBoard(payload),
    {
      onError(error) {
        const errorMessage = parseError(error)
        toast.error(errorMessage)
      },
      onSuccess() {
        queryClient.invalidateQueries(boardsQueryKeys.all())
      },
    }
  )

  return {
    createBoard: mutate,
    creatingBoard: isLoading,
    ...mutationProps,
  }
}

export function useFetchBoards() {
  const { data, error, ...result } = useQuery({
    queryKey: boardsQueryKeys.all(),
    queryFn: async () => fetchBoards(),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  })

  return {
    boards: data?.data.data,
    error: error ? parseError(error) : undefined,
    ...result,
  }
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
          .single()

        if (result.status === 401) await supabase.auth.signOut()
        if (result.error) throw result.error

        return result.data
      })

      return await Promise.all(boardMembersP)
    },
    enabled: Boolean(members && members?.length),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  })
}

export function useFetchBoardLists(boardId: number) {
  return useQuery({
    queryKey: boardsQueryKeys.boardLists(boardId),
    queryFn: async () => {
      const result = await supabase
        .from<List>('lists')
        .select()
        .match({ board_id: boardId })
        .order('position', { ascending: true })

      if (result.status === 401) await supabase.auth.signOut()
      if (result.error) throw result.error

      return result.data
    },
    enabled: Boolean(boardId),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  })
}

export function useFetchListCards(listId: number) {
  return useQuery({
    queryKey: boardsQueryKeys.boardListCards(listId),
    queryFn: async () => {
      const result = await supabase
        .from<Card>('cards')
        .select()
        .match({ list_id: listId })
        .order('position', { ascending: true })

      if (result.status === 401) await supabase.auth.signOut()
      if (result.error) throw result.error

      return result.data
    },
    enabled: Boolean(listId),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  })
}

export function useFetchCardInfo(cardId: number) {
  return useQuery({
    queryKey: boardsQueryKeys.card(cardId),
    queryFn: async () => {
      const result = await supabase
        .from<Card>('cards')
        .select()
        .match({ id: cardId })
        .single()

      if (result.status === 401) await supabase.auth.signOut()
      if (result.error) throw result.error

      return result.data
    },
    enabled: Boolean(cardId),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  })
}

export function useFetchCardComments(cardId: number) {
  return useQuery({
    queryKey: boardsQueryKeys.cardComments(cardId),
    queryFn: async () => {
      const result = await supabase
        .from<Comment>('comments')
        .select(`id, text, created_at, user(id, name, username, image_id, image_version)`)
        .match({ card_id: cardId })
        .order('created_at', { ascending: false })

      if (result.status === 401) await supabase.auth.signOut()
      if (result.error) throw result.error

      return result.data
    },
    enabled: Boolean(cardId),
    staleTime: ONE_HOUR_IN_MILLISECONDS,
  })
}
