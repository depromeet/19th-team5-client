import { interviewMock } from '@/mocks/interview/interview';
import type { InterviewRole } from '@/types/interview/interview';
import type { Avatar } from '@/types/Signup';
import type { Participant } from '@/types/waiting-room/participant';

export const myNickname = '차분한 수달';

/** TODO(API): 로그인한 사용자가 가입 때 고른 아바타로 바꾼다. */
export const myAvatar: Avatar = 'boy';

const otherParticipants: readonly Omit<Participant, 'isMe'>[] = [
  {
    id: 'whale',
    nickname: '조용한 고래',
    role: 'interviewee',
    avatar: 'girl',
    isReady: true,
  },
  {
    id: 'rabbit',
    nickname: '씩씩한 토끼',
    role: 'interviewee',
    avatar: 'boy',
    isReady: true,
  },
  {
    id: 'bear',
    nickname: '단단한 곰',
    role: 'interviewer',
    avatar: 'boy',
    isReady: true,
  },
  {
    id: 'fox',
    nickname: '느긋한 여우',
    role: 'interviewer',
    avatar: 'girl',
    isReady: true,
  },
];

/** 나를 맨 앞에 두고, 역할별 정원(면접자 2 · 면접관 2)을 다른 참가자로 채운다. */
export function getRoomParticipants(
  myRole: InterviewRole,
  isMeReady: boolean,
): Participant[] {
  const me: Participant = {
    id: 'me',
    nickname: myNickname,
    role: myRole,
    avatar: myAvatar,
    isMe: true,
    isReady: isMeReady,
  };
  const openSeats: Record<InterviewRole, number> = {
    interviewee: interviewMock.headcount.interviewee,
    interviewer: interviewMock.headcount.interviewer,
  };
  openSeats[myRole] -= 1;

  const others = otherParticipants.filter((participant) => {
    if (openSeats[participant.role] === 0) return false;
    openSeats[participant.role] -= 1;
    return true;
  });

  return [
    me,
    ...others.map((participant) => ({ ...participant, isMe: false })),
  ];
}
