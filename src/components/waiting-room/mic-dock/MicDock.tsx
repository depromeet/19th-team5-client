import {
  IconMicrophoneFill,
  IconMicrophoneSlashFill,
} from '@karrotmarket/react-monochrome-icon';
import { Button } from '@/components/common';
import { Keycap } from '@/components/space';
import { shortcuts } from '@/constants/space/shortcuts';
import * as styles from './micDock.css';

type MicDockProps = {
  isMicOn: boolean;
  onToggleMic: () => void;
  /** 면접관만 질문지 버튼을 보여준다. */
  onOpenQuestionSheet?: () => void;
  className?: string;
};

/** 대기실 하단 가운데 독. 내 마이크를 켜고 끈다. */
export function MicDock({
  isMicOn,
  onToggleMic,
  onOpenQuestionSheet,
  className,
}: MicDockProps) {
  return (
    <div className={[styles.dock, className].filter(Boolean).join(' ')}>
      {onOpenQuestionSheet && (
        <Button
          variant='secondary'
          className={styles.sheetButton}
          aria-keyshortcuts={shortcuts.questionSheet.label}
          onClick={onOpenQuestionSheet}
        >
          질문지 <Keycap>{shortcuts.questionSheet.label}</Keycap>
        </Button>
      )}
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
    </div>
  );
}
