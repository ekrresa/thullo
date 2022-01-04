import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import { Footer } from '@components/common/Footer';
import { Button } from '@components/common/Button';
import { supabase } from '../../lib/supabase';
import Logo from '../../../public/logo-small.svg';

export default function NewProfile() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    const user = supabase.auth.user();

    if (!user) {
      router.back();
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formRef.current) {
      setLoading(true);
      const user = supabase.auth.user();
      const formData = new FormData(formRef.current);

      if (!formData.get('name') || !formData.get('username')) {
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const result = await supabase
          .from('profiles')
          .update(
            {
              name: formData.get('name'),
              username: formData.get('username'),
              is_profile_setup: true,
            },
            { returning: 'minimal' }
          )
          .match({ id: user.id });

        if (result.error) {
          toast.error(result.error.message, { duration: 3000 });
        }

        if (result.status === 204) {
          toast.success('profile updated successfully', { duration: 3000 });
          setTimeout(() => {
            router.replace('/');
          }, 2000);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
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

          <form className="mt-12" onSubmit={handleSubmit} ref={formRef}>
            <div className="mb-4">
              <label className="block text-sm text-gray4" htmlFor="username">
                Username
              </label>
              <input
                className="w-full px-3 py-3 mt-2 text-sm rounded-md shadow focus:outline-none"
                id="username"
                name="username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray4" htmlFor="name">
                Name
              </label>
              <input
                className="w-full px-3 py-3 mt-2 text-sm rounded-md shadow focus:outline-none"
                id="name"
                name="name"
              />
            </div>

            <Button
              className="justify-center w-full py-4 mt-4 text-white rounded-md shadow bg-corn-blue"
              type="submit"
              disabled={loading}
              loading={loading}
            >
              Continue
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
