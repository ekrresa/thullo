import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { boardsQueryKeys } from '@hooks/board'
import { getBoardDetails, updateBoard } from '@lib/api/board'
import { parseError } from '@lib/utils'
import { BoardUpdate } from '@models/index'

export function useGetBoardDetails(ownerUsername: string, slug: string) {
  const { data, error, ...queryResult } = useQuery({
    queryKey: boardsQueryKeys.board(ownerUsername, slug),
    queryFn: async () => getBoardDetails(ownerUsername, slug),
    enabled: Boolean(ownerUsername && slug),
    staleTime: 300_000,
    select(response) {
      return response.data
    },
  })

  return {
    board: data,
    error: error ? parseError(error) : undefined,
    ...queryResult,
  }
}

interface BoardUpdateInput {
  boardId: string
  payload: BoardUpdate
}
export function useUpdateBoard(ownerUsername: string, slug: string) {
  const queryClient = useQueryClient()

  const { mutate, isLoading, ...mutationProps } = useMutation(
    ({ boardId, payload }: BoardUpdateInput) => updateBoard(boardId, payload),
    {
      async onMutate(newBoardData) {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: boardsQueryKeys.board(ownerUsername, slug),
        })

        // Snapshot the previous value
        const previousBoardData = queryClient.getQueryData(
          boardsQueryKeys.board(ownerUsername, slug)
        )

        // Optimistically update to the new value
        queryClient.setQueryData(
          boardsQueryKeys.board(ownerUsername, slug),
          (old: any) => ({
            ...old,
            ...newBoardData,
          })
        )

        return { previousBoardData }
      },
      onError(error, _, context) {
        queryClient.setQueryData(
          boardsQueryKeys.board(ownerUsername, slug),
          context?.previousBoardData
        )

        const errorMessage = parseError(error)
        toast.error(errorMessage)
      },
      onSuccess() {
        queryClient.invalidateQueries(boardsQueryKeys.board(ownerUsername, slug))
      },
    }
  )
  return {
    updateBoard: mutate,
    updatingBoard: isLoading,
    ...mutationProps,
  }
}
