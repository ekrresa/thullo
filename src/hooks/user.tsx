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
    async () =>
      supabase.from<UserProfile>('profiles').select().match({ id: user?.id }).single(),
    { staleTime: Infinity }
  );
}
