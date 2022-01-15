import { UploadApiResponse } from 'cloudinary';

import { axiosClient } from '@lib/axios';
import { supabase } from '@lib/supabase';
import { Board, Card, List } from 'types/database';

export interface BoardInput {
  title: string;
  cover: string | undefined;
  image: string | undefined;
  visibility: 'public' | 'private';
}

export interface BoardUpdate {
  title: string;
  visibility: 'public' | 'private';
  members: string[];
}

export interface ListInput {
  title: string;
  board_id: number;
  user_id: string;
  position: number;
}

export interface CardInput {
  title: string;
  board_id: number;
  list_id: number;
  created_by: string;
  position: number;
}

export async function createBoard(input: BoardInput, userId: string) {
  if (!input.title || !userId) throw new Error(`Title and User ID are required`);

  const existingBoards = await supabase
    .from<Board>('boards')
    .select()
    .match({ owner: userId, title: input.title });

  if (existingBoards.body?.length)
    throw new Error(`Board with title "${input.title}" already exists`);

  let imageId: string | undefined;
  let imageVersion: string | undefined;

  if (input.image) {
    const boardTitle = input.title.toLowerCase().split(' ').join('_');
    const result = await axiosClient.post<UploadApiResponse>('/api/images/upload-url', {
      url: input.image,
      public_id: `${boardTitle}`,
    });

    imageId = result.data.public_id;
    imageVersion = 'v' + result.data.version;
  }

  const result = await supabase
    .from<Board>('boards')
    .insert({
      title: input.title,
      cover: input.cover,
      image_id: imageId,
      image_version: imageVersion,
      visibility: input.visibility as 'public' | 'private',
    })
    .single();

  if (result.error) throw result.error;

  return result.data;
}

export async function updateBoard(input: Partial<BoardUpdate>, boardId: number) {
  const result = await supabase
    .from<BoardUpdate>('boards')
    .update({ ...input })
    .match({ id: boardId })
    .single();

  if (result.error) throw result.error;

  return result.data as unknown as Board;
}

export async function createList(input: ListInput) {
  const existingList = await supabase
    .from<List>('lists')
    .select('title')
    .match({ title: input.title, board_id: input.board_id });

  if (existingList.data?.length) throw new Error('List already exists.');

  const result = await supabase
    .from<List>('lists')
    .insert({ ...input })
    .single();

  if (result.status === 401) await supabase.auth.signOut();
  if (result.error) throw result.error;

  return result.data;
}

export async function createCard(input: CardInput) {
  const result = await supabase
    .from<Card>('cards')
    .insert({ ...input })
    .single();

  if (result.status === 401) await supabase.auth.signOut();
  if (result.error) throw result.error;

  return result.data;
}

export async function renameList(title: string, listId: number) {
  const result = await supabase
    .from<List>('lists')
    .update({ title: title })
    .match({ id: listId })
    .single();

  if (result.status === 401) await supabase.auth.signOut();
  if (result.error) throw result.error;

  return result.data;
}

export async function deleteList(listId: number) {
  const result = await supabase.rpc('fn_delete_lists', { list_id: listId });

  if (result.status === 401) await supabase.auth.signOut();
  if (result.error) throw result.error;

  return result.data;
}

export type SortItemInput = Array<{ id: number; position: number }>;

export async function sortCards(input: SortItemInput) {
  const result = await supabase.rpc('fn_sort_cards', { fn_input: input });

  if (result.status === 401) await supabase.auth.signOut();
  if (result.error) throw result.error;

  return result.data;
}

export async function sortLists(input: SortItemInput) {
  const result = await supabase.rpc('fn_sort_lists', { fn_input: input });

  if (result.status === 401) await supabase.auth.signOut();
  if (result.error) throw result.error;

  return result.data;
}
