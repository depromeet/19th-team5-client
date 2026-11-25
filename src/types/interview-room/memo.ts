import type { InterviewPart } from '@/types/interview-room/interviewRoom';

/** 면접관이 면접자의 답변을 들으며 남기는 메모. 질문마다 하나씩 둔다. */
export type InterviewMemo = {
  part: InterviewPart;
  /** 그 부에서 몇 번째 질문의 메모인지. 1부터 센다. */
  questionNumber: number;
  text: string;
};
