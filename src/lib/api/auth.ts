import { axiosClient } from '@lib/axios';
import { SupabaseUser, UserProfile } from '@types/database';
import { supabase } from '../supabase';

export async function signUpUser(email: string, password: string) {
  const { error, session } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!session) {
    throw new Error('An error occurred. Please try again.');
  }

  return session;
}

export async function handleDemoUserSignUp() {
  const result = await axiosClient.post<SupabaseUser>('/api/auth/user');
  const signInResult = await handleSignIn(result.data.email, result.data.password!);
}

export async function handleSignIn(email: string, password: string) {
  const result = await supabase.auth.signIn({
    email,
    password,
  });

  if (result.error) {
    throw result.error;
  }

  const userProfileResult = await supabase
    .from<UserProfile>('profiles')
    .select('is_profile_setup')
    .match({ id: result.user?.id })
    .single();

  if (userProfileResult.error) {
    throw userProfileResult.error;
  }

  return userProfileResult.data;
}
