import { GNB } from '@/components/common/gnb';
import { PageHeading } from '@/components/review/PageHeading';
import * as styles from '@/components/review/Review.css';
import { ReviewLayout } from '@/components/review/ReviewLayout';
import { gnbLabels } from '@/constants/gnbLabels';
import { receivedReviewData as review } from '@/mocks/review/ReceivedReviewData';
import { ResultComments } from './components/ResultComments';
import { ResultKeywords } from './components/ResultKeywords';
import { ResultQuestions } from './components/ResultQuestions';
import { ResultSummary } from './components/ResultSummary';
import { reviewSheet } from './ReceivedReviewPage.css';

export function ReceivedReviewPage() {
  return (
    <ReviewLayout
      header={
        <GNB variant='member' labels={gnbLabels.member} {...review.viewer} />
      }
    >
      <main className={styles.layout}>
        <article className={reviewSheet}>
          <PageHeading title='수고했어요! 결과를 확인해요'>
            받은 키워드와 한 줄 평은 나만 볼 수 있어요.
          </PageHeading>
          <ResultKeywords keywords={review.keywords} />
          <ResultComments comments={review.comments} />
          <ResultQuestions questionGroups={review.questionGroups} />
        </article>
        <ResultSummary
          scheduleLabel={review.scheduleLabel}
          levelLabel={review.levelLabel}
        />
      </main>
    </ReviewLayout>
  );
}
