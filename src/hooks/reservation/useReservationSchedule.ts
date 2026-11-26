import { useMemo } from 'react';
import { interviewPaths, reservationPaths } from '@/constants/common/paths';
import { useNow } from '@/hooks/common/useNow';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import {
  formatRoomDate,
  formatRoomTime,
  reservationPhase,
  upcomingBookings,
} from '@/utils/reservation';

export type RoomNotice = {
  id: string;
  label: string;
  title: string;
  detail: string;
  action: string;
  to: string;
};

export function useReservationSchedule() {
  const rooms = useReservationStore((state) => state.rooms);
  const reservations = useReservationStore((state) => state.reservations);
  const requests = useReservationStore((state) => state.requests);
  const now = useNow();
  return useMemo(() => {
    const upcoming = upcomingBookings(rooms, reservations, now);
    const notices: RoomNotice[] = [];
    for (const { room, role } of upcoming) {
      const phase = reservationPhase(room.startsAt, now);
      const open = phase === 'open';
      const locked = phase === 'locked';
      const prepareQuestions = locked && role === 'interviewer';
      notices.push({
        id: `${room.id}-${phase}`,
        label: open ? '대기실 오픈' : locked ? '예약 잠금' : '예약 확정',
        title: open
          ? `${room.title}, 대기실이 열렸어요.`
          : locked
            ? '면접 시작까지 1시간 이내예요.'
            : `${room.title} 예약을 확인해요.`,
        detail: `${formatRoomDate(room.startsAt)} ${formatRoomTime(room.startsAt)}`,
        action: open
          ? '대기실 입장'
          : prepareQuestions
            ? '질문지 작성'
            : '예약 확인',
        to: open
          ? interviewPaths.waitingRoom(room.id, { role })
          : prepareQuestions
            ? reservationPaths.questionSheet(room.id)
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
    return { now, upcoming, notices };
  }, [rooms, reservations, requests, now]);
}
