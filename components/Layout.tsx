import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaCaretDown } from 'react-icons/fa';

import Logo from '../public/logo.svg';
import { Footer } from './Footer';

interface LayoutProps extends React.PropsWithChildren<unknown> {}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="grid grid-rows-layout grid-cols-1 min-h-screen">
      <header className="bg-white py-4 shadow-sm mb-1">
        <div className="container flex items-center">
          <Link href="/" passHref>
            <a>
              <Logo className="w-28" />
            </a>
          </Link>

          {router.query.board && (
            <div className="mx-auto">
              <span className="text-pencil text-lg">DevChallenges Board</span>
              {/* <span className="mx-2">&#124;</span> */}
            </div>
          )}

          <form className="flex flex-1 max-w-xs ml-auto p-[2px] rounded-lg shadow-md">
            <input
              className="flex-1 focus:outline-none px-3 text-sm text-gray-600"
              placeholder="keyword..."
            />
            <button
              className="bg-corn-blue flex-grow-0 flex-shrink-0 rounded-lg px-4 py-2 text-white text-xs"
              type="submit"
            >
              Search
            </button>
          </form>

          <div className="flex items-center ml-8">
            <div className="w-8 h-8 rounded bg-yellow-700"></div>
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
