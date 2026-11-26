import { Outlet, useLocation, useNavigate } from 'react-router';
import { GNB } from '@/components/common';
import { gnbLabels } from '@/constants/common/gnbLabels';
import { reservationPaths } from '@/constants/common/paths';
import { useReservationNotices } from '@/hooks/reservation/useReservationNotices';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import * as styles from './reservation.css';

export function ReservationLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tickets = useReservationStore((state) => state.tickets);
  const notices = useReservationNotices();
  const readIds = useReservationStore((state) => state.readNoticeIds);
  return (
    <div className={styles.page}>
      <GNB
        variant='member'
        labels={gnbLabels.member}
        ticketCount={tickets}
        hasUnreadNotifications={notices.some(
          (notice) => !readIds.includes(notice.id),
        )}
        lobbyTo='/lobby'
        notificationsTo={reservationPaths.notifications}
        activePage={
          pathname === reservationPaths.notifications ? 'notifications' : null
        }
        onBookInterview={() => navigate(reservationPaths.rooms)}
      />
      <main className={styles.main}>
        <Outlet context={notices} />
      </main>
    </div>
  );
}
