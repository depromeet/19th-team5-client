import { Timer } from '@/components/common';
import * as styles from './roomStatus.css';

type RoomStatusProps = {
  title: string;
  remainingSeconds: number;
  className?: string;
};

/** 대기실 상단 가운데 상태. 방 이름과 "시작까지" 남은 시간을 보여준다. */
export function RoomStatus({
  title,
  remainingSeconds,
  className,
}: RoomStatusProps) {
  return (
    <div className={[styles.status, className].filter(Boolean).join(' ')}>
      <span className={styles.statusLabel}>대기실</span>
      <span className={styles.statusTitle}>{title}</span>
      <Timer tone='dark' label='시작까지' seconds={remainingSeconds} />
    </div>
  );
}
