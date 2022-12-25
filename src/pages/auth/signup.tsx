import { FormEvent, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@components/common/Button';
import { Footer } from '@components/common/Footer';
import { handleDemoUserSignUp, signUpUser } from '@lib/api/auth';
import Logo from '../../../public/logo-small.svg';
import { ROUTES } from '@lib/constants';

export default function Register() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const demoUserSignUpMutation = useMutation(() => handleDemoUserSignUp());
  const userSignUpMutation = useMutation((data: any) =>
    signUpUser(data.email, data.password)
  );

  const demoUserSignUp = async () => {
    demoUserSignUpMutation.mutate(undefined, {
      onSuccess: () => {
        router.push(ROUTES.profile);
      },
    });
  };

  const handleUserSignUp = async (e: FormEvent) => {
    e.preventDefault();

    if (formRef.current) {
      const formData = new FormData(formRef.current);

      if (!formData.get('email') || !formData.get('password')) {
        toast.error('email and password are required');
        return;
      }

      userSignUpMutation.mutate(
        {
          email: formData.get('email'),
          password: formData.get('password'),
        },
        {
          onSuccess: () => router.push(ROUTES.profile),
        }
      );
    }
  };

  return (
    <div className="container grid min-h-screen grid-cols-1 grid-rows-layout">
      <header className="flex flex-col items-center pt-8">
        <div className="flex items-center">
          <Logo className="mr-2 w-10" />
          <span className="text-5xl font-bold text-[#253858]">Thullo</span>
        </div>
        <p className="mt-3 text-gray3">Manage your projects with flexibility</p>
      </header>

      <section className="mt-24 flex items-start justify-center">
        <div className="max-w-md flex-1 rounded-lg bg-white px-8 pt-6 pb-12 shadow-md">
          <h3 className="text-center text-2xl font-medium text-pencil">
            Welcome to Thullo
          </h3>

          {/* <div className="flex mt-8 space-x-4">
            <Button className="grid flex-1 w-12 h-12 rounded-md shadow place-items-center">
              <FcGoogle className="text-3xl" />
            </Button>
            <Button className="grid flex-1 w-12 h-12 rounded-md shadow place-items-center">
              <FaFacebook className="text-3xl" color="#0375E6" />
            </Button>
            <Button className="grid flex-1 w-12 h-12 rounded-md shadow place-items-center">
              <FaGithub className="text-3xl" />
            </Button>
          </div> */}

          <form className="mt-12" onSubmit={handleUserSignUp} ref={formRef}>
            <div className="mb-4">
              <label className="block text-sm text-gray4" htmlFor="email">
                Email
              </label>
              <input
                className="mt-2 w-full rounded-md px-3 py-3 text-sm shadow focus:outline-none"
                id="email"
                name="email"
                type="email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray4" htmlFor="email">
                Password
              </label>
              <input
                className="mt-2 w-full rounded-md px-3 py-3 text-sm shadow focus:outline-none"
                id="password"
                name="password"
                type="password"
              />
            </div>

            <Button
              className="mt-4 w-full justify-center rounded-md bg-corn-blue py-4 text-white shadow"
              loading={userSignUpMutation.isLoading}
              disabled={userSignUpMutation.isLoading}
              type="submit"
            >
              Sign up
            </Button>
          </form>

          <Button
            className="mt-6 w-full justify-center text-sm text-corn-blue"
            onClick={demoUserSignUp}
            disabled={demoUserSignUpMutation.isLoading}
            loading={demoUserSignUpMutation.isLoading}
          >
            Sign up as demo user
          </Button>

          <p className="mt-6 text-center text-xs text-gray3">
            Have an account?{' '}
            <Link href={ROUTES.login} passHref>
              <span className="font-semibold text-corn-blue">Login</span>
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
