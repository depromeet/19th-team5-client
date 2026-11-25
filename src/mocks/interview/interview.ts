/**
 * 프로토타입용 면접 데이터. API가 생기면 같은 모양의 응답으로 교체한다.
 * 시간 값은 Figma 시안(14:00 시작, 13:45 대기실 오픈)을 따른다.
 */
export const interviewMock = {
  id: 'design-1400',
  title: '오늘 14:00 · 디자인',
  roomTitle: '14:00 디자인 면접방',
  headcount: { interviewee: 2, interviewer: 2 },
} as const;

/** 가짜 시계의 시작값(초). 같은 이름의 카운트다운은 페이지를 옮겨도 이어서 줄어든다. */
export const mockCountdowns = {
  /** TODO(테스트): 직접 확인하기 쉽게 10초로 줄여 두었다. 시안 값은 45분(45 * 60) */
  untilOpen: 10,
  /** TODO(테스트): 직접 확인하기 쉽게 1분으로 줄여 두었다. 시안 값은 15분(15 * 60) */
  untilStart: 60,
  rejoin: 3 * 60,
} as const;
