import * as React from 'react';
import { FaGithub } from 'react-icons/fa';
import Logo from '@public/logo-small.svg';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';

export default function AuthPage() {
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

        <form className="mt-12 w-full self-start">
          <Input label="Email" className="mb-4" id="email" type="email" />
          <Button
            className="mt-4 w-full justify-center rounded-md bg-corn-blue py-3 text-sm text-white shadow"
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
