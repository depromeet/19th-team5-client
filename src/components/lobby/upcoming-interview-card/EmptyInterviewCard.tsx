import { IconCardFill } from '@karrotmarket/react-monochrome-icon';
import { type ReactNode, useId } from 'react';
import { FloatingCard } from '@/components/common';
import * as styles from './upcomingInterviewCard.css';

type EmptyInterviewCardProps = {
  className?: string;
  action?: ReactNode;
};

export function EmptyInterviewCard({
  className,
  action,
}: EmptyInterviewCardProps) {
  const titleId = useId();

  return (
    <FloatingCard className={className} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.emptyTitle}>
        <span className={styles.upcomingIcon}>
          <IconCardFill size={20} aria-hidden='true' />
        </span>
        예약된 면접이 없습니다
      </h2>
      {action && <FloatingCard.Footer>{action}</FloatingCard.Footer>}
    </FloatingCard>
  );
}
