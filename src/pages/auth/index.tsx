import * as React from 'react';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

import { ROUTES } from '@lib/constants';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import Logo from '@public/logo-small.svg';

const FormSchema = z.object({
  email: z.string().email().trim(),
});

type FormData = z.infer<typeof FormSchema>;

export default function AuthPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(router.query as Record<string, string>);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: { email: '' },
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (values: FormData) => {
    const signInResult = await signIn('email', {
      email: values.email.toLocaleLowerCase(),
      redirect: false,
      callbackUrl: searchParams.get('from') || ROUTES.home,
    });

    if (!signInResult?.ok) {
      return toast.error('Your sign in request failed. Please try again');
    }

    return toast.success('Login was successful. Please check your email for a link!');
  };

  return (
    <div className="container flex min-h-screen flex-col">
      <header className="mt-24 flex flex-col items-center">
        <div className="flex items-center">
          <Logo className="mr-2 w-10" />
          <span className="text-5xl font-bold text-[#253858]">Thullo</span>
        </div>
        <p className="mt-3 text-gray3">Manage your projects with flexibility</p>
      </header>

      <section className="mx-auto mt-12 flex w-full max-w-sm flex-col items-center rounded-lg px-8 pt-6 pb-8 shadow-none sm:shadow-md">
        <header className="max-w-md flex-1 bg-white">
          <h3 className="text-center text-2xl font-medium text-pencil">
            Sign in to Thullo
          </h3>
        </header>

        <form className="mt-12 w-full self-start" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('email')}
            containerClassName="mb-4"
            label="Email"
            id="email"
            errorMessage={errors.email?.message}
          />
          <Button
            className="mt-4 w-full justify-center rounded-md bg-corn-blue py-3 text-sm text-white shadow"
            loading={isSubmitting}
            type="submit"
          >
            Sign in with Email
          </Button>
        </form>

        <div className="my-4 flex w-full items-center gap-4">
          <div className="flex-1 border-t border-slate-300"></div>
          <p className="text-sm">OR</p>
          <div className="flex-1 border-t border-slate-300"></div>
        </div>

        <Button className="flex w-full justify-center gap-2 rounded-md border border-slate-300 py-3 text-sm shadow-sm">
          <FaGithub className="text-xl" />
          <p>Sign in with GitHub</p>
        </Button>

        <Button className="mt-2 flex w-full justify-center gap-2 rounded-md border border-slate-300 py-3 text-sm shadow-sm">
          Sign in as a guest
        </Button>
      </section>
    </div>
  );
}
