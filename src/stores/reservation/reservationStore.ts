import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import {
  createInterviewRooms,
  createOpenedRequest,
} from '@/mocks/reservation/rooms';
import { useAuthStore } from '@/stores/AuthStore';
import type { InterviewRole } from '@/types/interview/interview';
import type {
  InterviewRoom,
  Reservation,
  RoomRequest,
  RoomRequestDraft,
} from '@/types/reservation';
import {
  canManageReservation,
  requestWeekStart,
  validRoomRequest,
  weeklyRequestLimit,
} from '@/utils/reservation';

type ReservationData = {
  rooms: InterviewRoom[];
  reservations: Reservation[];
  requests: RoomRequest[];
  readNoticeIds: string[];
  tickets: number;
};
type BookingResult =
  | 'reserved'
  | 'already-reserved'
  | 'no-tickets'
  | 'unavailable'
  | 'locked'
  | 'error';
type CancellationResult = 'cancelled' | 'locked' | 'unavailable' | 'error';
type RequestResult = 'submitted' | 'limit' | 'invalid' | 'error';
type ReservationState = ReservationData & {
  readNotices: (ids: string[]) => Promise<void>;
  reserve: (
    roomId: string,
    role: InterviewRole,
    changeRole?: boolean,
  ) => Promise<BookingResult>;
  cancel: (roomId: string) => Promise<CancellationResult>;
  requestRoom: (draft: RoomRequestDraft) => Promise<RequestResult>;
};

const storagePrefix = 'moing:mock:reservations:v1:';

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

function updateSeats(
  room: InterviewRoom,
  release?: InterviewRole,
  take?: InterviewRole,
) {
  const seats = { ...room.seats };
  if (release) seats[release] += 1;
  if (take) seats[take] -= 1;
  return { ...room, seats };
}

function createReservationStore(email: string | null) {
  const key = email ? storagePrefix + email : null;

  function initial(now: number): ReservationData {
    return {
      rooms: createInterviewRooms(now),
      reservations: [],
      requests: email ? [createOpenedRequest(now)] : [],
      readNoticeIds: [],
      tickets: 2,
    };
  }

  function read(): ReservationData {
    const now = Date.now();
    const raw = key ? localStorage.getItem(key) : null;
    if (!raw) return initial(now);
    const data: ReservationData = JSON.parse(raw);
    const rooms = [...data.rooms];
    for (const room of createInterviewRooms(now)) {
      if (!rooms.some((existing) => existing.id === room.id)) rooms.push(room);
    }
    return { ...data, rooms };
  }

  function restore() {
    try {
      return read();
    } catch {
      return initial(Date.now());
    }
  }

  async function write<T>(update: () => T, fallback: T): Promise<T> {
    if (!key) return fallback;
    try {
      return await navigator.locks.request(key, () => {
        if (useAuthStore.getState().email !== email) return fallback;
        store.setState(read());
        return update();
      });
    } catch {
      return fallback;
    }
  }

  const store = createStore<ReservationState>()((set, get) => {
    function commit(changes: Partial<ReservationData>) {
      if (!key) return;
      const { rooms, reservations, requests, readNoticeIds, tickets } = get();
      const data = {
        rooms,
        reservations,
        requests,
        readNoticeIds,
        tickets,
        ...changes,
      };
      localStorage.setItem(key, JSON.stringify(data));
      set(data);
    }

    return {
      ...restore(),
      readNotices: async (ids) => {
        if (ids.every((id) => get().readNoticeIds.includes(id))) return;
        await write(() => {
          const readNoticeIds = get().readNoticeIds;
          const unread = ids.filter((id) => !readNoticeIds.includes(id));
          if (unread.length)
            commit({ readNoticeIds: [...readNoticeIds, ...unread] });
        }, undefined);
      },
      reserve: (roomId, role, changeRole) =>
        write<BookingResult>(() => {
          const { rooms, reservations, tickets } = get();
          const room = rooms.find((item) => item.id === roomId);
          const previous = reservations.find((item) => item.roomId === roomId);
          const now = Date.now();
          if (previous && (!changeRole || previous.role === role))
            return 'already-reserved';
          if (!room || (changeRole && !previous)) return 'unavailable';
          if (changeRole && !canManageReservation(room.startsAt, now))
            return 'locked';
          if (room.startsAt <= now || room.seats[role] <= 0)
            return 'unavailable';
          if (role === 'interviewee' && tickets <= 0) return 'no-tickets';
          commit({
            rooms: rooms.map((item) =>
              item === room ? updateSeats(room, previous?.role, role) : item,
            ),
            reservations: [
              ...reservations.filter((item) => item !== previous),
              { roomId, role },
            ],
            tickets:
              tickets +
              Number(previous?.role === 'interviewee') -
              Number(role === 'interviewee'),
          });
          return 'reserved';
        }, 'error'),
      cancel: (roomId) =>
        write<CancellationResult>(() => {
          const { rooms, reservations, tickets } = get();
          const room = rooms.find((item) => item.id === roomId);
          const previous = reservations.find((item) => item.roomId === roomId);
          if (!room || !previous) return 'unavailable';
          if (!canManageReservation(room.startsAt, Date.now())) return 'locked';
          commit({
            rooms: rooms.map((item) =>
              item === room ? updateSeats(room, previous.role) : item,
            ),
            reservations: reservations.filter((item) => item !== previous),
            tickets: tickets + Number(previous.role === 'interviewee'),
          });
          return 'cancelled';
        }, 'error'),
      requestRoom: (draft) =>
        write<RequestResult>(() => {
          const { requests } = get();
          const submittedAt = Date.now();
          if (!remainingRequests(requests, submittedAt)) return 'limit';
          if (!validRoomRequest(draft)) return 'invalid';
          commit({
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
        }, 'error'),
    };
  });
  return { store, refresh: () => store.setState(restore()) };
}

const stores = new Map<
  string | null,
  ReturnType<typeof createReservationStore>
>();

function getReservationStore(email: string | null) {
  const existing = stores.get(email);
  if (existing) return existing;
  const store = createReservationStore(email);
  stores.set(email, store);
  return store;
}

function syncReservationStorage(event: StorageEvent) {
  if (!event.key?.startsWith(storagePrefix)) return;
  stores.get(event.key.slice(storagePrefix.length))?.refresh();
}

window.addEventListener('storage', syncReservationStorage);
import.meta.hot?.dispose(() =>
  window.removeEventListener('storage', syncReservationStorage),
);

export function useReservationStore<T>(
  selector: (state: ReservationState) => T,
) {
  const email = useAuthStore((state) => state.email);
  return useStore(getReservationStore(email).store, selector);
}
