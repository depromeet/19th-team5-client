import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { GNB } from '@/components/common/gnb';
import { gnbLabels } from '@/constants/common/gnbLabels';
import * as styles from './Auth.css';

export function AuthLayout({
  brand,
  title,
  description,
  children,
}: {
  brand?: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <GNB
        variant='guest'
        labels={gnbLabels.guest}
        lobbyTo='/lobby'
        aboutTo='/#service'
        onLogin={() => navigate('/login')}
        onEnter={() => navigate('/signup')}
      />
      <main className={styles.main}>
        <section className={styles.card} aria-labelledby='auth-heading'>
          {brand}
          <h1 id='auth-heading' className={styles.title}>
            {title}
          </h1>
          <p className={styles.description}>{description}</p>
          {children}
        </section>
      </main>
    </div>
  );
}
