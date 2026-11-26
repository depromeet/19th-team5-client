import type {
  InterviewPhase,
  InterviewRole,
} from '@/types/interview/interview';

export const interviewPaths = {
  lobby: (params: { role: InterviewRole; phase: InterviewPhase }) =>
    `/lobby?${new URLSearchParams(params)}`,
  waitingRoom: (interviewId: string, params: { role: InterviewRole }) =>
    `/interviews/${interviewId}/waiting-room?${new URLSearchParams(params)}`,
};
