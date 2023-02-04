import * as React from 'react'
import { useRouter } from 'next/router'
import { zodResolver } from '@hookform/resolvers/zod'
import Logo from '@public/logo-small.svg'
import { SignInResponse, signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { FaGithub } from 'react-icons/fa'
import { z } from 'zod'

import useCreateGuestUserMutation from '@hooks/auth'
import { Input } from '@components/Input'
import { Button } from '@components/common/Button'
import { ROUTES } from '@lib/constants'

const FormSchema = z.object({
  email: z.string().email().trim(),
})

type FormData = z.infer<typeof FormSchema>

export default function AuthPage() {
  const router = useRouter()
  const searchParams = new URLSearchParams(router.query as Record<string, string>)
  const callbackUrl = searchParams.get('callbackUrl') || ROUTES.home

  const { createGuestUser, creatingGuestUser } = useCreateGuestUserMutation()

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: { email: '' },
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = async (values: FormData) => {
    const signInResult = await signIn('email', {
      email: values.email.toLocaleLowerCase(),
      redirect: false,
      callbackUrl,
    })

    if (!signInResult?.ok) {
      return toast.error('Your sign in request failed. Please try again')
    }

    return toast.success('Login was successful. Please check your email for a link!')
  }

  const handleGuestUserResponse = (result?: SignInResponse) => {
    if (!result?.ok) {
      toast.error('We were unable to create a guest account for you. Please try again!')
      return
    }

    toast.success('Login was successful! Redirecting...')
    setTimeout(() => {
      router.push(callbackUrl)
    }, 1000)
  }

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
          <Button loading={isSubmitting} variant="primary" type="submit" fullWidth>
            Sign in with Email
          </Button>
        </form>

        <div className="my-4 flex w-full items-center gap-4">
          <div className="flex-1 border-t border-slate-300"></div>
          <p className="text-sm">OR</p>
          <div className="flex-1 border-t border-slate-300"></div>
        </div>

        <Button
          className="gap-2"
          onClick={() => signIn('github', { callbackUrl })}
          variant="secondary"
          fullWidth
        >
          <FaGithub className="text-xl" />
          <p>Sign in with GitHub</p>
        </Button>

        <Button
          className="mt-2 gap-2"
          onClick={() =>
            createGuestUser(undefined, {
              onSuccess(result) {
                handleGuestUserResponse(result)
              },
            })
          }
          loading={creatingGuestUser}
          variant="secondary"
          fullWidth
        >
          Sign in as a guest
        </Button>
      </section>
    </div>
  )
}
