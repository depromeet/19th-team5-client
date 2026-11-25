import { useStore } from 'zustand';
import { Avatar } from '@/components/common/avatar';
import { Tag } from '@/components/common/tag';
import { Timer } from '@/components/common/timer';
import type { FeedbackStore } from '@/store/FeedbackStore';
import type { FeedbackCandidate } from '@/types/Interview';
import * as styles from '../../Interview.css';
import * as feedbackStyles from '../FeedbackPage.css';

export function FeedbackSummary({
  candidate,
  scheduleLabel,
  store,
  completed,
  total,
}: {
  candidate: FeedbackCandidate;
  scheduleLabel: string;
  store: FeedbackStore;
  completed: number;
  total: number;
}) {
  return (
    <>
      <section className={styles.card}>
        <div className={styles.inline}>
          <Avatar imageUrl={candidate.imageUrl} />
          <div className={styles.stack}>
            <h2 className={styles.cardTitle}>
              {candidate.label} · {candidate.name}
            </h2>
            <p className={styles.note}>{scheduleLabel}</p>
          </div>
        </div>
        <hr className={styles.divider} />
        {completed < total && <FeedbackCountdown store={store} />}
        <div className={styles.row}>
          <span className={styles.note}>평가 완료</span>
          <strong>
            {completed} / {total}명
          </strong>
        </div>
      </section>
      <section className={styles.card}>
        <div className={styles.row}>
          <h2 className={styles.cardTitle}>내 메모</h2>
          <Tag tone='gray'>{candidate.memos.length}개</Tag>
        </div>
        <div className={feedbackStyles.memoList}>
          {candidate.memos.map(({ part, title, body }) => (
            <article key={part} className={feedbackStyles.memo}>
              <header className={styles.inline}>
                <Tag tone='gray'>{part}</Tag>
                <span className={styles.note}>{title}</span>
              </header>
              <p className={feedbackStyles.memoText}>{body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function FeedbackCountdown({ store }: { store: FeedbackStore }) {
  const seconds = useStore(store, (state) => state.seconds);
  return (
    <div className={styles.row}>
      <span className={styles.note}>남은 시간</span>
      <div className={feedbackStyles.deadline}>
        ● 마감&nbsp;
        <Timer seconds={seconds} aria-label='평가 마감까지 남은 시간' />
      </div>
    </div>
  );
}
