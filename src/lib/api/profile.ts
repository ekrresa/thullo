import { axiosClient } from '@lib/axios';
import { supabase } from '@lib/supabase';
import { UploadApiResponse } from 'cloudinary';

interface UserProfileInput {
  username: string;
  userId: string;
  name: string;
  image: File;
}

export async function updateProfile(data: Partial<UserProfileInput>) {
  let imageId: string | undefined;
  let imageVersion: string | undefined;

  if (data.image) {
    const sigResult = await axiosClient.post('/api/images/cloudinary-signature', {
      folder: 'thullo',
      public_id: `${data.userId}_profile`,
    });

    const formData = new FormData();
    formData.set('file', data.image);
    formData.set('folder', 'thullo');
    formData.set('api_key', sigResult.data.api_key);
    formData.set('public_id', `${data.userId}_profile`);
    formData.set('signature', sigResult.data.signature);
    formData.set('timestamp', sigResult.data.timestamp);

    const uploadResult = await axiosClient.post<UploadApiResponse>(
      `https://api.cloudinary.com/v1_1/chuck-huey/image/upload`,
      formData
    );

    imageId = uploadResult.data.public_id;
    imageVersion = 'v' + uploadResult.data.version;
  }

  const result = await supabase.from('profiles').update(
    {
      name: data.name,
      username: data.username,
      is_profile_setup: true,
      image_id: imageId,
      image_version: imageVersion,
    },
    { returning: 'minimal' }
  );

  if (result.error) {
    throw result.error;
  }

  return result;
}
