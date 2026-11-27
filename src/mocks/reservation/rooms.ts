import type { InterviewRoom } from '@/types/reservation';
import { minute, seatsPerRole, seoulDayStart } from '@/utils/reservation';

type RoomFixture = Pick<InterviewRoom, 'title' | 'job' | 'source' | 'seats'> & {
  hour: number;
};

const eveningRooms: RoomFixture[] = [
  {
    title: '인성면접 A룸',
    job: '직무 무관',
    hour: 18,
    source: 'requested',
    seats: { interviewee: 1, interviewer: 1 },
  },
  {
    title: '인성면접 B룸',
    job: '직무 무관',
    hour: 20,
    source: 'requested',
    seats: { interviewee: 1, interviewer: 1 },
  },
  {
    title: '디자인 직무 면접',
    job: '디자인',
    hour: 22,
    source: 'admin',
    seats: { interviewee: 1, interviewer: 0 },
  },
];

const additionalRooms: RoomFixture[] = [
  {
    title: '개발 프로젝트 경험 면접',
    job: '개발',
    hour: 19,
    source: 'requested',
    seats: { interviewee: 0, interviewer: seatsPerRole },
  },
  {
    title: '서비스 기획 직무 면접',
    job: '기획',
    hour: 21,
    source: 'admin',
    seats: { interviewee: seatsPerRole, interviewer: 1 },
  },
];

/** UT 세션을 시작한 다음 날부터 이틀간의 방. 같은 방은 새로고침 후에도 일정이 같다. */
export function createInterviewRooms(today: number): InterviewRoom[] {
  const midnight = seoulDayStart(today);
  const schedule = [eveningRooms, [...eveningRooms, ...additionalRooms]];

  return schedule.flatMap((fixtures, dayIndex) =>
    fixtures.map((fixture) => {
      const { hour, ...room } = fixture;
      const dayOffset = dayIndex + 1;
      const startsAt = midnight + (dayOffset * 24 + hour) * 60 * minute;
      return {
        ...room,
        id: `room-${startsAt}`,
        startsAt,
        seats: { ...room.seats },
      };
    }),
  );
}
