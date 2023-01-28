import request from '@lib/request';
import { ProfileImageInput, UserProfileInput } from '@models/user';
import { User } from '@models/index';

export async function getUserProfile() {
  return request.get<User>('/api/users/profile');
}

export async function updateProfileImage(input: ProfileImageInput) {
  return request.post('/api/users/profile-image', input);
}

export async function updateProfile(input: UserProfileInput) {
  return request.post<User>('/api/users/profile', input);
}

export const UserService = {
  getUserProfile,
  updateProfileImage,
  updateProfile,
};
