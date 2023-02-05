import * as React from 'react'
import type { AppProps } from 'next/app'
import { Inter as FontSans } from '@next/font/google'
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { Session } from 'next-auth'
import { SessionProvider, useSession } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { useProfileStore } from 'src/stores/profile'

import { useGetUserProfile } from '@hooks/user'
import type { NextPageWithLayout } from '@models/app'
import '../styles/globals.css'

type AppPropsWithLayout = AppProps<{
  session: Session
  dehydratedState: DehydratedState
}> & {
  Component: NextPageWithLayout
}

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const { session, ...otherPageProps } = pageProps

  const [queryClient] = React.useState(() => new QueryClient())

  const renderLayout = Component.getLayout ?? (page => page)

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

            <Hydrate state={pageProps.dehydratedState}>
              <ProfileProvider>
                <Component {...otherPageProps} />
              </ProfileProvider>
            </Hydrate>
          </>
        )}

        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster toastOptions={{ duration: 3000 }} />
      </QueryClientProvider>
    </SessionProvider>
  )
}

function ProfileProvider({ children }: React.PropsWithChildren<{}>) {
  const { status } = useSession()
  const { getUserProfile } = useGetUserProfile()
  const updateProfile = useProfileStore(state => state.updateProfile)

  React.useEffect(() => {
    if (status === 'authenticated') {
      getUserProfile(undefined, {
        onSuccess(response) {
          updateProfile(response.data)
        },
      })
    }

    if (status === 'unauthenticated') {
      updateProfile(null)
    }
  }, [getUserProfile, status, updateProfile])

  return <>{children}</>
}
