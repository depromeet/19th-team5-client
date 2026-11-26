import {
  IconBellFill,
  IconXmarkLine,
} from '@karrotmarket/react-monochrome-icon';
import { type ReactNode, useId } from 'react';
import { Button, FloatingCard } from '@/components/common';
import * as cardStyles from '../lobbyCard.css';
import * as styles from './noticeCard.css';

type NoticeCardProps = {
  time: string;
  title: string;
  description: string;
  actions: ReactNode;
  onClose: () => void;
  className?: string;
};

/** 로비 우측 상단 알림 카드. Figma의 Card floating · Notification */
export function NoticeCard({
  time,
  title,
  description,
  actions,
  onClose,
  className,
}: NoticeCardProps) {
  const titleId = useId();

  return (
    <FloatingCard className={className} aria-labelledby={titleId}>
      <FloatingCard.Body>
        <div className={cardStyles.content}>
          <div className={styles.header}>
            <span className={styles.noticeIcon}>
              <IconBellFill size={20} aria-hidden='true' />
            </span>
            <p className={cardStyles.label}>알림</p>
            <time className={styles.time}>{time}</time>
            <Button
              variant='text'
              className={cardStyles.closeButton}
              aria-label='알림 닫기'
              onClick={onClose}
            >
              <IconXmarkLine size={16} aria-hidden='true' />
            </Button>
          </div>
          <div className={styles.titleGroup}>
            <h2 id={titleId} className={cardStyles.title}>
              {title}
            </h2>
            <p className={cardStyles.description}>{description}</p>
          </div>
        </div>
      </FloatingCard.Body>
      <FloatingCard.Footer>{actions}</FloatingCard.Footer>
    </FloatingCard>
  );
}
