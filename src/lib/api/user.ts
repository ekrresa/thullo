import request from '@lib/request'
import { User } from '@models/index'
import { UserProfileInput } from '@models/user'

export async function getUserProfile() {
  return request.get<User>('/api/users/profile')
}

export async function updateProfile(input: UserProfileInput) {
  return request.post<User>('/api/users/profile', input)
}

export const UserService = {
  getUserProfile,
  updateProfile,
}
