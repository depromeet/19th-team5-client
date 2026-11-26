import {
  IconMicrophoneFill,
  IconMicrophoneSlashFill,
} from '@karrotmarket/react-monochrome-icon';
import type { ReactNode } from 'react';
import { Button } from '@/components/common';
import * as styles from './micDock.css';

type MicDockProps = {
  isMicOn: boolean;
  onToggleMic: () => void;
  className?: string;
  exitAction?: ReactNode;
};

/** 대기실 하단 가운데 독. 내 마이크를 켜고 끈다. */
export function MicDock({
  isMicOn,
  onToggleMic,
  className,
  exitAction,
}: MicDockProps) {
  return (
    <div className={[styles.dock, className].filter(Boolean).join(' ')}>
      <span className={styles.micStatus} aria-live='polite'>
        <span className={styles.micDot} data-on={isMicOn} aria-hidden='true' />
        {isMicOn ? '마이크 켜짐' : '마이크 꺼짐'}
      </span>
      <Button
        variant={isMicOn ? 'danger' : 'secondary'}
        className={styles.micButton}
        aria-label='마이크'
        aria-pressed={isMicOn}
        onClick={onToggleMic}
      >
        {isMicOn ? (
          <IconMicrophoneFill size={24} aria-hidden='true' />
        ) : (
          <IconMicrophoneSlashFill size={24} aria-hidden='true' />
        )}
      </Button>
      {exitAction}
    </div>
  );
}
