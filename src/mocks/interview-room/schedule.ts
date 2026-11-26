import type { InterviewPart } from '@/types/interview-room/interviewRoom';

/** 면접방 진행 시간(초). API가 생기면 면접 설정 응답으로 바꾼다. */
export const mockSchedule = {
  /** 면접장에 들어온 뒤 자리에 앉지 않으면 자동으로 앉히기까지 */
  seatingSeconds: 60,
  /**
   * TODO(테스트): 직접 체험하기 쉽게 각 부를 30초로 줄여 두었다.
   * 프로토타입 가이드 값은 1분 30초(90), 시안 값은 10분(10 * 60)
   */
  partSeconds: { common: 30, custom: 30, free: 30 },
  /** 부가 시작된 뒤 면접자 화면에 질문이 뜨기까지. 면접관이 질문을 고르는 시간을 흉내 낸다. */
  questionDelaySeconds: 5,
  /** 면접이 끝난 뒤 면접관이 평가표를 낼 수 있는 시간 */
  evaluationSeconds: 5 * 60,
} as const satisfies {
  seatingSeconds: number;
  partSeconds: Record<InterviewPart, number>;
  questionDelaySeconds: number;
  evaluationSeconds: number;
};
