import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  createInterviewRooms,
  createOpenedRequest,
} from '@/mocks/reservation/rooms';
import type { InterviewRole } from '@/types/interview/interview';
import type {
  InterviewRoom,
  Reservation,
  RoomRequest,
  RoomRequestDraft,
} from '@/types/reservation';
import {
  requestWeekStart,
  validRoomRequest,
  weeklyRequestLimit,
} from '@/utils/reservation';

type BookingResult =
  | 'reserved'
  | 'already-reserved'
  | 'no-tickets'
  | 'unavailable';
type ReservationState = {
  rooms: InterviewRoom[];
  reservations: Reservation[];
  requests: RoomRequest[];
  readNoticeIds: string[];
  readNotices: (ids: string[]) => void;
  tickets: number;
  reserve: (roomId: string, role: InterviewRole) => BookingResult;
  requestRoom: (draft: RoomRequestDraft) => 'submitted' | 'limit' | 'invalid';
};

export function remainingRequests(requests: RoomRequest[], now: number) {
  const start = requestWeekStart(now);
  return Math.max(
    0,
    weeklyRequestLimit -
      requests.filter(
        (request) => requestWeekStart(request.submittedAt) === start,
      ).length,
  );
}

export const useReservationStore = create<ReservationState>()(
  persist(
    (set, get) => ({
      rooms: createInterviewRooms(Date.now()),
      reservations: [],
      requests: [createOpenedRequest(Date.now())],
      readNoticeIds: [],
      readNotices: (ids) => {
        const { readNoticeIds } = get();
        const unread = ids.filter((id) => !readNoticeIds.includes(id));
        if (unread.length)
          set({ readNoticeIds: [...readNoticeIds, ...unread] });
      },
      tickets: 2,
      reserve: (roomId, role) => {
        const { rooms, reservations, tickets } = get();
        const room = rooms.find((item) => item.id === roomId);
        if (reservations.some((item) => item.roomId === roomId))
          return 'already-reserved';
        if (!room || room.startsAt <= Date.now() || room.seats[role] === 0)
          return 'unavailable';
        if (role === 'interviewee' && tickets === 0) return 'no-tickets';
        set({
          rooms: rooms.map((item) =>
            item.id === roomId
              ? {
                  ...item,
                  seats: { ...item.seats, [role]: item.seats[role] - 1 },
                }
              : item,
          ),
          reservations: [...reservations, { roomId, role }],
          tickets: tickets - (role === 'interviewee' ? 1 : 0),
        });
        return 'reserved';
      },
      requestRoom: (draft) => {
        const { requests } = get();
        const submittedAt = Date.now();
        if (!remainingRequests(requests, submittedAt)) return 'limit';
        if (!validRoomRequest(draft)) return 'invalid';
        set({
          requests: [
            ...requests,
            {
              ...draft,
              id: crypto.randomUUID(),
              title: draft.title.trim(),
              reason: draft.reason.trim(),
              submittedAt,
            },
          ],
        });
        return 'submitted';
      },
    }),
    {
      name: 'moing:reservations',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
