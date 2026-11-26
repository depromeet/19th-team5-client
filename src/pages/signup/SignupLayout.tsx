import { useQuery } from '@tanstack/react-query';
import {
  Navigate,
  useLocation,
  useMatch,
  useOutletContext,
} from 'react-router';
import { useStore } from 'zustand';
import { signupApi } from '@/apis/SignupApi';
import { Button } from '@/components/common/button';
import { signupPaths } from '@/constants/common/paths';
import { useSignupProgress } from '@/hooks/signup/useSignupProgress';
import { useAuthStore } from '@/stores/AuthStore';
import type { ResumeState } from '@/stores/ResumeStore';
import { SignupContent, type SignupContext } from './components/SignupContent';
import * as styles from './Signup.css';

export function useAvatarDraft() {
  return useOutletContext<SignupContext>().avatar;
}
export function useResumeStore<T>(select: (state: ResumeState) => T) {
  return useStore(useOutletContext<SignupContext>().resume, select);
}

export function useSignupOptions() {
  return useOutletContext<SignupContext>().options;
}

export function useIssuedPass() {
  return useOutletContext<SignupContext>().pass;
}

export function SignupLayout() {
  const email = useAuthStore((state) => state.email);
  const { state } = useLocation();
  if (!email)
    return <Navigate to={signupPaths.account} state={state} replace />;
  return <SignupDraftLoader key={email} email={email} />;
}

function SignupDraftLoader({ email }: { email: string }) {
  const onPass = useMatch(signupPaths.pass);
  const { state } = useLocation();
  const options = useQuery({
    queryKey: ['signup', 'options'],
    queryFn: signupApi.getOptions,
    staleTime: Number.POSITIVE_INFINITY,
  });
  const progress = useSignupProgress(email);

  if (options.isPending || progress.isPending)
    return (
      <main className={styles.main} role='status'>
        가입 정보를 불러오는 중이에요.
      </main>
    );
  if (options.isError || progress.isError)
    return (
      <main className={styles.main}>
        <p role='alert'>가입 정보를 불러오지 못했어요.</p>
        <Button
          onClick={() => {
            if (options.isError) void options.refetch();
            if (progress.isError) void progress.refetch();
          }}
        >
          다시 시도
        </Button>
      </main>
    );

  if (progress.data.pass && !onPass)
    return <Navigate to={signupPaths.pass} state={state} replace />;
  return (
    <SignupContent
      email={email}
      options={options.data}
      progress={progress.data}
    />
  );
}
