import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { UserProfileInput } from '@models/user';
import { UserProfile } from '@models/database';
import { supabase } from '@lib/supabase';
import { parseError } from '@lib/utils';
import { updateProfile, updateProfileImage } from '@lib/api/user';
import { ProfileImageInput } from '@models/user';

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

interface CurrentUserProps {
  requireAuth: boolean;
}
export function useGetCurrentUser(props?: CurrentUserProps) {
  const { requireAuth = true } = props || {};
  const { data: userProfile } = useSession({ required: requireAuth });

  return React.useMemo(() => userProfile?.user, [userProfile?.user]);
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
    (payload: ProfileImageInput) => {
      return updateProfileImage(payload);
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
    (payload: UserProfileInput) => updateProfile(payload),
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
