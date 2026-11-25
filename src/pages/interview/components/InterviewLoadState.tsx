import { Button } from '@/components/common/button';
import * as styles from '../Interview.css';

export function InterviewLoadState({ retry }: { retry?: () => void }) {
  return (
    <main className={styles.layout}>
      <div className={styles.card}>
        {retry ? (
          <>
            <p role='alert'>면접 정보를 불러오지 못했어요.</p>
            <Button onClick={retry}>다시 시도</Button>
          </>
        ) : (
          <p role='status'>면접 정보를 불러오는 중이에요.</p>
        )}
      </div>
    </main>
  );
}
