import type { GNBProps } from '@/components/common/gnb';

type VisibleGNBProps = Exclude<GNBProps, { variant: 'interview' }>;
type LabelsByVariant = {
  [Props in VisibleGNBProps as Props['variant']]: Props['labels'];
};

const commonLabels = { brand: 'MOING', navigation: '주 메뉴' };
const homeLabel = 'MOING 홈';
const signedInMenuLabels = { lobby: '로비', myPage: '마이페이지' };

export const gnbLabels = {
  member: {
    ...commonLabels,
    ...signedInMenuLabels,
    home: homeLabel,
    notifications: '알림',
    notificationsUnread: '읽지 않은 알림 있음',
    tickets: '면접권',
    ticketUnit: '장',
    bookInterview: '면접방 예약',
  },
  guest: {
    ...commonLabels,
    home: homeLabel,
    lobby: '로비 둘러보기',
    about: '서비스 소개',
    login: '로그인',
    enter: '입장하기',
  },
  waiting: {
    ...commonLabels,
    ...signedInMenuLabels,
    waitingMessage: '면접 시작 전까지 대기해주세요',
  },
} as const satisfies LabelsByVariant;
