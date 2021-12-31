import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';

import type { Page } from '../types/app';
import '../styles/globals.css';
import { supabase } from 'lib/supabase';

type Props = AppProps & {
  Component: Page;
};

export default function MyApp({ Component, pageProps }: Props) {
  const renderLayout = Component.getLayout ?? (page => page);
  const isComponentProtected = Boolean(Component.protected);

  return (
    <>
      {renderLayout(
        isComponentProtected ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )
      )}
      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

function Auth({ children }: { children: JSX.Element }) {
  const router = useRouter();
  const session = supabase.auth.session();

  useEffect(() => {
    const authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        router.push('/auth/login');
      }
    });

    return () => {
      authSubscription.data?.unsubscribe();
    };
  }, [router]);

  if (!session?.user) {
    router.push('/auth/login');
    return null;
  }

  return children;
}
