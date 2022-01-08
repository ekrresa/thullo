import { FormEvent, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@components/common/Button';
import { Footer } from '@components/common/Footer';
import { handleDemoUserSignUp, signUpUser } from '@lib/api/auth';
import Logo from '../../../public/logo-small.svg';

export default function Register() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const demoUserSignUpMutation = useMutation(() => handleDemoUserSignUp());
  const userSignUpMutation = useMutation((data: any) =>
    signUpUser(data.email, data.password)
  );

  const demoUserSignUp = async () => {
    demoUserSignUpMutation.mutate(undefined, {
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.message || error.message;
        toast.error(errorMsg);
      },
      onSuccess: () => {
        router.push('/profile');
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
          onError: (error: any) => {
            const errorMsg = error?.response?.data?.message || error.message;
            toast.error(errorMsg);
          },
          onSuccess: () => router.push('/profile'),
        }
      );
    }
  };

  return (
    <div className="container grid min-h-screen grid-cols-1 grid-rows-layout">
      <header className="flex flex-col items-center pt-8">
        <div className="flex items-center">
          <Logo className="w-10 mr-2" />
          <span className="font-bold text-5xl text-[#253858]">Thullo</span>
        </div>
        <p className="mt-3 text-gray3">Manage your projects with flexibility</p>
      </header>

      <section className="flex items-start justify-center mt-24">
        <div className="flex-1 max-w-md px-8 pt-6 pb-12 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-medium text-center text-pencil">
            Welcome to Thullo
          </h3>

          <div className="flex mt-8 space-x-4">
            <Button className="grid flex-1 w-12 h-12 rounded-md shadow place-items-center">
              <FcGoogle className="text-3xl" />
            </Button>
            <Button className="grid flex-1 w-12 h-12 rounded-md shadow place-items-center">
              <FaFacebook className="text-3xl" color="#0375E6" />
            </Button>
            <Button className="grid flex-1 w-12 h-12 rounded-md shadow place-items-center">
              <FaGithub className="text-3xl" />
            </Button>
          </div>

          <form className="mt-12" onSubmit={handleUserSignUp} ref={formRef}>
            <div className="mb-4">
              <label className="block text-sm text-gray4" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-3 py-3 mt-2 text-sm rounded-md shadow focus:outline-none"
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
                className="w-full px-3 py-3 mt-2 text-sm rounded-md shadow focus:outline-none"
                id="password"
                name="password"
                type="password"
              />
            </div>

            <Button
              className="justify-center w-full py-4 mt-4 text-white rounded-md shadow bg-corn-blue"
              loading={userSignUpMutation.isLoading}
              disabled={userSignUpMutation.isLoading}
              type="submit"
            >
              Sign up
            </Button>
          </form>

          <Button
            className="justify-center w-full mt-6 text-sm text-corn-blue"
            onClick={demoUserSignUp}
            disabled={demoUserSignUpMutation.isLoading}
            loading={demoUserSignUpMutation.isLoading}
          >
            Sign up as demo user
          </Button>

          <p className="mt-6 text-xs text-center text-gray3">
            Have an account?{' '}
            <Link href="/auth/login" passHref>
              <a>
                <span className="font-semibold text-corn-blue">Login</span>
              </a>
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
