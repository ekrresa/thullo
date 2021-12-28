import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaCaretDown } from 'react-icons/fa';

import Logo from '../../public/logo.svg';
import { Footer } from './Footer';
import { BsGridFill } from 'react-icons/bs';

export function Layout({ children }: React.PropsWithChildren<unknown>) {
  const router = useRouter();

  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-layout">
      <header className="py-4 mb-1 bg-white shadow-sm">
        <div className="container flex items-center">
          <Link href="/" passHref>
            <a>
              <Logo className="w-28" />
            </a>
          </Link>

          {router.query.board && (
            <div className="flex items-center mx-auto">
              <span className="text-lg text-pencil">DevChallenges Board</span>
              <span className="mx-2 text-3xl text-ash">&#124;</span>

              <Link href="/" passHref>
                <a>
                  <button className="flex items-center px-4 py-2 rounded-xl bg-off-white">
                    <BsGridFill className="" color="#828282" />
                    <span className="ml-2 text-sm text-gray3">All Boards</span>
                  </button>
                </a>
              </Link>
            </div>
          )}

          <form className="flex flex-1 max-w-xs ml-auto p-[2px] rounded-lg shadow-md">
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

          <div className="flex items-center ml-8">
            <div className="w-8 h-8 bg-yellow-700 rounded"></div>
            <p className="ml-3 text-sm">Xanthe Neal</p>
            <FaCaretDown className="ml-3" />
          </div>
        </div>
      </header>

      <div className="bg-white">{children}</div>

      <Footer />
    </div>
  );
}
