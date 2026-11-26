import type {
  InterviewPhase,
  InterviewRole,
} from '@/types/interview/interview';

type Notice = { time: string; title: string; description: string };

export const lobbyNotices = {
  prepare: {
    interviewee: {
      time: '13:00',
      title: '면접까지 딱 1시간!',
      description: '13:45 대기실이 열려요. 예약취소가 불가능해요.',
    },
    interviewer: {
      time: '13:00',
      title: '면접자 서류 도착!',
      description: '시작 전까지 2부 질문을 만들어 두세요.',
    },
  },
  open: {
    interviewee: {
      time: '13:45',
      title: '대기실 문 열렸어요',
      description: '들어가서 마이크부터 확인해요.',
    },
    interviewer: {
      time: '13:45',
      title: '대기실 문 열렸어요',
      description: '들어가서 마이크부터 확인해요.',
    },
  },
} as const satisfies Record<InterviewPhase, Record<InterviewRole, Notice>>;
