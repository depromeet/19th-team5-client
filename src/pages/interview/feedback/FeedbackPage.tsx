import { useQuery } from '@tanstack/react-query';
import { feedbackQuery } from '@/queries/InterviewQueries';
import { InterviewLoadState } from '../components/InterviewLoadState';
import * as styles from '../Interview.css';
import { InterviewLayout } from '../InterviewLayout';
import { FeedbackEditor } from './components/FeedbackEditor';

export function FeedbackPage() {
  const { data, isError, refetch } = useQuery(feedbackQuery);
  return (
    <InterviewLayout>
      {!data ? (
        <InterviewLoadState retry={isError ? refetch : undefined} />
      ) : data.candidates.length === 0 ? (
        <main className={styles.layout}>
          <p>평가할 면접자가 없어요.</p>
        </main>
      ) : (
        <FeedbackEditor sheet={data} />
      )}
    </InterviewLayout>
  );
}
