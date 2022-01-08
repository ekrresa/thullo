import { UploadApiResponse } from 'cloudinary';

import { axiosClient } from '@lib/axios';
import { supabase } from '@lib/supabase';
import { Board } from 'types/database';

export interface BoardInput {
  title: string;
  cover: string | undefined;
  image: string | undefined;
  visibility: 'public' | 'private';
}

export interface BoardUpdate {
  title: string;
  visibility: 'public' | 'private';
}

export async function createBoard(input: BoardInput, userId: string) {
  if (!input.title && userId) {
    throw new Error(`Title and User ID are required`);
  }

  const existingBoards = await supabase
    .from<Board>('boards')
    .select()
    .match({ owner: userId, title: input.title });

  if (existingBoards.body?.length) {
    throw new Error(`Board with title "${input.title}" already exists`);
  }

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

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function updateBoard(input: Partial<BoardUpdate>, boardId: number) {
  const result = await supabase
    .from<Board>('boards')
    .update({ ...input })
    .match({ id: boardId })
    .single();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}
