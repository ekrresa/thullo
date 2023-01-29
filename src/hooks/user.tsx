import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useProfileStore } from 'src/stores/profile'

import { UserService } from '@lib/api/user'
import { supabase } from '@lib/supabase'
import { parseError } from '@lib/utils'
import { UserProfile } from '@models/database'
import { UserProfileInput } from '@models/user'

export const userQueryKeys = {
  users: () => ['users'],
  profile: () => ['userProfile'],
}

export function useUserProfile() {
  const user = supabase.auth.user()

  return useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: async () => {
      const result = await supabase
        .from<UserProfile>('profiles')
        .select()
        .match({ id: user?.id })
        .single()

      if (result.status === 401) await supabase.auth.signOut()
      if (result.error) throw result.error

      return result.data
    },
    staleTime: Infinity,
  })
}

export function useGetUserProfile() {
  const { mutate } = useMutation(() => UserService.getUserProfile())

  return { getUserProfile: mutate }
}

interface CurrentUserProps {
  requireAuth: boolean
}
export function useAuth(props?: CurrentUserProps) {
  const { requireAuth = true } = props || {}
  const { status } = useSession({ required: requireAuth })

  return status === 'authenticated'
}

export function useFetchUsers(userId: string = '') {
  return useQuery({
    queryKey: userQueryKeys.users(),
    queryFn: async () => {
      const result = await supabase
        .from<UserProfile>('profiles')
        .select()
        .neq('id', userId)
        .order('name', { ascending: true })

      if (result.status === 401) await supabase.auth.signOut()
      if (result.error) throw result.error

      return result.data
    },
    enabled: Boolean(userId),
    staleTime: Infinity,
  })
}

export function useUpdateProfileImage() {
  const updateProfile = useProfileStore(state => state.updateProfile)

  const { mutate, isLoading, ...mutationProps } = useMutation(
    (payload: UserProfileInput) => {
      return UserService.updateProfile(payload)
    },
    {
      onError(error) {
        const errorMessage = parseError(error)
        toast.error(errorMessage)
      },
      onSuccess(response) {
        toast.success('Your profile was updated')
        updateProfile(response.data)
      },
    }
  )

  return {
    updateProfileImage: mutate,
    updatingProfileImage: isLoading,
    ...mutationProps,
  }
}

export function useUpdateProfile() {
  const updateProfile = useProfileStore(state => state.updateProfile)

  const { mutate, isLoading, ...mutationProps } = useMutation(
    (payload: UserProfileInput) => UserService.updateProfile(payload),
    {
      onError(error) {
        const errorMessage = parseError(error)
        toast.error(errorMessage)
      },
      onSuccess(response) {
        toast.success('Your profile was updated')
        updateProfile(response.data)
      },
    }
  )

  return {
    updateProfile: mutate,
    updatingProfile: isLoading,
    ...mutationProps,
  }
}
