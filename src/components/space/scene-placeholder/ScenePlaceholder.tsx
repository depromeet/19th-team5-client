import * as styles from './scenePlaceholder.css';

/** 3D 시안이 나오기 전까지 씬 자리를 채우는 배경. Figma의 "3D placeholder"와 같다. */
export function ScenePlaceholder({ label }: { label: string }) {
  return (
    <div className={styles.placeholder} aria-hidden='true'>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
