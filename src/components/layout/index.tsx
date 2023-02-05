import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import MobileLogo from '@public/logo-small.svg'
import Logo from '@public/logo.svg'

import { useAuth } from '@hooks/user'
import { useGetBoardDetails } from '@components/board/hooks'
import { ROUTES } from '@lib/constants'
import { Footer } from '../Footer'
import { Button } from '../common/Button'
import { ProfileDropdown } from './ProfileDropdown'

export function Layout({ children }: React.PropsWithChildren<unknown>) {
  const router = useRouter()

  const [username, slug] = (router.query.board as string[]) || []
  const { board } = useGetBoardDetails(username, slug)

  const isAuthenticated = useAuth()

  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-layout">
      <header className="mb-1 bg-white py-4 shadow-sm">
        <div className="container flex items-center justify-between">
          <Link href={ROUTES.home}>
            <Logo className="hidden w-28 md:inline-block" />
            <MobileLogo className="w-8 md:hidden" />
          </Link>

          {board && (
            <div className="flex gap-2">
              <h1 className="self-center truncate font-open-sans text-xl font-medium text-slate-700 sm:w-auto">
                {board.title}
              </h1>
            </div>
          )}

          {!isAuthenticated ? (
            <Button
              as={Link}
              href={ROUTES.auth}
              className="rounded-md py-1.5 px-4 text-xs uppercase"
              variant="transparent"
            >
              Sign in
            </Button>
          ) : (
            <ProfileDropdown />
          )}
        </div>
      </header>

      <div className="bg-white">{children}</div>

      <Footer />
    </div>
  )
}
