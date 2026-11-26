import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/common';
import { button } from '@/components/common/button/button.css';
import { InterviewPass } from '@/components/reservation/interview-pass/InterviewPass';
import { reservationPaths } from '@/constants/common/paths';
import { useNow } from '@/hooks/common/useNow';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import { ReservationEntryButton } from './components/ReservationEntryButton';
import * as styles from './reservation.css';

export function MyReservationsPage() {
  const navigate = useNavigate();
  const rooms = useReservationStore((state) => state.rooms);
  const reservations = useReservationStore((state) => state.reservations);
  const now = useNow(reservations.length > 0);
  return (
    <>
      <h1 className={styles.heading}>내 예약</h1>
      <section className={styles.panel}>
        {reservations.length ? (
          <div className={styles.grid}>
            {rooms.map((room) => {
              const reservation = reservations.find(
                (item) => item.roomId === room.id,
              );
              return (
                reservation && (
                  <div className={styles.stack} key={room.id}>
                    <InterviewPass room={room} role={reservation.role} />
                    <div className={styles.actions}>
                      <Link
                        className={`${button({ variant: 'secondary' })} ${styles.actionLink}`}
                        to={reservationPaths.room(room.id)}
                      >
                        예약 상세 보기
                      </Link>
                      <ReservationEntryButton
                        room={room}
                        role={reservation.role}
                        now={now}
                      />
                    </div>
                  </div>
                )
              );
            })}
          </div>
        ) : (
          <p className={styles.muted}>예약한 면접방이 없어요.</p>
        )}
        <div className={styles.actions}>
          <Button onClick={() => navigate(reservationPaths.rooms)}>
            열린 면접방 보기
          </Button>
          <Button variant='secondary' onClick={() => navigate('/lobby')}>
            로비로 가기
          </Button>
        </div>
      </section>
    </>
  );
}
