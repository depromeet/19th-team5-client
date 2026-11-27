import type { InterviewRole } from '@/types/interview/interview';
import type { Avatar } from '@/types/Signup';

/** 면접방에 함께 있는 사람. 3D 면접장에서 역할별 자리에 앉히고, 가입 때 고른 아바타로 캐릭터를 고른다. */
export type InterviewRoomParticipant = {
  id: string;
  role: InterviewRole;
  avatar: Avatar;
  isMe: boolean;
};
