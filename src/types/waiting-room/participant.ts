import type { InterviewRole } from '@/types/interview/interview';

export type Participant = {
  id: string;
  nickname: string;
  role: InterviewRole;
  isMe: boolean;
  isReady: boolean;
};
