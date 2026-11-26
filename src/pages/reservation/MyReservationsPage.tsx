import { useNavigate } from 'react-router';
import { Button } from '@/components/common';
import { InterviewPass } from '@/components/reservation/interview-pass/InterviewPass';
import { reservationPaths } from '@/constants/common/paths';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import * as styles from './reservation.css';

export function MyReservationsPage() {
  const navigate = useNavigate();
  const rooms = useReservationStore((state) => state.rooms);
  const reservations = useReservationStore((state) => state.reservations);
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
                  <InterviewPass
                    key={room.id}
                    room={room}
                    role={reservation.role}
                  />
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
