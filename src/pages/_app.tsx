import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';

import type { Page } from '@models/app';
import '../styles/globals.css';
import { supabase } from '@lib/supabase';
import { ROUTES } from '@lib/constants';

type Props = AppProps<{ session: Session }> & {
  Component: Page;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

export default function MyApp({ Component, pageProps }: Props) {
  const { session, ...otherPageProps } = pageProps;
  const renderLayout = Component.getLayout ?? (page => page);
  const isComponentProtected = Boolean(Component.protected);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {isComponentProtected ? (
          <Auth>{renderLayout(<Component {...otherPageProps} />)}</Auth>
        ) : (
          renderLayout(<Component {...otherPageProps} />)
        )}

        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster toastOptions={{ duration: 3000 }} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

function Auth({ children }: { children: any }) {
  const router = useRouter();
  const session = supabase.auth.session();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authSubscription = supabase.auth.onAuthStateChange(
      (event: any, session: any) => {
        if (!session?.user) {
          queryClient.removeQueries();
          router.push(ROUTES.auth);
        }
      }
    );

    return () => {
      authSubscription.data?.unsubscribe();
    };
  }, [queryClient, router]);

  useEffect(() => {
    if (!session?.user) {
      router.push(ROUTES.auth);
    } else {
      setIsAuthenticated(true);
    }
  }, [router, session?.user]);

  if (isAuthenticated) {
    return children;
  }

  return <div>Loading...</div>;
}
