export const interviewRoom = (role: 'interviewee' | 'interviewer') =>
  `/interviews/design-1400/interview-room?role=${role}`;

/**
 * 면접방 진행 시간(ms). 목 시간표(src/mocks/interview-room/schedule.ts)와 같은 값이라,
 * 시간표를 바꾸면 함께 바꾼다.
 */
export const roomTiming = {
  /** 부가 시작된 뒤 면접자 화면에 질문이 뜨기까지 */
  questionDelay: 5_000,
  /** 각 부의 진행 시간 */
  part: 30_000,
};
