import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { signupApi } from '@/apis/SignupApi';
import { signupPaths } from '@/constants/common/paths';
import { useAuthStore } from '@/stores/AuthStore';
import type { SignupProgress } from '@/stores/signup/signupStorage';
import type { SignupSubmission } from '@/types/Signup';
import { signupProgressKey } from './useSignupProgress';

export function useSignupCompletion() {
  const navigate = useNavigate();
  const email = useAuthStore((session) => session.email);
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, reset } = useMutation({
    mutationFn: signupApi.completeSignup,
  });

  function complete(submission: SignupSubmission, onSaved?: () => void) {
    if (!email || isPending) return;
    mutate(submission, {
      onSuccess: (pass) => {
        if (useAuthStore.getState().email !== email) return;
        onSaved?.();
        queryClient.setQueryData<SignupProgress>(
          signupProgressKey(email),
          (progress) => ({ ...progress, pass }),
        );
        navigate(signupPaths.pass, { replace: true });
      },
    });
  }

  return { complete, isPending, isError, reset };
}
