import {
  IconReviewDelivery,
  IconReviewExample,
  IconReviewImprovement,
} from '@/assets/icons';
import { Tag } from '@/components/common/tag';
import * as styles from '@/components/review/Review.css';
import type { ReceivedKeyword } from '@/types/Interview';
import * as resultStyles from '../ReceivedReviewPage.css';

const keywordIcons = {
  example: IconReviewExample,
  delivery: IconReviewDelivery,
  improvement: IconReviewImprovement,
};
export function ResultKeywords({ keywords }: { keywords: ReceivedKeyword[] }) {
  return (
    <section className={resultStyles.section}>
      <div className={resultStyles.sectionHeading}>
        <h2 className={styles.subtitle}>받은 키워드</h2>
        <p className={styles.note}>면접관이 느낀 나의 면접 키워드예요.</p>
      </div>
      {keywords.length === 0 ? (
        <p className={styles.note}>아직 받은 키워드가 없어요.</p>
      ) : (
        <div className={resultStyles.keywords}>
          {keywords.map(({ label, positive, count, icon }) => {
            const Icon = keywordIcons[icon];
            return (
              <div className={resultStyles.keyword} key={label}>
                <Tag tone={positive ? 'green' : 'red'}>
                  {positive ? '좋았던 점' : '아쉬운 점'}
                </Tag>
                <Icon className={resultStyles.keywordIcon} aria-hidden />
                <div className={resultStyles.keywordCaption}>
                  <strong className={styles.cardTitle}>{label}</strong>
                  <span className={styles.note}>
                    면접관 {count}명이 체크했어요
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
