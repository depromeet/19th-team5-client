import * as styles from '../HomePage.css';
import { interviewLevels } from './LevelSummary';
import { SectionTitle } from './SectionTitle';

export function LevelJourney() {
  return (
    <section className={styles.levelSection}>
      <div className={styles.container}>
        <SectionTitle label='레벨' title='볼수록 올라가는 출입증 레벨' />
        <p className={styles.description}>
          면접자든 면접관이든, 한 번 볼 때마다 한 칸씩.
        </p>
        <ol className={styles.staircase}>
          {interviewLevels.map((level, index) => (
            <li key={level.name} className={styles.stair}>
              <div className={styles.levelTile} aria-hidden='true'>
                {index + 1}
              </div>
              <div className={styles.levelCaption}>
                <span>Lv.{index + 1}</span>
                <h3 className={styles.levelName}>{level.name}</h3>
                <span>{level.requirement}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
