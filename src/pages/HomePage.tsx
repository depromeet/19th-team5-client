import { Link } from 'react-router';
import { button } from '@/components/common/button/button.css';
import * as styles from './HomePage.css';

export function HomePage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>19th-team5</h1>
      <nav className={styles.links} aria-label='면접 평가'>
        <Link
          className={`${button({ variant: 'primary' })} ${styles.link}`}
          to='/write-review'
        >
          평가 작성
        </Link>
        <Link
          className={`${button({ variant: 'secondary' })} ${styles.link}`}
          to='/received-review'
        >
          받은 리뷰
        </Link>
      </nav>
    </main>
  );
}
