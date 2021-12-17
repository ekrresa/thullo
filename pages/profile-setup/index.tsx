import { FormEvent, useEffect, useRef, useState } from 'react';

import { Footer } from '../../components/Footer';
import { supabase } from '../../lib/supabase';

import Logo from '../../public/logo-small.svg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, error } = await supabase.auth.signIn({ email });
      console.log({ user, error });
      setLoading(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container grid min-h-screen grid-cols-1 grid-rows-layout">
      <header className="flex flex-col items-center pt-8">
        <div className="flex items-center">
          <Logo className="w-10 mr-2" />
          <span className="font-bold text-5xl text-[#253858]">Thullo</span>
        </div>
      </header>

      <section className="flex items-start justify-center mt-24">
        <div className="flex-1 max-w-md px-8 pt-6 pb-12 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-medium text-center text-pencil">
            Setup your Profile
          </h3>

          <form className="mt-12" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-gray4" htmlFor="email">
                Name
              </label>
              <input
                className="w-full px-3 py-3 mt-2 text-sm rounded-md shadow focus:outline-none"
                id="email"
                type="email"
                onChange={e => setEmail(e.currentTarget.value)}
                ref={inputRef}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray4" htmlFor="email">
                Username
              </label>
              <input
                className="w-full px-3 py-3 mt-2 text-sm rounded-md shadow focus:outline-none"
                id="username"
                onChange={e => setEmail(e.currentTarget.value)}
                ref={inputRef}
              />
            </div>

            <button className="w-full py-4 mt-4 text-center text-white rounded-md shadow bg-corn-blue">
              Continue
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
