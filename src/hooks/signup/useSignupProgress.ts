import { useQuery } from '@tanstack/react-query';
import { readSignupProgress } from '@/stores/signup/signupStorage';

export function signupProgressKey(email: string) {
  return ['signup', 'progress', email] as const;
}

export function useSignupProgress(email: string) {
  return useQuery({
    queryKey: signupProgressKey(email),
    queryFn: () => readSignupProgress(email),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 0,
  });
}
