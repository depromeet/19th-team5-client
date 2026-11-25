import * as styles from './Review.css';

export function ReviewLoadState() {
  return (
    <main className={styles.layout}>
      <div className={styles.card}>
        <p role='status'>면접 정보를 불러오는 중이에요.</p>
      </div>
    </main>
  );
}
