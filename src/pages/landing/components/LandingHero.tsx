import {
  IconArrowUpLine,
  IconChevronDownLine,
} from '@karrotmarket/react-monochrome-icon';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { authApi } from '@/apis/AuthApi';
import { button } from '@/components/common/button/button.css';
import * as navStyles from '@/components/common/gnb/gnb.css';
import { gnbLabels } from '@/constants/common/gnbLabels';
import { interviewPaths } from '@/constants/common/paths';
import { useSignupProgress } from '@/hooks/signup/useSignupProgress';
import { interviewMock } from '@/mocks/interview/interview';
import { useAuthStore } from '@/stores/AuthStore';
import { getSignupResumePath } from '@/utils/signup/avatarDraft';
import * as styles from './LandingHero.css';

type LandingHeroProps = {
  entryTo: string;
};

/** 사용성 테스트 과제의 시작 화면으로 바로 들어가는 링크. */
const taskLinks = [
  {
    label: 'Task1',
    to: interviewPaths.lobbyHome,
  },
  {
    label: 'Task2',
    to: interviewPaths.lobby({ role: 'interviewer', phase: 'prepare' }),
  },
  {
    label: 'Task3',
    to: interviewPaths.waitingRoom(interviewMock.id, {
      role: 'interviewee',
      task: '3',
    }),
  },
  {
    label: 'Task4',
    to: interviewPaths.waitingRoom(interviewMock.id, { role: 'interviewer' }),
  },
] as const;

export function LandingHero({ entryTo }: LandingHeroProps) {
  const hero = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);
  const email = useAuthStore((state) => state.email);
  const signupProgress = useSignupProgress(email);
  const resumeSignupTo =
    email && signupProgress.data && !signupProgress.data.pass
      ? getSignupResumePath(signupProgress.data.avatar)
      : null;
  const labels = gnbLabels.guest;

  useEffect(() => {
    if (!hero.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      {
        rootMargin: '-72px 0px 0px',
      },
    );
    observer.observe(hero.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className={styles.header} data-scrolled={pastHero}>
        <div className={`${navStyles.content} ${styles.headerInner}`}>
          <a className={navStyles.logo} href='/' aria-label={labels.home}>
            {labels.brand}
          </a>
          <nav className={navStyles.menu} aria-label={labels.navigation}>
            <Link className={styles.navItem} to={interviewPaths.lobbyHome}>
              {labels.lobby}
            </Link>
            <a href='#service' className={styles.navItem}>
              {labels.about}
            </a>
            {email === null && (
              <Link className={styles.login} to='/login'>
                {labels.login}
              </Link>
            )}
            {resumeSignupTo && (
              <Link className={styles.login} to={resumeSignupTo}>
                가입 이어하기
              </Link>
            )}
          </nav>
          {email === null ? (
            <Link className={styles.headerCta} to='/signup'>
              회원가입
            </Link>
          ) : (
            <button
              type='button'
              className={styles.headerCta}
              onClick={authApi.logout}
            >
              로그아웃
            </button>
          )}
        </div>
      </header>
      <section id='top' ref={hero} tabIndex={-1} className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.roomCount}>
            <span className={styles.liveDot} />
            지금 열린 면접방 12개
          </span>
          <h1 className={styles.headline}>실수는 여기서, 합격은 실전에서</h1>
          <p className={styles.heroDescription}>
            아바타로 보는 20~30분 모의면접. 끝나면 면접관이 고른 키워드가
            도착해요.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.browseButton} to={interviewPaths.lobbyHome}>
              둘러보기
            </Link>
            <Link className={button({ size: 'large' })} to={entryTo}>
              면접방 입장하기
            </Link>
          </div>
          {email === null ? (
            <p className={styles.heroNote}>
              로그인 없이 로비부터 둘러볼 수 있어요.
            </p>
          ) : (
            <p className={styles.heroNote} role='status'>
              {email} 계정으로 로그인했어요.
            </p>
          )}
          <nav className={styles.taskLinks} aria-label='사용성 테스트 과제'>
            {taskLinks.map(({ label, to }) => (
              <Link key={label} className={styles.taskLink} to={to}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <a href='#how-it-works' className={styles.scrollHint}>
          서비스 소개
          <span className={styles.mouse} aria-hidden='true' />
          <IconChevronDownLine size={14} aria-hidden='true' />
        </a>
      </section>
      {pastHero && (
        <a
          href='#top'
          className={styles.backToTop}
          aria-label='맨 위로 이동'
          title='맨 위로 이동'
        >
          <IconArrowUpLine size={22} aria-hidden='true' />
        </a>
      )}
    </>
  );
}
