import type { InterviewRole } from '@/types/interview/interview';
import type { Avatar } from '@/types/Signup';

export type Participant = {
  id: string;
  nickname: string;
  role: InterviewRole;
  /** 가입 때 고른 아바타. 3D 대기실에서 캐릭터 모델을 고를 때 쓴다. */
  avatar: Avatar;
  isMe: boolean;
  isReady: boolean;
};
