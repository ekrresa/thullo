import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { toast, Toaster } from 'react-hot-toast';

import type { Page } from '../types/app';
import '../styles/globals.css';
import { supabase } from 'lib/supabase';
import { ROUTES } from '@lib/constants';

type Props = AppProps & {
  Component: Page;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false },
  },
  mutationCache: new MutationCache({
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error.message;
      toast.error(errorMessage);
    },
  }),
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
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        queryClient.removeQueries();
        router.push(ROUTES.login);
      }
    });

    return () => {
      authSubscription.data?.unsubscribe();
    };
  }, [queryClient, router]);

  useEffect(() => {
    if (!session?.user) {
      router.push(ROUTES.login);
    } else {
      setIsAuthenticated(true);
    }
  }, [router, session?.user]);

  if (isAuthenticated) {
    return children;
  }

  return <div>Loading...</div>;
}
