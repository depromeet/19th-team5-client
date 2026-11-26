import {
  IconBracketLeftArrowRightLine,
  IconMicrophoneFill,
  IconMicrophoneSlashFill,
} from '@karrotmarket/react-monochrome-icon';
import { Button, Pulse } from '@/components/common';
import * as styles from './interviewDock.css';

type InterviewDockProps = {
  isMicOn: boolean;
  /** 넘기면 마이크가 켜져 있을 때 버튼에 내 목소리 크기를 보여준다. 부가 진행되는 동안 넘긴다. */
  voiceStream?: MediaStream | null;
  onToggleMic: () => void;
  /** 넘기면 나가기 버튼을 보여준다. */
  onLeave?: () => void;
  className?: string;
};

/** 면접방 하단 독. 내 마이크를 켜고 끄고, 면접이 시작되면 나가기 버튼을 함께 둔다. */
export function InterviewDock({
  isMicOn,
  voiceStream,
  onToggleMic,
  onLeave,
  className,
}: InterviewDockProps) {
  return (
    <div className={[styles.dock, className].filter(Boolean).join(' ')}>
      <span className={styles.micStatus} aria-live='polite'>
        <span className={styles.micDot} data-on={isMicOn} aria-hidden='true' />
        {isMicOn ? '마이크 켜짐' : '마이크 꺼짐'}
      </span>
      <Button
        variant={isMicOn ? 'danger' : 'secondary'}
        className={styles.iconButton}
        aria-label='마이크'
        aria-pressed={isMicOn}
        onClick={onToggleMic}
      >
        {!isMicOn ? (
          <IconMicrophoneSlashFill size={24} aria-hidden='true' />
        ) : voiceStream ? (
          <Pulse stream={voiceStream} />
        ) : (
          <IconMicrophoneFill size={24} aria-hidden='true' />
        )}
      </Button>
      {onLeave && (
        <Button
          variant='secondary'
          className={styles.leaveButton}
          aria-label='면접 나가기'
          onClick={onLeave}
        >
          <IconBracketLeftArrowRightLine size={24} aria-hidden='true' />
        </Button>
      )}
    </div>
  );
}
