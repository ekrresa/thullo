import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { CgLayoutGridSmall } from 'react-icons/cg';
import { FaCaretDown } from 'react-icons/fa';

import { Footer } from './Footer';
import { Dropdown } from './Dropdown';
import { Button } from './Button';
import { useUserProfile } from '@hooks/user';
import { useFetchSingleBoard } from '@hooks/board';
import { supabase } from '@lib/supabase';
import { getCloudinaryUrl, getInitials } from '@lib/utils';
import Logo from '../../../public/logo.svg';
import { ROUTES } from '@lib/constants';

export function Layout({ children }: React.PropsWithChildren<unknown>) {
  const router = useRouter();
  const userProfileResult = useUserProfile();
  const queryClient = useQueryClient();
  const board = useFetchSingleBoard(Number(router.query.board));

  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-layout">
      <header className="py-4 mb-1 bg-white shadow-sm">
        <div className="container flex items-center">
          <Link href={ROUTES.home} passHref>
            <a>
              <Logo className="w-28" />
            </a>
          </Link>

          {router.query.board && board.isSuccess && (
            <div className="flex items-center mx-auto">
              <h1 className="text-lg text-pencil">{board.data.title}</h1>
              <span className="mx-2 text-3xl text-ash">&#124;</span>

              <Link href={ROUTES.home} passHref>
                <a>
                  <button className="flex items-center px-3 py-2 rounded-lg bg-off-white">
                    <CgLayoutGridSmall className="text-2xl" color="#828282" />
                    <span className="ml-2 text-xs text-gray3">All Boards</span>
                  </button>
                </a>
              </Link>
            </div>
          )}

          <form className="flex flex-1 max-w-xs ml-auto p-[1px] rounded-lg shadow-md">
            <input
              className="flex-1 px-3 text-sm text-gray-600 focus:outline-none"
              placeholder="keyword..."
            />
            <button
              className="flex-grow-0 flex-shrink-0 px-4 py-2 text-xs text-white rounded-lg bg-corn-blue"
              type="submit"
            >
              Search
            </button>
          </form>

          <Dropdown
            className="ml-8"
            header={
              <div className="px-3 py-2 mb-2 text-sm opacity-60">
                {userProfileResult.data?.username}
              </div>
            }
            panel={
              <div className="flex items-center">
                {userProfileResult.isSuccess ? (
                  userProfileResult.data?.image_id ? (
                    <div className="relative overflow-hidden rounded-lg h-9 w-9">
                      <Image
                        src={getCloudinaryUrl(
                          userProfileResult.data.image_id,
                          userProfileResult.data.image_version
                        )}
                        layout="fill"
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="grid px-1 py-1 text-white uppercase rounded-lg w-9 place-items-center bg-corn-blue">
                      {getInitials(userProfileResult.data.name)}
                    </div>
                  )
                ) : null}
                <p className="w-24 ml-3 text-sm capitalize truncate">
                  {userProfileResult.data?.name}
                </p>
                <FaCaretDown className="ml-2" />
              </div>
            }
            list={[
              <Link key="profile" href={ROUTES.profile}>
                <a className="block w-full px-3 py-2 text-sm transition-colors duration-200 ease-linear border-inherit hover:bg-gray-100">
                  Profile
                </a>
              </Link>,
              <Button
                key="logout"
                className="w-full px-3 py-2 text-sm transition-colors duration-200 ease-linear border-inherit hover:bg-gray-100"
                onClick={() => {
                  supabase.auth.signOut();
                  queryClient.removeQueries();
                }}
              >
                Log out
              </Button>,
            ]}
          />
        </div>
      </header>

      <div className="bg-white">{children}</div>

      <Footer />
    </div>
  );
}
