import { useReservationStore } from '@/stores/reservation/reservationStore';

export function useBookedRoom(roomId: string | undefined) {
  const room = useReservationStore((state) =>
    state.rooms.find((item) => item.id === roomId),
  );
  const reservation = useReservationStore((state) =>
    state.reservations.find((item) => item.roomId === roomId),
  );
  return { room, reservation };
}
