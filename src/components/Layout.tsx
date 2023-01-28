import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { CgLayoutGridSmall } from 'react-icons/cg';
import { IoPersonCircle } from 'react-icons/io5';

import { Footer } from './Footer';
import { Dropdown, DropdownItem } from './Dropdown';
import { Button } from './common/Button';
import { Avatar } from './Avatar';
import { useProfileStore } from 'src/stores/profile';
import { useGetSingleBoard } from '@hooks/board';
import { ROUTES } from '@lib/constants';
import Logo from '@public/logo.svg';
import MobileLogo from '@public/logo-small.svg';

export function Layout({ children }: React.PropsWithChildren<unknown>) {
  const router = useRouter();

  const [boardOwner, boardId] = (router.query.board as string[]) || [];

  const { board } = useGetSingleBoard(boardOwner, boardId);
  const userProfile = useProfileStore(state => state.info);

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
              <h1 className="self-center truncate text-lg font-medium text-slate-700 sm:w-auto">
                {board.title}
              </h1>
              <span className="hidden w-0.5 flex-1 self-stretch bg-astronaut-100 text-2xl md:inline"></span>

              <Button
                as={Link}
                href={ROUTES.home}
                passHref
                className="hidden gap-2 rounded-lg px-2.5 py-0.5 text-sm text-slate-500 md:flex"
                variant="transparent"
              >
                <CgLayoutGridSmall className="text-3xl" />
                <span>All Boards</span>
              </Button>
            </div>
          )}

          {!Boolean(userProfile) && (
            <Button
              as={Link}
              href={ROUTES.auth}
              className="rounded-md py-1.5 px-4 text-xs uppercase"
              variant="transparent"
            >
              Sign in
            </Button>
          )}

          {userProfile && (
            <Dropdown
              header={
                userProfile?.username ? (
                  <div className="mb-2 px-3 py-2 text-center text-sm opacity-60">
                    {userProfile.username}
                  </div>
                ) : null
              }
              trigger={
                <div className="flex items-center">
                  <div className="h-9 w-9 overflow-hidden rounded-xl">
                    {userProfile?.image || userProfile?.name ? (
                      <Avatar image={userProfile.image} name={userProfile.name} />
                    ) : (
                      <IoPersonCircle className="h-full w-full" />
                    )}
                  </div>
                </div>
              }
            >
              <DropdownItem>
                <Link
                  key="profile"
                  href={ROUTES.profile}
                  className="block w-full text-center"
                >
                  Profile
                </Link>
              </DropdownItem>

              <Button
                key="logout"
                className="w-full rounded-none py-1.5 text-roman-600 transition-colors hover:bg-roman-500 hover:text-white"
                onClick={() => {
                  signOut();
                }}
              >
                Log out
              </Button>
            </Dropdown>
          )}
        </div>
      </header>

      <div className="bg-white">{children}</div>

      <Footer />
    </div>
  );
}
