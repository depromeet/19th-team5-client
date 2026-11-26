import * as styles from '../HomePage.css';

export function SectionTitle({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <>
      <p className={styles.eyebrow}>{label}</p>
      <h2 className={styles.title}>{title}</h2>
    </>
  );
}
