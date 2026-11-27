import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Radio } from '@/components/common';
import { reservationPaths } from '@/constants/common/paths';
import { useNow } from '@/hooks/common/useNow';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import { formatRoomTime } from '@/utils/reservation';
import * as styles from '../reservation.css';
import { RoomCard } from './RoomCard';

type RoomFilter = (typeof filters)[number];

const filters = ['전체', '관리자 방', '개설된 방', '오전', '오후'] as const;

export function RoomList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<RoomFilter>('전체');
  const rooms = useReservationStore((state) => state.rooms);
  const reservations = useReservationStore((state) => state.reservations);
  const now = useNow();
  const visible = rooms
    .filter((room) => {
      if (room.startsAt <= now) return false;
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
    })
    .sort((first, second) => first.startsAt - second.startsAt);
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
          {visible.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              booked={reservations.some((item) => item.roomId === room.id)}
              onOpen={() => navigate(reservationPaths.room(room.id))}
            />
          ))}
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
