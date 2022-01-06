import { supabase } from '@lib/supabase';
import { useQuery } from 'react-query';
import { UserProfile } from 'types/database';

export const userQueryKeys = {
  profile: () => ['user', 'profile'],
};

export function useUserProfile() {
  return useQuery(
    userQueryKeys.profile(),
    async () => supabase.from<UserProfile>('profiles').select().single(),
    { staleTime: Infinity }
  );
}
