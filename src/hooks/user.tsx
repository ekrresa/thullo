import { supabase } from '@lib/supabase';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserProfile, UserProfileInput } from '@models/database';
import { request } from '@lib/request';
import { parseError } from '@lib/utils';
import toast from 'react-hot-toast';

export const userQueryKeys = {
  users: () => ['users'],
  profile: () => ['userProfile'],
};

export function useUserProfile() {
  const user = supabase.auth.user();

  return useQuery(
    userQueryKeys.profile(),
    async () => {
      const result = await supabase
        .from<UserProfile>('profiles')
        .select()
        .match({ id: user?.id })
        .single();

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    { staleTime: Infinity }
  );
}

export function useFetchUsers(userId: string = '') {
  return useQuery(
    userQueryKeys.users(),
    async () => {
      const result = await supabase
        .from<UserProfile>('profiles')
        .select()
        .neq('id', userId)
        .order('name', { ascending: true });

      if (result.status === 401) await supabase.auth.signOut();
      if (result.error) throw result.error;

      return result.data;
    },
    { enabled: Boolean(userId), staleTime: Infinity }
  );
}

export function useProfileImageUpload() {
  const { mutate, isLoading, ...mutationProps } = useMutation(
    (formData: FormData) => {
      return request.post('/api/images/profile-image', formData);
    },
    {
      onError(error) {
        const errorMessage = parseError(error);
        toast.error(errorMessage);
      },
    }
  );

  return {
    uploadProfileImage: mutate,
    uploadingProfileImage: isLoading,
    ...mutationProps,
  };
}

export function useUpdateProfile() {
  const { mutate, isLoading, ...mutationProps } = useMutation(
    (payload: UserProfileInput) => {
      return request.post('/api/users/profile', payload);
    },
    {
      onError(error) {
        const errorMessage = parseError(error);
        toast.error(errorMessage);
      },
    }
  );

  return {
    updateProfile: mutate,
    updatingProfile: isLoading,
    ...mutationProps,
  };
}
