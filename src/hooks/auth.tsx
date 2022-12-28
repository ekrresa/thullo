import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { guestUserSignup } from '@lib/auth';
import { parseError } from '@lib/utils';

export default function useCreateGuestUserMutation() {
  const { mutate, isLoading, ...createGuestUserMutationProps } = useMutation(
    () => guestUserSignup(),
    {
      onError(error) {
        const errorMessage = parseError(error);
        toast.error(errorMessage);
      },
    }
  );

  return {
    createGuestUser: mutate,
    creatingGuestUser: isLoading,
    ...createGuestUserMutationProps,
  };
}
