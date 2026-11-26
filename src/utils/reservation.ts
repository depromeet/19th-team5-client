import type { InterviewRole } from '@/types/interview/interview';
import type {
  InterviewRoom,
  Reservation,
  RoomRequestDraft,
} from '@/types/reservation';

export const minute = 60_000;
export const preparationLeadTime = 60 * minute;
export const waitingRoomLeadTime = 15 * minute;
export const seatsPerRole = 2;
const day = 24 * 60 * minute;
const seoulOffset = 9 * 60 * minute;
export const weeklyRequestLimit = 2;
export const reasonLimit = 100;
export const requestHours = [10, 14, 18, 20, 22];
export const requestJobs = ['디자인', '개발', '기획', '직무 무관'];

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});
const timeFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export function formatRoomDate(timestamp: number) {
  return dateFormat.format(timestamp);
}

export function formatRoomTime(timestamp: number) {
  return timeFormat.format(timestamp);
}

export function reservationPhase(startsAt: number, now: number) {
  const remaining = startsAt - now;
  if (remaining <= 0) return 'started';
  if (remaining <= waitingRoomLeadTime) return 'open';
  if (remaining <= preparationLeadTime) return 'locked';
  return 'reserved';
}

export function canPrepareQuestions(
  role: InterviewRole,
  startsAt: number,
  now: number,
) {
  const phase = reservationPhase(startsAt, now);
  return role === 'interviewer' && (phase === 'locked' || phase === 'open');
}

export function upcomingBookings(
  rooms: InterviewRoom[],
  reservations: Reservation[],
  now: number,
) {
  return rooms
    .flatMap((room) => {
      const booking = reservations.find((item) => item.roomId === room.id);
      return booking && room.startsAt > now
        ? [{ room, role: booking.role }]
        : [];
    })
    .sort((a, b) => a.room.startsAt - b.room.startsAt);
}

export function hourLabel(hour: number) {
  return `${hour < 12 ? '오전' : '오후'} ${hour % 12 || 12}시`;
}

export function seoulDayStart(timestamp: number) {
  return Math.floor((timestamp + seoulOffset) / day) * day - seoulOffset;
}

export function requestWeekStart(timestamp: number) {
  const weekday = new Date(timestamp + seoulOffset).getUTCDay();
  return seoulDayStart(timestamp) - ((weekday + 6) % 7) * day;
}

export function nextRequestWeek(timestamp: number) {
  return requestWeekStart(timestamp) + 7 * day;
}

export function validRoomRequest(draft: RoomRequestDraft) {
  return Boolean(
    draft.title.trim() &&
      draft.hour !== null &&
      requestHours.includes(draft.hour) &&
      requestJobs.includes(draft.job) &&
      draft.reason.trim() &&
      draft.reason.length <= reasonLimit,
  );
}

export function seatLabel({ seats }: InterviewRoom) {
  if (!seats.interviewer) return `면접자 ${seats.interviewee}자리`;
  if (!seats.interviewee) return `면접관 ${seats.interviewer}자리`;
  return `${seats.interviewee + seats.interviewer}자리 남음`;
}
