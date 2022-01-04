import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';

import type { Page } from '../types/app';
import '../styles/globals.css';
import { supabase } from 'lib/supabase';

type Props = AppProps & {
  Component: Page;
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

export default function MyApp({ Component, pageProps }: Props) {
  const renderLayout = Component.getLayout ?? (page => page);
  const isComponentProtected = Boolean(Component.protected);

  return (
    <QueryClientProvider client={queryClient}>
      {isComponentProtected ? (
        <Auth>{renderLayout(<Component {...pageProps} />)}</Auth>
      ) : (
        renderLayout(<Component {...pageProps} />)
      )}
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster toastOptions={{ duration: 3000 }} />
    </QueryClientProvider>
  );
}

function Auth({ children }: { children: any }) {
  const router = useRouter();
  const session = supabase.auth.session();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router, session?.user]);

  if (isAuthenticated) {
    return children;
  }

  return <div>Loading...</div>;
}
