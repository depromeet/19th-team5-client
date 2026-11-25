import type { ReactNode } from 'react';
import { Link } from 'react-router';
import * as navigation from '@/components/common/gnb/gnb.css';
import { gnbLabels } from '@/constants/gnbLabels';
import * as styles from './Interview.css';

export function InterviewLayout({
  header,
  children,
}: {
  header?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.page}>
      {header ?? (
        <header className={navigation.header}>
          <div className={navigation.content}>
            <Link
              className={navigation.logo}
              to='/'
              aria-label={gnbLabels.member.home}
            >
              {gnbLabels.member.brand}
            </Link>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
