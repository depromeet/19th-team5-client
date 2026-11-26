import * as styles from '../HomePage.css';
import { SectionTitle } from './SectionTitle';

export function PeerInterviews() {
  return (
    <section className={styles.peerSection}>
      <div className={`${styles.container} ${styles.peerGrid}`}>
        <div>
          <SectionTitle
            label='품앗이 면접'
            title='오늘은 면접자, 내일은 면접관'
          />
          <p className={styles.description}>
            면접관으로 참여하면 면접권 1장.
            <br />그 면접권으로 면접자 자리를 예약해요.
          </p>
        </div>
        <img
          className={styles.fluidImage}
          src='/images/landing/role-pair.webp'
          width={600}
          height={440}
          alt='면접자 차분한 수달의 방문증과 면접관 단단한 곰의 사원증'
          loading='lazy'
        />
      </div>
    </section>
  );
}
