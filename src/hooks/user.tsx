import { supabase } from '@lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '@models/database';

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
