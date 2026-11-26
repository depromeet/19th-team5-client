import {
  IconArrowUpLine,
  IconChevronDownLine,
} from '@karrotmarket/react-monochrome-icon';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { button } from '@/components/common/button/button.css';
import * as navStyles from '@/components/common/gnb/gnb.css';
import { gnbLabels } from '@/constants/common/gnbLabels';
import * as styles from './LandingHero.css';

export function LandingHero() {
  const hero = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);
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
            <Link className={styles.navItem} to='/lobby'>
              {labels.lobby}
            </Link>
            <a href='#service' className={styles.navItem}>
              {labels.about}
            </a>
            <Link className={styles.login} to='/login'>
              {labels.login}
            </Link>
          </nav>
          <Link
            className={styles.headerCta}
            to='/signup'
            aria-label={`${labels.enter} · 가입 · 아바타 만들기`}
          >
            {labels.enter}
          </Link>
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
            <Link className={styles.browseButton} to='/lobby'>
              둘러보기
            </Link>
            <Link className={button({ size: 'large' })} to='/waiting-room'>
              면접방 입장하기
            </Link>
          </div>
          <p className={styles.heroNote}>
            로그인 없이 로비부터 둘러볼 수 있어요.
          </p>
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
