import { Link, useNavigate } from 'react-router';
import { authApi } from '@/apis/AuthApi';
import { Button } from '@/components/common';
import { interviewPaths, reservationPaths } from '@/constants/common/paths';
import { useAuthStore } from '@/stores/AuthStore';
import type { InterviewRole } from '@/types/interview/interview';
import * as styles from './homePage.css';

const entryLabels = {
  interviewee: '면접자로 로비 입장',
  interviewer: '면접관으로 로비 입장',
} as const satisfies Record<InterviewRole, string>;

const roles = ['interviewee', 'interviewer'] as const satisfies InterviewRole[];

export function HomePage() {
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.email);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>19th-team5</h1>
      {email ? (
        <>
          <p role='status'>{email} 계정으로 로그인했어요.</p>
          <Button onClick={authApi.logout}>로그아웃</Button>
        </>
      ) : (
        <nav className={styles.actions} aria-label='계정'>
          <Link to='/login'>로그인</Link>
          <Link to='/signup'>회원가입</Link>
        </nav>
      )}
      {/* 프로토타입 진입점. 역할을 골라 면접 1시간 전(prepare) 로비로 들어간다. */}
      <div className={styles.actions}>
        {roles.map((role) => (
          <Button
            key={role}
            size='large'
            variant={role === 'interviewer' ? 'secondary' : 'primary'}
            onClick={() =>
              navigate(interviewPaths.lobby({ role, phase: 'prepare' }))
            }
          >
            {entryLabels[role]}
          </Button>
        ))}
      </div>
      <Link to={reservationPaths.rooms}>면접방 예약</Link>
      <Link to='/write-review'>평가 작성</Link>
      <Link to='/received-review'>받은 리뷰</Link>
    </main>
  );
}
