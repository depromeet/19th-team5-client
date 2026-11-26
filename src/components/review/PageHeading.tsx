import { IconILowercaseSerifCircleLine } from '@karrotmarket/react-monochrome-icon';
import type { ReactNode } from 'react';
import * as styles from './Review.css';

export function PageHeading({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <header>
      <h1 className={styles.heading}>{title}</h1>
      <div className={styles.info}>
        <IconILowercaseSerifCircleLine size={16} aria-hidden />
        {children}
      </div>
    </header>
  );
}
