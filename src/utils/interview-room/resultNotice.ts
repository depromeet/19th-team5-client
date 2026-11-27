/**
 * 면접이 끝난 직후 로비에 「면접 결과가 도착했어요」 카드를 띄우려고 함께 넘기는 내비게이션 state.
 * 로비에 그냥 들어오면 이 state가 없으므로 카드도 뜨지 않는다.
 */
export type InterviewResultNoticeState = { interviewResultArrivedAt: number };

export function createInterviewResultNoticeState(
  arrivedAt: number,
): InterviewResultNoticeState {
  return { interviewResultArrivedAt: arrivedAt };
}

/** 내비게이션 state에서 면접 결과가 도착한 시각을 읽는다. 없으면 undefined */
export function getInterviewResultArrivedAt(state: unknown) {
  if (
    !state ||
    typeof state !== 'object' ||
    !('interviewResultArrivedAt' in state)
  )
    return undefined;
  const { interviewResultArrivedAt } = state;
  return typeof interviewResultArrivedAt === 'number'
    ? interviewResultArrivedAt
    : undefined;
}
