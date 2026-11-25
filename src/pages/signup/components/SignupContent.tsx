import { type Dispatch, type SetStateAction, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation, useMatch } from 'react-router';
import { GNB } from '@/components/common/gnb';
import { gnbLabels } from '@/constants/gnbLabels';
import { createResumeStore } from '@/store/ResumeStore';
import type { SignupOptions } from '@/types/Signup';
import { type AvatarDraft, initialDraft } from '../AvatarDraft';
import * as styles from '../Signup.css';

export type SignupContext = {
  avatar: [AvatarDraft, Dispatch<SetStateAction<AvatarDraft>>];
  resume: ReturnType<typeof createResumeStore>;
  options: SignupOptions;
};

export function SignupContent({
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
