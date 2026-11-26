import { Link } from 'react-router';
import { button } from '@/components/common/button/button.css';
import { InterviewFeatures } from './components/InterviewFeatures';
import { InterviewSteps } from './components/InterviewSteps';
import { LandingFaq } from './components/LandingFaq';
import { LandingHero } from './components/LandingHero';
import { LevelJourney } from './components/LevelJourney';
import { LevelSummary } from './components/LevelSummary';
import { PeerInterviews } from './components/PeerInterviews';
import { RolePasses } from './components/RolePasses';
import { ServiceOverview } from './components/ServiceOverview';
import * as styles from './HomePage.css';

export function HomePage() {
  return (
    <main className={styles.page}>
      <title>MOING | 아바타 모의면접</title>
      <LandingHero />
      <InterviewSteps />
      <PeerInterviews />
      <InterviewFeatures />
      <LevelSummary />
      <LevelJourney />
      <ServiceOverview />
      <RolePasses />
      <LandingFaq />
      <section className={styles.lastInvitation}>
        <h2 className={styles.title}>오늘 열린 면접방에 입장해 보세요</h2>
        <Link
          className={button({ variant: 'outline', size: 'large' })}
          to='/waiting-room'
        >
          입장하기
        </Link>
      </section>
    </main>
  );
}
