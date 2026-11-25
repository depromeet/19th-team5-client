import { Button } from '@/components/common/button';
import * as styles from '@/components/review/Review.css';
import * as resultStyles from '../ReceivedReviewPage.css';

export function ResultSummary({
  scheduleLabel,
  levelLabel,
}: {
  scheduleLabel: string;
  levelLabel: string;
}) {
  return (
    <aside className={styles.side}>
      <section className={styles.card}>
        <img
          className={resultStyles.envelope}
          src='/images/interview-result-envelope.svg'
          alt=''
        />
        <div className={resultStyles.sectionHeading}>
          <h2 className={styles.cardTitle}>결과 봉투가 도착했어요</h2>
          <p className={styles.note}>{scheduleLabel}</p>
        </div>
        <hr className={styles.divider} />
        <div className={resultStyles.level}>
          <span className={styles.note}>레벨</span>
          <b>{levelLabel}</b>
        </div>
      </section>
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>면접관 자리에도 앉아볼까요?</h2>
        <Button className={resultStyles.reserveButton} size='large' disabled>
          다른 면접 예약
        </Button>
        <Button
          className={resultStyles.lobbyButton}
          size='large'
          variant='secondary'
          disabled
        >
          로비로 돌아가기
        </Button>
      </section>
    </aside>
  );
}
