import { useState } from 'react';
import { useCountdown } from '@/hooks/common/useCountdown';
import { formatTime, toDurationString } from '@/utils/formatTime';
import * as styles from './evaluationSummary.css';

type EvaluationSummaryProps = {
  /** 평가표를 낼 수 있는 시간(초). 처음 보인 때부터 센다. */
  evaluationSeconds: number;
};

/** 면접관 종료 다이얼로그의 평가표 마감 시간과 보상 안내 */
export function EvaluationSummary({
  evaluationSeconds,
}: EvaluationSummaryProps) {
  const [openedAt] = useState(Date.now);
  const remainingSeconds = useCountdown(evaluationSeconds, openedAt);

  return (
    <dl className={styles.summary}>
      <div className={styles.row}>
        <dt>평가표 마감</dt>
        <dd className={styles.deadline}>
          <time dateTime={toDurationString(remainingSeconds)}>
            {formatTime(remainingSeconds)}
          </time>
        </dd>
      </div>
      <div className={styles.row}>
        <dt>면접권</dt>
        <dd className={styles.reward}>평가표를 내면 +1장</dd>
      </div>
    </dl>
  );
}
