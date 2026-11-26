import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Radio, Tag } from '@/components/common';
import { reservationPaths } from '@/constants/common/paths';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import { formatRoomDate, formatRoomTime, seatLabel } from '@/utils/reservation';
import * as styles from '../reservation.css';

type RoomFilter = (typeof filters)[number];

const filters = ['전체', '관리자 방', '개설된 방', '오전', '오후'] as const;

export function RoomList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<RoomFilter>('전체');
  const rooms = useReservationStore((state) => state.rooms);
  const reservations = useReservationStore((state) => state.reservations);
  const visible = rooms.filter((room) => {
    if (room.startsAt <= Date.now()) return false;
    switch (filter) {
      case '관리자 방':
        return room.source === 'admin';
      case '개설된 방':
        return room.source === 'requested';
      case '오전':
        return formatRoomTime(room.startsAt) < '12:00';
      case '오후':
        return formatRoomTime(room.startsAt) >= '12:00';
      default:
        return true;
    }
  });
  return (
    <>
      <div className={styles.row}>
        <fieldset className={styles.chips} aria-label='면접방 필터'>
          {filters.map((item) => (
            <Radio
              key={item}
              name='room-filter'
              checked={item === filter}
              onChange={() => setFilter(item)}
            >
              {item}
            </Radio>
          ))}
        </fieldset>
        <span className={styles.muted}>
          매일 오전 8시에 새로운 면접방이 열려요.
        </span>
      </div>
      {visible.length ? (
        <div className={styles.grid}>
          {visible.map((room) => {
            const booked = reservations.some((item) => item.roomId === room.id);
            const full = room.seats.interviewer + room.seats.interviewee === 0;
            return (
              <article className={styles.roomCard} key={room.id}>
                <div className={styles.row}>
                  <div>
                    <p className={styles.muted}>
                      {formatRoomDate(room.startsAt)}
                    </p>
                    <time
                      className={styles.time}
                      dateTime={new Date(room.startsAt).toISOString()}
                    >
                      {formatRoomTime(room.startsAt)}
                    </time>
                  </div>
                  <Tag tone={room.source === 'admin' ? 'gray' : 'green'}>
                    {room.source === 'admin' ? '관리자 방' : '개설된 방'}
                  </Tag>
                </div>
                <h2 className={styles.sectionTitle}>{room.title}</h2>
                <p className={styles.muted}>익명 음성 · {room.job}</p>
                <div className={styles.chips}>
                  <span className={styles.muted}>
                    면접자 {room.seats.interviewee}자리 · 면접관{' '}
                    {room.seats.interviewer}자리
                  </span>
                  <Tag tone='gray'>
                    {booked ? '예약됨' : full ? '마감' : seatLabel(room)}
                  </Tag>
                </div>
                <Button
                  size='large'
                  display='block'
                  variant={room.source === 'admin' ? 'primary' : 'outline'}
                  disabled={full && !booked}
                  onClick={() => navigate(reservationPaths.room(room.id))}
                >
                  {booked ? '내 예약 보기' : '방 살펴보기'}
                </Button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2 className={styles.sectionTitle}>
            {filter === '전체'
              ? '열린 면접방이 없어요'
              : '이 조건에 맞는 면접방이 없어요'}
          </h2>
          <Button
            variant='secondary'
            onClick={() =>
              filter === '전체'
                ? navigate(reservationPaths.request)
                : setFilter('전체')
            }
          >
            {filter === '전체' ? '개설 요청하기' : '전체 면접방 보기'}
          </Button>
        </div>
      )}
    </>
  );
}
