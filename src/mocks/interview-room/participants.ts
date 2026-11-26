import type { Interviewee } from '@/types/interview-room/interviewee';

/** 면접관 질문 카드의 면접자 탭. 정원(면접자 2명)만큼 둔다. */
export const interviewees: readonly Interviewee[] = [
  { id: 'A', name: '면접자 A' },
  { id: 'B', name: '면접자 B' },
];

/** 면접 종료 화면의 내 아바타(전신). 가입에서 고른 아바타를 API로 받으면 바꾼다. */
export const myAvatarImageUrl = '/images/signup/boy.png';
