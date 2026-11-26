import { Link } from 'react-router';
import { button } from '@/components/common/button/button.css';
import * as styles from './HomePage.css';

export function HomePage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>19th-team5</h1>
      <nav className={styles.links} aria-label='페이지 이동'>
        <Link
          className={`${button({ variant: 'primary' })} ${styles.link}`}
          to='/signup/avatar'
        >
          가입 · 아바타 만들기
        </Link>
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
