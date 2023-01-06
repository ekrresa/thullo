import request from '@lib/request';
import { ProfileImageInput } from '@models/user';

export async function updateProfileImage(input: ProfileImageInput) {
  return request.post('/api/users/profile-image', input);
}
