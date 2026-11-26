import type { InterviewRole } from '@/types/interview/interview';

export const roleLabels = {
  interviewee: '면접자',
  interviewer: '면접관',
} as const satisfies Record<InterviewRole, string>;
