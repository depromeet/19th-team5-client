import { skipToken, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/queries/queryClient';
import { readSignupProgress } from '@/stores/signup/signupStorage';

export function signupProgressKey(email: string | null) {
  return ['signup', 'progress', email] as const;
}

export function useSignupProgress(email: string | null) {
  return useQuery(
    {
      queryKey: signupProgressKey(email),
      queryFn: email ? () => readSignupProgress(email) : skipToken,
      refetchOnMount: 'always',
      gcTime: 0,
    },
    queryClient,
  );
}
