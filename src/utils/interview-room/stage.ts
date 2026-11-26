import type {
  InterviewPart,
  InterviewRoomStage,
} from '@/types/interview-room/interviewRoom';

/** 질문이 오가는 단계(1·2·3부)인지 */
export function isInterviewPart(
  stage: InterviewRoomStage,
): stage is InterviewPart {
  return stage !== 'seating' && stage !== 'finished';
}
