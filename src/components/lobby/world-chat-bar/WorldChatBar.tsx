import {
  IconChevronUpLine,
  IconHorizline2VerticalChatbubbleRectangularCenterLine,
} from '@karrotmarket/react-monochrome-icon';
import { Tag } from '@/components/common';
import * as styles from './worldChatBar.css';

/**
 * 로비 좌측 하단 월드 채팅. 프로토타입에서는 자리만 두고 채팅 기능은 연결하지 않는다.
 */
export function WorldChatBar({ className }: { className?: string }) {
  return (
    <section
      className={[styles.bar, className].filter(Boolean).join(' ')}
      aria-label='월드 채팅 (준비 중)'
    >
      <Tag className={styles.noticeTag}>공지</Tag>
      <p className={styles.notice}>11.21 (토) 02–04시 서버 점검</p>
      <span className={styles.chatChip}>
        <IconHorizline2VerticalChatbubbleRectangularCenterLine
          size={14}
          aria-hidden='true'
        />
        월드 12
      </span>
      <IconChevronUpLine
        className={styles.expandIcon}
        size={16}
        aria-hidden='true'
      />
    </section>
  );
}
