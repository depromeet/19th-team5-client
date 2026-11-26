import * as styles from '../HomePage.css';

type SectionTitleProps = {
  label: string;
  title: string;
};

export function SectionTitle({ label, title }: SectionTitleProps) {
  return (
    <>
      <p className={styles.eyebrow}>{label}</p>
      <h2 className={styles.title}>{title}</h2>
    </>
  );
}
