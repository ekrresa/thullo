import { useRouter } from 'next/router';
import Image from 'next/image';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
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
      name: userProfile.data?.data?.name || '',
      username: userProfile.data?.data?.username || '',
      image: null,
    },
    onSubmit: values => {
      profileMutation.mutate(
        {
          image: values.image,
          name: values.name,
          userId: userProfile.data?.data?.id,
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
          <Logo className="w-10 mr-2" />
          <span className="font-bold text-5xl text-[#253858]">Thullo</span>
        </div>
      </header>

      <section className="flex items-start justify-center mt-24">
        <div className="flex-1 max-w-md px-8 pt-6 pb-12 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-medium text-center text-pencil">
            Setup your Profile
          </h3>

          <form className="mt-12" onSubmit={formik.handleSubmit}>
            <div className="flex justify-center mb-10">
              <input
                type="file"
                id="image"
                className="absolute w-[0.1px] h-[0.1px] opacity-0 overflow-hidden -z-10"
                accept="image/*"
                onChange={e => {
                  if (e.currentTarget.files?.length) {
                    formik.setFieldValue('image', e.currentTarget.files[0]);
                  }
                }}
              />
              <label
                htmlFor="image"
                className="relative w-40 h-40 bg-gray-100 rounded-full cursor-pointer"
              >
                {formik.values.image ? (
                  <Image
                    src={URL.createObjectURL(formik.values.image)}
                    alt=""
                    layout="fill"
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : userProfile.data?.data?.image_id ? (
                  <Image
                    src={getCloudinaryUrl(
                      userProfile.data?.data?.image_id,
                      userProfile.data?.data?.image_version
                    )}
                    alt=""
                    layout="fill"
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <IoPersonCircle className="w-full h-full" />
                )}

                <GoPencil
                  className="absolute text-xl -rotate-90 bottom-2 right-4"
                  color="#0E7490"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray4" htmlFor="username">
                Username
              </label>
              <input
                className="w-full px-3 py-3 mt-2 text-sm rounded-md shadow focus:outline-none"
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
                className="w-full px-3 py-3 mt-2 text-sm rounded-md shadow focus:outline-none"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>

            <Button
              className="justify-center w-full py-4 mt-4 text-white rounded-md shadow bg-corn-blue"
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

NewProfile.protected = true;
