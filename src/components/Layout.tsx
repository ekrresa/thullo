import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { CgLayoutGridSmall } from 'react-icons/cg';
import { FaCaretDown } from 'react-icons/fa';

import { Footer } from './Footer';
import { Dropdown, DropdownItem } from './Dropdown';
import { Button } from './common/Button';
import { Avatar } from './Avatar';
import { useFetchSingleBoard } from '@hooks/board';
import Logo from '@public/logo.svg';
import { ROUTES } from '@lib/constants';
import { useGetCurrentUser } from '@hooks/user';

export function Layout({ children }: React.PropsWithChildren<unknown>) {
  const router = useRouter();
  const board = useFetchSingleBoard(Number(router.query.board));

  const userProfile = useGetCurrentUser({ requireAuth: false });

  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-layout">
      <header className="mb-1 bg-white py-4 shadow-sm">
        <div className="container flex items-center">
          <Link href={ROUTES.home}>
            <Logo className="w-28" />
          </Link>

          {router.query.board && board.isSuccess && (
            <div className="mx-auto flex items-center">
              <h1 className="w-52 truncate text-lg text-pencil sm:w-auto">
                {board.data.title}
              </h1>
              <span className="mx-2 hidden text-3xl text-ash md:inline">&#124;</span>

              <Link href={ROUTES.home} passHref className="hidden md:inline">
                <button className="flex items-center rounded-lg bg-off-white px-3 py-2">
                  <CgLayoutGridSmall className="text-2xl" color="#828282" />
                  <span className="ml-2 text-xs text-gray3">All Boards</span>
                </button>
              </Link>
            </div>
          )}

          {!Boolean(userProfile) && (
            <Button
              as={Link}
              href={ROUTES.auth}
              className="ml-auto rounded-md py-1.5 px-4 text-sm"
              variant="secondary"
            >
              Login
            </Button>
          )}

          {Boolean(userProfile) && (
            <Dropdown
              header={
                userProfile?.username ? (
                  <div className="mb-2 px-3 py-2 text-center text-sm opacity-60">
                    {userProfile?.username}
                  </div>
                ) : null
              }
              trigger={
                <div className="ml-auto flex items-center">
                  {userProfile?.image && userProfile?.name ? (
                    <div className="h-9 w-9 overflow-hidden rounded-xl">
                      <Avatar image={userProfile.image} name={userProfile.name} />
                    </div>
                  ) : null}
                  <FaCaretDown className="ml-2 hidden sm:inline-block" />
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
