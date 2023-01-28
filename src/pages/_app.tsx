import * as React from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { Inter as FontSans } from '@next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';

import type { Page } from '@models/app';
import { useGetUserProfile } from '@hooks/user';
import { useProfileStore } from 'src/stores/profile';
import '../styles/globals.css';

type Props = AppProps<{ session: Session }> & {
  Component: Page;
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

export default function MyApp({ Component, pageProps }: Props) {
  const { session, ...otherPageProps } = pageProps;
  const renderLayout = Component.getLayout ?? (page => page);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {renderLayout(
          <>
            <style jsx global>{`
              html {
                font-family: ${fontSans.style.fontFamily};
              }
            `}</style>

            <ProfileProvider>
              <Component {...otherPageProps} />
            </ProfileProvider>
          </>
        )}

        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster toastOptions={{ duration: 3000 }} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

function ProfileProvider({ children }: React.PropsWithChildren<{}>) {
  const { status } = useSession();
  const { getUserProfile } = useGetUserProfile();
  const updateProfile = useProfileStore(state => state.updateProfile);

  React.useEffect(() => {
    if (status === 'authenticated') {
      getUserProfile(undefined, {
        onSuccess(response) {
          updateProfile(response.data);
        },
      });
    }

    if (status === 'unauthenticated') {
      updateProfile(null);
    }
  }, [getUserProfile, status, updateProfile]);

  return <>{children}</>;
}
