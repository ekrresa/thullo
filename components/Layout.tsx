import React from 'react';
import Logo from '../public/logo.svg';
import { FaCaretDown } from 'react-icons/fa';

interface LayoutProps extends React.PropsWithChildren<unknown> {}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="grid grid-rows-layout grid-cols-1 min-h-screen">
      <header className="bg-white py-4 shadow-sm">
        <div className="container flex items-center">
          <Logo className="w-28" />

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

      <div className="">{children}</div>

      <div className="py-2 px-4 flex justify-center text-light-pencil">
        <span>&copy;</span>
        <span className="ml-2">{new Date().getFullYear()}</span>
        <span className="ml-2">Ochuko Ekrresa</span>
      </div>
    </div>
  );
}
