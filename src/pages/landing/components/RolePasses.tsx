import * as styles from '../HomePage.css';
import { SectionTitle } from './SectionTitle';

export function RolePasses() {
  return (
    <section className={styles.roleSection}>
      <div className={styles.container}>
        <SectionTitle label='ROLE' title='목에 건 출입증이 역할이에요' />
        <p className={styles.detailDescription}>
          면접자는 방문증, 면접관은 사원증. 면접관으로 참여하면 면접권 1장을
          받아 면접자가 될 수 있어요.
        </p>
        <div className={styles.passes}>
          <figure className={styles.pass}>
            <img
              className={styles.passImage}
              src='/images/landing/visitor-pass.webp'
              width={220}
              height={300}
              loading='lazy'
              alt='Lv.1 지원자 방문증'
            />
            <figcaption>면접권 1장으로 면접을 봐요</figcaption>
          </figure>
          <figure className={styles.pass}>
            <img
              className={styles.passImage}
              src='/images/landing/staff-pass.webp'
              width={220}
              height={300}
              loading='lazy'
              alt='면접관 사원증'
            />
            <figcaption>자소서를 읽고 질문해요 · 면접권 +1</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
