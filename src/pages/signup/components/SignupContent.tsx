import { useState } from 'react';
import { Outlet, ScrollRestoration, useMatch } from 'react-router';
import { GNB } from '@/components/common/gnb';
import { gnbLabels } from '@/constants/common/gnbLabels';
import { signupPaths } from '@/constants/common/paths';
import type { SignupContext } from '@/hooks/signup/useSignupContext';
import { useSignupDraftPersistence } from '@/hooks/signup/useSignupDraftPersistence';
import { createResumeStore } from '@/stores/signup/resumeStore';
import type { SignupProgress } from '@/stores/signup/signupStorage';
import type { SignupOptions } from '@/types/Signup';
import { emptyAvatarDraft } from '@/utils/signup/avatarDraft';
import * as styles from '../Signup.css';

type SignupContentProps = {
  email: string;
  options: SignupOptions;
  progress: SignupProgress;
};

export function SignupContent({
  email,
  options,
  progress,
}: SignupContentProps) {
  const draft = useState(progress.avatar ?? emptyAvatarDraft);
  const [resume] = useState(() => createResumeStore(options, progress.draft));
  const editor = useMatch(signupPaths.resume);
  const { saveError, syncResumeDraft } = useSignupDraftPersistence(
    email,
    draft[0],
    resume,
  );

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
        {saveError && (
          <p className={styles.helper} role='alert'>
            이 브라우저에 작성 내용을 저장하지 못했어요.
          </p>
        )}
        <Outlet
          context={
            {
              avatar: draft,
              resume,
              syncResumeDraft,
              options,
              pass: progress.pass,
            } satisfies SignupContext
          }
        />
      </main>
      <ScrollRestoration />
    </div>
  );
}
