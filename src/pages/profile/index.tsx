import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { IoPersonCircle } from 'react-icons/io5';

import { Footer } from '@components/common/Footer';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Spinner } from '@components/common/Spinner';
import { useGetCurrentUser, useProfileImageUpload, useUpdateProfile } from '@hooks/user';
import { UserProfileInput, UserProfileInputSchema } from '@models/database';
import { reloadSession } from '@lib/utils';
import { ROUTES } from '@lib/constants';
import Logo from '../../../public/logo-small.svg';

export default function NewProfile() {
  const router = useRouter();
  const userProfile = useGetCurrentUser();

  const [previewUrl, setPreviewUrl] = React.useState('');

  const { uploadProfileImage, uploadingProfileImage } = useProfileImageUpload();
  const { updateProfile, updatingProfile } = useUpdateProfile();

  const formDefaultValues = React.useMemo(
    () => ({
      username: userProfile?.username ?? '',
      name: userProfile?.name ?? '',
    }),
    [userProfile?.username, userProfile?.name]
  );

  const { register, handleSubmit, reset } = useForm<UserProfileInput>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(UserProfileInputSchema),
  });

  React.useEffect(() => {
    reset(formDefaultValues);
  }, [formDefaultValues, reset]);

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

                  Array.from(e.target.files).forEach(file => {
                    const reader = new FileReader();

                    reader.onloadend = () => {
                      const base64String = reader.result as string;

                      setPreviewUrl(base64String);

                      uploadProfileImage(
                        { image: base64String },
                        {
                          onSuccess() {
                            toast.success('profile picture updated successfully', {
                              duration: 3000,
                            });
                            reloadSession();
                          },
                        }
                      );
                    };

                    reader.readAsDataURL(file);
                  });
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
                    className="h-full w-full rounded-full object-cover"
                    width={160}
                    height={160}
                    alt=""
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

            <div className="mt-8 flex items-center gap-2">
              <Button
                className="w-full rounded-md py-3 text-sm"
                onClick={() => router.push(ROUTES.home)}
                variant="secondary"
              >
                Go Home
              </Button>

              <Button
                className="w-full rounded-md py-3 text-sm"
                loading={updatingProfile}
                type="submit"
                variant="primary"
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
