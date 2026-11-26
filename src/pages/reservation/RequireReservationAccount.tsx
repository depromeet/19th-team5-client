import { Navigate, Outlet, useLocation } from 'react-router';
import { Button } from '@/components/common/button';
import { useSignupProgress } from '@/hooks/signup/useSignupProgress';
import { getSignupResumePath } from '@/pages/signup/AvatarDraft';
import { useAuthStore } from '@/stores/AuthStore';
import * as styles from './reservation.css';

export function RequireReservationAccount() {
  const email = useAuthStore((state) => state.email);
  const { pathname, search, hash } = useLocation();
  const progress = useSignupProgress(email);
  const state = { reservationReturnTo: pathname + search + hash };

  if (!email) return <Navigate to='/login' state={state} replace />;
  if (progress.isPending) {
    return (
      <main className={styles.main} role='status'>
        가입 상태를 확인하는 중이에요.
      </main>
    );
  }
  if (progress.isError) {
    return (
      <main className={styles.main}>
        <p role='alert'>가입 상태를 확인하지 못했어요.</p>
        <Button onClick={() => void progress.refetch()}>다시 시도</Button>
      </main>
    );
  }
  if (!progress.data.pass) {
    return (
      <Navigate
        to={getSignupResumePath(progress.data.avatar)}
        state={state}
        replace
      />
    );
  }
  return <Outlet />;
}
