import { useLoaderData } from 'react-router';
import * as styles from '@/components/review/Review.css';
import { ReviewLayout } from '@/components/review/ReviewLayout';
import { loadWriteReview } from '@/mocks/review/WriteReviewSession';
import { FeedbackEditor } from './components/FeedbackEditor';

export { loadWriteReview as loader };

export function FeedbackPage() {
  const sheet = useLoaderData<typeof loadWriteReview>();
  return (
    <ReviewLayout>
      {sheet.candidates.length === 0 ? (
        <main className={styles.layout}>
          <p>평가할 면접자가 없어요.</p>
        </main>
      ) : (
        <FeedbackEditor sheet={sheet} />
      )}
    </ReviewLayout>
  );
}
