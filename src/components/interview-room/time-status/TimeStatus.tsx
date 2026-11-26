import { useId } from 'react';
import { Timer } from '@/components/common';
import { formatTime, toDurationString } from '@/utils/formatTime';
import * as styles from './timeStatus.css';

type PartProgress = {
  /** 예) 1부 · 공통 질문 */
  label: string;
  elapsedSeconds: number;
  totalSeconds: number;
};

type TimeStatusProps = {
  /** 면접이 끝날 때까지 남은 시간(초) */
  remainingSeconds: number;
  /** 넘기면 지금 부의 진행 시간을 함께 보여준다. 면접관 화면에서 쓴다. */
  partProgress?: PartProgress;
  className?: string;
};

/** 면접방 오른쪽 위 시간 표시. 면접 전체의 남은 시간을 보여준다. */
export function TimeStatus({
  remainingSeconds,
  partProgress,
  className,
}: TimeStatusProps) {
  const labelId = useId();

  return (
    <div className={[styles.status, className].filter(Boolean).join(' ')}>
      {partProgress && (
        <>
          <PartProgressBar {...partProgress} />
          <span className={styles.divider} aria-hidden='true' />
        </>
      )}
      <span id={labelId} className={styles.remainingLabel}>
        남은 시간
      </span>
      <Timer tone='dark' seconds={remainingSeconds} aria-labelledby={labelId} />
    </div>
  );
}

function PartProgressBar({
  label,
  elapsedSeconds,
  totalSeconds,
}: PartProgress) {
  const percent =
    totalSeconds > 0
      ? Math.round(
          Math.min(Math.max(elapsedSeconds / totalSeconds, 0), 1) * 100,
        )
      : 0;

  return (
    <div className={styles.progress}>
      <p className={styles.progressText}>
        <span className={styles.progressLabel}>{label}</span>
        <span className={styles.progressTime}>
          <time dateTime={toDurationString(elapsedSeconds)}>
            {formatTime(elapsedSeconds)}
          </time>
          {' / '}
          <time dateTime={toDurationString(totalSeconds)}>
            {formatTime(totalSeconds)}
          </time>
        </span>
      </p>
      <div className={styles.track} aria-hidden='true'>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
