import { Link } from 'react-router';
import { authApi } from '@/apis/AuthApi';
import { Button } from '@/components/common/button';
import { button } from '@/components/common/button/button.css';
import { useAuthStore } from '@/stores/AuthStore';
import * as styles from './HomePage.css';

export function HomePage() {
  const email = useAuthStore((state) => state.email);
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>19th-team5</h1>
      <p id='about'>
        현직자의 질문으로 면접자와 면접관을 오가며 연습하는 메타버스 모의면접
        서비스입니다.
      </p>
      {email && <p role='status'>{email} 계정으로 로그인했어요.</p>}
      <nav className={styles.links} aria-label='페이지 이동'>
        {email ? (
          <Button onClick={authApi.logout}>로그아웃</Button>
        ) : (
          <>
            <Link
              className={`${button({ variant: 'primary' })} ${styles.link}`}
              to='/login'
            >
              로그인
            </Link>
            <Link
              className={`${button({ variant: 'primary' })} ${styles.link}`}
              to='/signup'
            >
              회원가입
            </Link>
          </>
        )}
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
