import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { CgLayoutGridSmall } from 'react-icons/cg';
import { FaCaretDown } from 'react-icons/fa';

import { Footer } from './common/Footer';
import { Dropdown } from './common/Dropdown';
import { Button } from './common/Button';
import { Avatar } from './common/Avatar';
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
            <Link
              href={ROUTES.auth}
              className="ml-auto rounded-md bg-corn-blue py-2 px-4 text-sm text-white"
            >
              Login
            </Link>
          )}

          {Boolean(userProfile) && (
            <Dropdown
              className="ml-auto"
              header={
                userProfile?.username ? (
                  <div className="mb-2 px-3 py-2 text-center text-sm opacity-60">
                    {userProfile?.username}
                  </div>
                ) : null
              }
              panel={
                <div className="flex items-center">
                  {userProfile?.image && userProfile?.name ? (
                    <div className="h-9 w-9 overflow-hidden rounded-xl">
                      <Avatar image={userProfile.image} name={userProfile.name} />
                    </div>
                  ) : null}
                  <FaCaretDown className="ml-2 hidden sm:inline-block" />
                </div>
              }
              list={[
                <Link
                  key="profile"
                  href={ROUTES.profile}
                  className="block w-full border-inherit px-3 py-2 text-center text-sm transition-colors duration-200 ease-linear hover:bg-gray-100"
                >
                  Profile
                </Link>,
                <Button
                  key="logout"
                  className="w-full border-inherit px-3 py-2 text-sm transition-colors duration-200 ease-linear hover:bg-gray-100"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Log out
                </Button>,
              ]}
            />
          )}
        </div>
      </header>

      <div className="bg-white">{children}</div>

      <Footer />
    </div>
  );
}
