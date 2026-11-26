import type { InterviewRoom, RoomRequest } from '@/types/reservation';
import { minute, requestWeekStart, seoulDayStart } from '@/utils/reservation';

const openedRequestId = 'sample-request-a';

export function createOpenedRequest(today: number): RoomRequest {
  return {
    id: openedRequestId,
    title: '인성면접 A룸',
    job: '직무 무관',
    hour: 18,
    reason: '인성면접을 연습하고 싶어요.',
    submittedAt: requestWeekStart(today) - 24 * 60 * minute,
  };
}

/** UT 세션을 시작한 다음 날부터 이틀간의 방. 같은 방은 새로고침 후에도 일정이 같다. */
export function createInterviewRooms(today: number): InterviewRoom[] {
  const midnight = seoulDayStart(today);
  return [1, 2].flatMap((dayOffset) =>
    [18, 20, 22].map((hour, index) => {
      const startsAt = midnight + (dayOffset * 24 + hour) * 60 * minute;
      const admin = index === 2;
      return {
        id: `room-${startsAt}`,
        title: admin
          ? '디자인 직무 면접'
          : `인성면접 ${index === 0 ? 'A' : 'B'}룸`,
        startsAt,
        source: admin ? 'admin' : 'requested',
        openedRequestId:
          dayOffset === 1 && index === 0 ? openedRequestId : undefined,
        job: admin ? '디자인' : '직무 무관',
        seats: { interviewee: 1, interviewer: admin ? 0 : 1 },
      };
    }),
  );
}
