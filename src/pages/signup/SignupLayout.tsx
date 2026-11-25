import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router';
import { useStore } from 'zustand';
import { signupApi } from '@/apis/SignupApi';
import { Button } from '@/components/common/button';
import type { ResumeState } from '@/store/ResumeStore';
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

export function SignupLayout() {
  const query = useQuery({
    queryKey: ['signup', 'options'],
    queryFn: signupApi.getOptions,
    staleTime: Number.POSITIVE_INFINITY,
  });

  if (query.isPending)
    return (
      <main className={styles.main} role='status'>
        가입 정보를 불러오는 중이에요.
      </main>
    );
  if (query.isError)
    return (
      <main className={styles.main}>
        <p role='alert'>가입 정보를 불러오지 못했어요.</p>
        <Button onClick={() => void query.refetch()}>다시 시도</Button>
      </main>
    );

  return <SignupContent options={query.data} />;
}
