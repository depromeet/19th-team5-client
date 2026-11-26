import type { InterviewPart } from '@/types/interview-room/interviewRoom';

/** 진행 순서대로 둔 면접의 부 */
export const interviewParts = [
  'common',
  'custom',
  'free',
] as const satisfies readonly InterviewPart[];

/** 부 이름. 화면에서는 "1부 공통 질문", 메모에서는 "1부 Q2"처럼 이어 쓴다. */
export const partLabels = {
  common: { order: '1부', title: '공통 질문' },
  custom: { order: '2부', title: '커스텀 질문' },
  free: { order: '3부', title: '자유 질문' },
} as const satisfies Record<InterviewPart, { order: string; title: string }>;
