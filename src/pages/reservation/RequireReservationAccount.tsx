import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/stores/AuthStore';

export function RequireReservationAccount() {
  const email = useAuthStore((state) => state.email);
  if (email) return <Outlet />;
  return <Navigate to='/login' replace />;
}
