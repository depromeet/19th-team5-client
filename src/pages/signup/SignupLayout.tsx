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
  useOutletContext,
} from 'react-router';
import { GNB } from '@/components/common/gnb';
import { gnbLabels } from '@/constants/gnbLabels';
import { type AvatarDraft, initialDraft } from './avatarDraft';
import * as styles from './signup.css';

export function useAvatarDraft() {
  return useOutletContext<
    [AvatarDraft, Dispatch<SetStateAction<AvatarDraft>>]
  >();
}

export function SignupLayout() {
  const { state } = useLocation();
  const draft = useState(() => initialDraft(state));

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
      <main className={styles.main}>
        <Outlet context={draft} />
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
