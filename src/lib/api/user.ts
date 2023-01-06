import request from '@lib/request';
import { ProfileImageInput, UserProfileInput } from '@models/user';

export async function updateProfileImage(input: ProfileImageInput) {
  return request.post('/api/users/profile-image', input);
}

export async function updateProfile(input: UserProfileInput) {
  return request.post('/api/users/profile', input);
}
