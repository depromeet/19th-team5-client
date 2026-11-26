import { Link } from 'react-router';
import { button } from '@/components/common/button/button.css';
import { interviewPaths } from '@/constants/common/paths';
import type { InterviewRole } from '@/types/interview/interview';
import type { InterviewRoom } from '@/types/reservation';
import { interviewDuration, reservationPhase } from '@/utils/reservation';
import { actionLink } from '../reservation.css';

type ReservationEntryButtonProps = {
  room: InterviewRoom;
  role: InterviewRole;
  now: number;
};

export function ReservationEntryButton({
  room,
  role,
  now,
}: ReservationEntryButtonProps) {
  const phase = reservationPhase(room.startsAt, now);
  if (phase === 'open') {
    return (
      <Link
        className={`${button()} ${actionLink}`}
        to={interviewPaths.waitingRoom(room.id, { role })}
      >
        대기실 입장
      </Link>
    );
  }
  if (phase === 'started' && now < room.startsAt + interviewDuration) {
    return (
      <Link
        className={`${button()} ${actionLink}`}
        to={interviewPaths.interviewRoom(room.id, { role })}
      >
        면접방 입장
      </Link>
    );
  }
  return null;
}
