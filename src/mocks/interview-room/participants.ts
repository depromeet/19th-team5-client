import type { Interviewee } from '@/types/interview-room/interviewee';
import type { Interviewer } from '@/types/interview-room/interviewer';

/** 면접자로 들어온 나. 면접관 화면의 면접자 탭에서도 같은 이름으로 보인다. */
export const myInterviewee: Interviewee = { id: 'A', name: '면접자 A' };

/** 면접관 질문 카드의 면접자 탭. 정원(면접자 2명)만큼 둔다. */
export const interviewees: readonly Interviewee[] = [
  myInterviewee,
  { id: 'B', name: '면접자 B' },
];

/** 면접 종료 화면의 내 아바타(전신). 가입에서 고른 아바타를 API로 받으면 바꾼다. */
export const myAvatarImageUrl = '/images/signup/boy.png';

/** 면접자가 면접 뒤 평가하는 면접관. 정원(면접관 2명)만큼 둔다. */
export const interviewers: readonly Interviewer[] = [
  {
    id: 'bear',
    name: '단단한 곰',
    levelLabel: 'Lv.3 1차 합격자',
    imageUrl: '/images/kim-daeri-profile.png',
  },
  {
    id: 'fox',
    name: '느긋한 여우',
    levelLabel: 'Lv.3 1차 합격자',
    imageUrl: '/images/kim-daeri-profile.png',
  },
];
