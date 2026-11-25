import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/common';
import { interviewPaths } from '@/constants/common/paths';
import type { InterviewRole } from '@/types/interview/interview';
import * as styles from './homePage.css';

const entryLabels = {
  interviewee: '면접자로 로비 입장',
  interviewer: '면접관으로 로비 입장',
} as const satisfies Record<InterviewRole, string>;

const roles = ['interviewee', 'interviewer'] as const satisfies InterviewRole[];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>19th-team5</h1>
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
      <Link to='/signup/avatar'>가입 · 아바타 만들기</Link>
    </main>
  );
}
