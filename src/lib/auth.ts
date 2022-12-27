import { signIn } from 'next-auth/react';
import Chance from 'chance';
import toast from 'react-hot-toast';
import { supabase } from './supabase';

const chance = new Chance();

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

export async function guestUserSignup() {
  const email = chance.email({ domain: 'example.com' });

  return await signIn('credentials', {
    email,
    redirect: false,
  });
}

export async function handleSignIn(email: string, callbackUrl: string) {
  const signInResult = await signIn('email', {
    email: email.toLocaleLowerCase(),
    redirect: false,
    callbackUrl,
  });

  if (!signInResult?.ok) {
    toast.error('Your sign in request failed. Please try again');
  } else {
    toast.success('Login was successful. Please check your email for a link!');
  }
}
