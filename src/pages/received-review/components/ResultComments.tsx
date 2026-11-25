import { IconChevronDownLine } from '@karrotmarket/react-monochrome-icon';
import * as styles from '@/components/review/Review.css';
import type { ReceivedReview } from '@/types/Interview';
import * as resultStyles from '../ReceivedReviewPage.css';

export function ResultComments({ comments }: Pick<ReceivedReview, 'comments'>) {
  return (
    <section className={resultStyles.section}>
      <div className={styles.row}>
        <h2 className={styles.subtitle}>한 줄 평</h2>
        <span className={styles.note}>{comments.length}개</span>
      </div>
      {comments.length === 0 && (
        <p className={styles.note}>아직 받은 한 줄 평이 없어요.</p>
      )}
      {comments.map(({ id, author, text }) => (
        <details key={id} className={resultStyles.details} open>
          <summary className={resultStyles.summary}>
            {author}
            <IconChevronDownLine size={18} aria-hidden />
          </summary>
          <div className={resultStyles.answer}>
            <p className={styles.text}>{text}</p>
          </div>
        </details>
      ))}
    </section>
  );
}
