import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { IoPersonCircle } from 'react-icons/io5';

import { Footer } from '@components/common/Footer';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Spinner } from '@components/common/Spinner';
import { useProfileImageUpload, useUpdateProfile } from '@hooks/user';
import { UserProfileInput, UserProfileInputSchema } from '@models/database';
import { reloadSession } from '@lib/utils';
import Logo from '../../../public/logo-small.svg';

export default function NewProfile() {
  const router = useRouter();
  const { data } = useSession({ required: true });
  const userProfile = data?.user;

  const [previewUrl, setPreviewUrl] = React.useState('');

  const { uploadProfileImage, uploadingProfileImage } = useProfileImageUpload();
  const { updateProfile, updatingProfile } = useUpdateProfile();

  const { register, handleSubmit } = useForm<UserProfileInput>({
    defaultValues: {
      username: userProfile?.username ?? '',
      name: userProfile?.name ?? '',
    },
    resolver: zodResolver(UserProfileInputSchema),
  });

  const submitForm = (values: UserProfileInput) => {
    updateProfile(values, {
      onSuccess() {
        toast.success('profile updated successfully', { duration: 3000 });
        reloadSession();
      },
    });
  };

  return (
    <div className="container grid min-h-screen grid-cols-1 grid-rows-layout">
      <header className="mt-24 flex flex-col items-center">
        <div className="flex items-center">
          <Logo className="mr-2 w-10" />
          <span className="text-5xl font-bold text-[#253858]">Thullo</span>
        </div>
      </header>

      <section className="mt-24 flex items-start justify-center">
        <div className="max-w-md flex-1 rounded-lg bg-white px-8 pt-6 pb-12 shadow-md">
          <h3 className="text-center text-2xl font-medium text-pencil">
            Setup your Profile
          </h3>

          <form className="mt-12" onSubmit={handleSubmit(submitForm)}>
            <div className="mb-10 flex flex-col items-center">
              <input
                type="file"
                id="image"
                className="absolute -z-10 h-[0.1px] w-[0.1px] overflow-hidden opacity-0 disabled:cursor-not-allowed"
                accept="image/*"
                disabled={uploadingProfileImage}
                onChange={async e => {
                  if (!e.target.files || e.target.files.length === 0) return;

                  try {
                    const file = e.target.files[0];
                    setPreviewUrl(URL.createObjectURL(file));

                    let formData = new FormData();
                    formData.set('image', file);
                    formData.set('userId', userProfile?.id!);
                    formData.set('folder', 'thullo');
                    formData.set('public_id', `${userProfile?.id}_profile`);

                    uploadProfileImage(formData, {
                      onSuccess() {
                        toast.success('profile picture updated successfully', {
                          duration: 3000,
                        });
                        reloadSession();
                      },
                    });
                  } catch (error) {
                    toast.error('An error occurred while processing file upload', {
                      duration: 3000,
                    });
                  }
                }}
              />
              <label
                htmlFor="image"
                className="relative block h-40 w-40 cursor-pointer rounded-full bg-gray-100"
              >
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                    fill
                  />
                ) : userProfile?.image ? (
                  <Image
                    src={userProfile?.image}
                    alt=""
                    fill
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <IoPersonCircle className="h-full w-full" />
                )}

                {uploadingProfileImage && (
                  <Spinner className="absolute rounded-full bg-black/50 text-3xl text-white" />
                )}

                {!uploadingProfileImage && (
                  <p className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-sm text-white/0  transition-colors hover:bg-black/50 hover:text-white">
                    Edit
                  </p>
                )}
              </label>

              <p className="mt-2 text-xs text-gray3">
                Click on the box above to edit your profile picture
              </p>
            </div>

            <Input
              {...register('username')}
              label="Username"
              containerClassName="mb-4"
              id="username"
            />

            <Input
              {...register('name')}
              label="Name"
              containerClassName="mb-4"
              id="name"
            />

            <div className="mt-4 flex items-center gap-2">
              <Button
                className="text-grey3 mt-4 w-full rounded-md py-3 text-sm shadow"
                onClick={router.back}
              >
                Go Home
              </Button>

              <Button
                className="mt-4 w-full rounded-md bg-corn-blue py-3 text-sm text-white shadow"
                type="submit"
                loading={updatingProfile}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
