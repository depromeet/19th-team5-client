import {
  IconCardFill,
  IconXmarkLine,
} from '@karrotmarket/react-monochrome-icon';
import { useId, useState } from 'react';
import { Link, type To } from 'react-router';
import { Button, FloatingCard } from '@/components/common';
import * as cardStyles from '../lobbyCard.css';
import * as styles from './upcomingInterviewCard.css';

type EmptyInterviewCardProps = {
  className?: string;
  bookingTo: To;
  reservationsTo?: To;
};

export function EmptyInterviewCard({
  className,
  bookingTo,
  reservationsTo,
}: EmptyInterviewCardProps) {
  const titleId = useId();
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <FloatingCard
      className={[styles.upcomingCard, className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <div className={styles.upcomingContent}>
        <div className={styles.upcomingHeader}>
          <span className={styles.upcomingIcon}>
            <IconCardFill size={20} aria-hidden='true' />
          </span>
          {reservationsTo ? (
            <Link
              className={styles.reservationsLink}
              to={reservationsTo}
              aria-label='내 예약 보기'
            >
              예약된 면접
            </Link>
          ) : (
            <p className={cardStyles.label}>예약된 면접</p>
          )}
          <Button
            variant='text'
            className={cardStyles.closeButton}
            aria-label='예약된 면접 카드 닫기'
            onClick={() => setOpen(false)}
          >
            <IconXmarkLine size={16} aria-hidden='true' />
          </Button>
        </div>
        <h2 id={titleId} className={cardStyles.title}>
          예약된 면접이 없습니다
        </h2>
        <p className={cardStyles.description}>
          원하는 시간대의 면접을 예약해 보세요.
        </p>
      </div>
      <FloatingCard.Footer>
        <Link className={styles.bookingLink} to={bookingTo}>
          면접방 예약
        </Link>
      </FloatingCard.Footer>
    </FloatingCard>
  );
}
