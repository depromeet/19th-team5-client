import { useQuery } from '@tanstack/react-query';
import { type Dispatch, type SetStateAction, useState } from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useMatch,
  useOutletContext,
} from 'react-router';
import { useStore } from 'zustand';
import { signupApi } from '@/apis/SignupApi';
import { Button } from '@/components/common/button';
import { GNB } from '@/components/common/gnb';
import { gnbLabels } from '@/constants/gnbLabels';
import type { SignupOptions } from '@/types/Signup';
import { type AvatarDraft, initialDraft } from './AvatarDraft';
import { createResumeStore, type ResumeState } from './resume/ResumeStore';
import * as styles from './Signup.css';

type DraftState<T> = [T, Dispatch<SetStateAction<T>>];
type SignupContext = {
  avatar: DraftState<AvatarDraft>;
  resume: ReturnType<typeof createResumeStore>;
  options: SignupOptions;
};

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

function SignupContent({
  options: initialOptions,
}: {
  options: SignupOptions;
}) {
  const { state } = useLocation();
  const draft = useState(() => initialDraft(state));
  const [options] = useState(() => initialOptions);
  const [resume] = useState(() => createResumeStore(options));
  const editor = useMatch('/signup/resume');

  return (
    <div className={styles.signup}>
      {/* 회원 메뉴는 각 목적지 화면이 연결되면 활성화한다. */}
      <div inert>
        <GNB
          variant='member'
          labels={gnbLabels.member}
          lobbyTo='/'
          myPageTo='/my-page'
          notificationsTo='/notifications'
          ticketCount={options.navigation.ticketCount}
          hasUnreadNotifications={options.navigation.hasUnreadNotifications}
          onBookInterview={() => {}}
        />
      </div>
      <main className={editor ? undefined : styles.main}>
        <Outlet
          context={{ avatar: draft, resume, options } satisfies SignupContext}
        />
      </main>
      <ScrollRestoration />
    </div>
  );
}
