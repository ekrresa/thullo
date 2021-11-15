import { useEffect, useRef } from 'react';
import { Footer } from '../../components/Footer';

import Logo from '../../public/logo-small.svg';

export default function Login() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="container grid grid-rows-layout grid-cols-1 min-h-screen">
      <header className="flex justify-center pt-8">
        <div className="flex items-center">
          <Logo className="mr-2 w-10" />
          <span className="font-bold text-5xl text-[#253858]">Thullo</span>
        </div>
      </header>

      <section className="flex justify-center items-start mt-24">
        <div className="bg-white px-8 pt-6 pb-12 rounded-lg shadow-md flex-1 max-w-md">
          <h3 className="font-medium text-pencil text-xl text-center">
            Sign in to Thullo
          </h3>

          <form className="mt-8">
            <div>
              <label className="block text-pencil" htmlFor="email">
                Email
              </label>
              <input
                className="px-3 py-3 mt-2 rounded-md w-full text-sm shadow focus:outline-none"
                id="email"
                type="email"
                ref={inputRef}
              />
            </div>

            <button className="bg-corn-blue text-center text-white mt-4 py-2 rounded-md w-full shadow">
              Send me a magic link
            </button>
          </form>

          <div className="my-8 text-center">OR</div>

          <button className="text-center text-sm py-3 rounded-md w-full shadow">
            Sign in with Google
          </button>
          <button className="text-center text-sm mt-4 py-3 rounded-md w-full shadow">
            Sign in with Facebook
          </button>
          <button className="text-center text-sm mt-3 py-3 rounded-md w-full shadow">
            Sign in with GitHub
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
