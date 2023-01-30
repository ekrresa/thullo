import { UploadApiResponse } from 'cloudinary'

import { request } from '@lib/request'
import { supabase } from '@lib/supabase'
import { BaseResponse } from '@models/app'
import {
  BoardInput,
  BoardListWithMembers,
  BoardUpdate,
  BoardWithMembers,
} from '@models/board'
import { Card, List } from '@models/database'

export interface ListInput {
  title: string
  board_id: number
  user_id: string
  position: number
}

export interface CardInput {
  title: string
  board_id: number
  list_id: number
  created_by: string
  position: number
  description?: string
  image_id?: string
  image_version?: string
}

export async function createBoard(input: BoardInput) {
  return request.post('/api/boards', input)
}

export async function fetchBoards() {
  return request.get<BaseResponse<BoardListWithMembers[]>>('/api/boards')
}

export async function getSingleBoard(boardOwner: string, boardId: string) {
  return request.get<BaseResponse<BoardWithMembers>>(
    `/api/boards/${boardOwner}/${boardId}`
  )
}

export async function updateBoard(boardId: string, input: BoardUpdate) {
  return request.put(`/api/boards/${boardId}`, input)
}

export async function createList(input: ListInput) {
  const existingList = await supabase
    .from<List>('lists')
    .select('title')
    .match({ title: input.title, board_id: input.board_id })

  if (existingList.data?.length) throw new Error('List already exists.')

  const result = await supabase
    .from<List>('lists')
    .insert({ ...input })
    .single()

  if (result.status === 401) await supabase.auth.signOut()
  if (result.error) throw result.error

  return result.data
}

export async function createCard(input: CardInput) {
  const result = await supabase
    .from<Card>('cards')
    .insert({ ...input })
    .single()

  if (result.status === 401) await supabase.auth.signOut()
  if (result.error) throw result.error

  return result.data
}

export async function renameList(title: string, listId: number) {
  const result = await supabase
    .from<List>('lists')
    .update({ title: title })
    .match({ id: listId })
    .single()

  if (result.status === 401) await supabase.auth.signOut()
  if (result.error) throw result.error

  return result.data
}

export async function deleteList(listId: number) {
  const result = await supabase.rpc('fn_delete_lists', { list_id: listId })

  if (result.status === 401) await supabase.auth.signOut()
  if (result.error) throw result.error

  return result.data
}

export type SortItemInput = Array<{ id: number; position: number }>

export async function sortCards(input: SortItemInput) {
  const result = await supabase.rpc('fn_sort_cards', { fn_input: input })

  if (result.status === 401) await supabase.auth.signOut()
  if (result.error) throw result.error

  return result.data
}

export async function sortLists(input: SortItemInput) {
  const result = await supabase.rpc('fn_sort_lists', { fn_input: input })

  if (result.status === 401) await supabase.auth.signOut()
  if (result.error) throw result.error

  return result.data
}

export async function updateCard(input: Partial<CardInput>, cardId: number) {
  const result = await supabase
    .from<Card>('cards')
    .update({ ...input })
    .match({ id: cardId })
    .single()

  if (result.status === 401) await supabase.auth.signOut()
  if (result.error) throw result.error

  return result.data
}

export interface CommentInput {
  text: string
  card_id: number
  board_id: number
  user: string
}

export async function addComment(input: CommentInput) {
  const result = await supabase
    .from('comments')
    .insert({ ...input })
    .single()

  if (result.status === 401) await supabase.auth.signOut()
  if (result.error) throw result.error

  return result.data
}

export interface CardCoverInput {
  photoUrl: string
  photoId: string
  cardId: number
}

export async function updateCardCover({ cardId, photoId, photoUrl }: CardCoverInput) {
  const result = await request.post<UploadApiResponse>('/api/images/upload-url', {
    url: photoUrl,
    public_id: photoId,
  })

  return await updateCard(
    {
      image_id: result.data.public_id,
      image_version: 'v' + result.data.version,
    },
    cardId
  )
}
