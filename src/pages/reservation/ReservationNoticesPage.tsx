import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { Button, Tag } from '@/components/common';
import type { RoomNotice } from '@/hooks/reservation/useReservationSchedule';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import * as styles from './reservation.css';

export function ReservationNoticesPage() {
  const navigate = useNavigate();
  const notices = useOutletContext<RoomNotice[]>();
  const readNotices = useReservationStore((state) => state.readNotices);
  useEffect(() => {
    readNotices(notices.map((notice) => notice.id));
  }, [notices, readNotices]);
  return (
    <>
      <header>
        <h1 className={styles.heading}>
          놓치지 않도록, 다음 약속을 알려드려요.
        </h1>
        <p className={styles.subtitle}>
          예약한 면접과 요청한 면접방 소식을 확인해요.
        </p>
      </header>
      <section aria-label='알림 목록' className={styles.stack}>
        {notices.map((notice) => (
          <article key={notice.id} className={styles.bordered}>
            <div className={styles.row}>
              <div className={styles.stack}>
                <div>
                  <Tag tone='gray'>{notice.label}</Tag>
                </div>
                <h2 className={styles.sectionTitle}>{notice.title}</h2>
                <p className={styles.muted}>{notice.detail}</p>
              </div>
              <Button variant='outline' onClick={() => navigate(notice.to)}>
                {notice.action}
              </Button>
            </div>
          </article>
        ))}
        {!notices.length && (
          <p className={styles.muted}>새로운 면접 소식이 없어요.</p>
        )}
      </section>
    </>
  );
}
