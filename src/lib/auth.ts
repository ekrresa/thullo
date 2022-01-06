import { UserProfile } from 'types/database';
import { supabase } from './supabase';

export async function signUpUser(email: string, password: string) {
  const { error, session } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return session;
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
    .single();

  if (userProfileResult.error) {
    throw userProfileResult.error;
  }

  return userProfileResult.data;
}
