import { IconILowercaseSerifCircleLine } from '@karrotmarket/react-monochrome-icon';
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useMatch,
  useOutletContext,
} from 'react-router';
import { useStore } from 'zustand';
import { GNB } from '@/components/common/gnb';
import { gnbLabels } from '@/constants/gnbLabels';
import { type AvatarDraft, initialDraft } from './AvatarDraft';
import { createResumeStore, type ResumeState } from './resume/ResumeStore';
import * as styles from './Signup.css';

type DraftState<T> = [T, Dispatch<SetStateAction<T>>];
type SignupContext = {
  avatar: DraftState<AvatarDraft>;
  resume: ReturnType<typeof createResumeStore>;
};

export function useAvatarDraft() {
  return useOutletContext<SignupContext>().avatar;
}
export function useResumeStore<T>(select: (state: ResumeState) => T) {
  return useStore(useOutletContext<SignupContext>().resume, select);
}

export function SignupLayout() {
  const { state } = useLocation();
  const draft = useState(() => initialDraft(state));
  const [resume] = useState(createResumeStore);
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
          ticketCount={2}
          hasUnreadNotifications
          onBookInterview={() => {}}
        />
      </div>
      <main className={editor ? undefined : styles.main}>
        <Outlet context={{ avatar: draft, resume } satisfies SignupContext} />
      </main>
      <ScrollRestoration />
    </div>
  );
}

type SignupStepProps = {
  title: string;
  notice: string;
  preview: ReactNode;
  previewClassName?: string;
  children: ReactNode;
};

export function SignupStep({
  title,
  notice,
  preview,
  previewClassName,
  children,
}: SignupStepProps) {
  return (
    <div className={styles.step}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.notice}>
          <IconILowercaseSerifCircleLine
            className={styles.noticeIcon}
            size={20}
            aria-hidden='true'
          />
          {notice}
        </p>
      </div>
      <div className={previewClassName ?? styles.preview}>{preview}</div>
      {children}
    </div>
  );
}
