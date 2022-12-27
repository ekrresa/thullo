import { useRouter } from 'next/router';
import Image from 'next/legacy/image';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { GoPencil } from 'react-icons/go';
import { IoPersonCircle } from 'react-icons/io5';

import { Footer } from '@components/common/Footer';
import { Button } from '@components/common/Button';
import { updateProfile } from '@lib/api/profile';
import { userQueryKeys, useUserProfile } from '@hooks/user';
import { getCloudinaryUrl } from '@lib/utils';
import Logo from '../../../public/logo-small.svg';

export default function NewProfile() {
  const queryClient = useQueryClient();
  const profileMutation = useMutation((data: any) => updateProfile(data));
  const userProfile = useUserProfile();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: userProfile.data?.name || '',
      username: userProfile.data?.username || '',
      image: null,
    },
    onSubmit: values => {
      profileMutation.mutate(
        {
          image: values.image,
          name: values.name,
          userId: userProfile.data?.id,
          username: values.username,
        },
        {
          onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message, {
              duration: 3000,
            });
          },
          onSuccess: async () => {
            toast.success('profile updated successfully', { duration: 3000 });
            await queryClient.invalidateQueries(userQueryKeys.profile());
            setTimeout(() => {
              router.push('/');
            }, 2000);
          },
        }
      );
    },
    enableReinitialize: true,
  });

  return (
    <div className="container grid min-h-screen grid-cols-1 grid-rows-layout">
      <header className="flex flex-col items-center pt-8">
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

          <form className="mt-12" onSubmit={formik.handleSubmit}>
            <div className="mb-10 flex justify-center">
              <input
                type="file"
                id="image"
                className="absolute -z-10 h-[0.1px] w-[0.1px] overflow-hidden opacity-0"
                accept="image/*"
                onChange={e => {
                  if (e.currentTarget.files?.length) {
                    formik.setFieldValue('image', e.currentTarget.files[0]);
                  }
                }}
              />
              <label
                htmlFor="image"
                className="relative h-40 w-40 cursor-pointer rounded-full bg-gray-100"
              >
                {formik.values.image ? (
                  <Image
                    src={URL.createObjectURL(formik.values.image)}
                    alt=""
                    layout="fill"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : userProfile.data?.image_id ? (
                  <Image
                    src={getCloudinaryUrl(
                      userProfile.data?.image_id,
                      userProfile?.data?.image_version
                    )}
                    alt=""
                    layout="fill"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <IoPersonCircle className="h-full w-full" />
                )}

                <GoPencil
                  className="absolute bottom-2 right-4 -rotate-90 text-xl"
                  color="#0E7490"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray4" htmlFor="username">
                Username
              </label>
              <input
                className="mt-2 w-full rounded-md px-3 py-3 text-sm shadow focus:outline-none"
                id="username"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray4" htmlFor="name">
                Name
              </label>
              <input
                className="mt-2 w-full rounded-md px-3 py-3 text-sm shadow focus:outline-none"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>

            <Button
              className="mt-4 w-full justify-center rounded-md bg-corn-blue py-4 text-white shadow"
              type="submit"
              disabled={profileMutation.isLoading}
              loading={profileMutation.isLoading}
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
