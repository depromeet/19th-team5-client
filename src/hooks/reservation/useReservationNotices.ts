import { useMemo } from 'react';
import { interviewPaths, reservationPaths } from '@/constants/common/paths';
import { useNow } from '@/hooks/common/useNow';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import { formatRoomDate, formatRoomTime, minute } from '@/utils/reservation';

export type RoomNotice = {
  id: string;
  label: string;
  title: string;
  detail: string;
  action: string;
  to: string;
};

export function useReservationNotices() {
  const rooms = useReservationStore((state) => state.rooms);
  const reservations = useReservationStore((state) => state.reservations);
  const requests = useReservationStore((state) => state.requests);
  const now = useNow();
  return useMemo(() => {
    const notices: RoomNotice[] = [];
    for (const room of rooms) {
      const reservation = reservations.find((item) => item.roomId === room.id);
      if (!reservation || room.startsAt <= now) continue;
      const untilStart = room.startsAt - now;
      const open = untilStart <= 15 * minute;
      const locked = untilStart <= 60 * minute;
      notices.push({
        id: `${room.id}-${open ? 'open' : locked ? 'locked' : 'reserved'}`,
        label: open ? '대기실 오픈' : locked ? '예약 잠금' : '예약 확정',
        title: open
          ? `${room.title}, 대기실이 열렸어요.`
          : locked
            ? '면접 시작까지 1시간 이내예요.'
            : `${room.title} 예약을 확인해요.`,
        detail: `${formatRoomDate(room.startsAt)} ${formatRoomTime(room.startsAt)}`,
        action: open ? '대기실 입장' : '예약 확인',
        to: open
          ? interviewPaths.waitingRoom(room.id, { role: reservation.role })
          : reservationPaths.room(room.id),
      });
    }
    for (const openedRoom of rooms) {
      if (
        !openedRoom.openedRequestId ||
        openedRoom.startsAt <= now ||
        !requests.some(
          (request) => request.id === openedRoom.openedRequestId,
        ) ||
        reservations.some((item) => item.roomId === openedRoom.id)
      )
        continue;
      notices.push({
        id: `${openedRoom.id}-opened`,
        label: '개설 요청',
        title: '요청한 면접방이 열렸어요.',
        detail: `${formatRoomDate(openedRoom.startsAt)} ${formatRoomTime(openedRoom.startsAt)} · ${openedRoom.title}`,
        action: '면접방 보기',
        to: reservationPaths.room(openedRoom.id),
      });
    }
    return notices;
  }, [rooms, reservations, requests, now]);
}
