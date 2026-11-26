import {
  IconCardFill,
  IconXmarkLine,
} from '@karrotmarket/react-monochrome-icon';
import { type ReactNode, useId } from 'react';
import { Button, FloatingCard } from '@/components/common';
import { formatTime, toDurationString } from '@/utils/formatTime';
import * as cardStyles from '../lobbyCard.css';
import * as styles from './upcomingInterviewCard.css';

type UpcomingInterviewCardProps = {
  label: string;
  title: string;
  summary: string;
  countdownLabel: string;
  remainingSeconds: number;
  /** 0~1. 첫 알림(시작 1시간 전)부터 면접 시작까지 흐른 시간의 비율 */
  progress: number;
  actions: ReactNode;
  onClose: () => void;
  className?: string;
};

/** 로비 우측 하단 예약 카드. Figma의 Next Interview */
export function UpcomingInterviewCard({
  label,
  title,
  summary,
  countdownLabel,
  remainingSeconds,
  progress,
  actions,
  onClose,
  className,
}: UpcomingInterviewCardProps) {
  const titleId = useId();
  const percent = Math.round(Math.min(Math.max(progress, 0), 1) * 100);

  return (
    <FloatingCard
      className={[styles.upcomingCard, className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <FloatingCard.Body>
        <div className={styles.upcomingContent}>
          <div className={styles.upcomingHeader}>
            <span className={styles.upcomingIcon}>
              <IconCardFill size={20} aria-hidden='true' />
            </span>
            <p className={cardStyles.label}>{label}</p>
            <Button
              variant='text'
              className={cardStyles.closeButton}
              aria-label={`${label} 카드 닫기`}
              onClick={onClose}
            >
              <IconXmarkLine size={16} aria-hidden='true' />
            </Button>
          </div>
          <h2 id={titleId} className={cardStyles.title}>
            {title}
          </h2>
          <p className={cardStyles.description}>{summary}</p>
          <div className={styles.countdown}>
            <p className={styles.countdownRow}>
              {countdownLabel}
              <time
                className={styles.countdownValue}
                dateTime={toDurationString(remainingSeconds)}
              >
                {formatTime(remainingSeconds)}
              </time>
            </p>
            <div className={styles.track} aria-hidden='true'>
              <div className={styles.fill} style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </FloatingCard.Body>
      <FloatingCard.Footer>{actions}</FloatingCard.Footer>
    </FloatingCard>
  );
}
