import { supabase } from '@lib/supabase';
import { useQuery } from 'react-query';
import { UserProfile } from 'types/database';

export const userQueryKeys = {
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
