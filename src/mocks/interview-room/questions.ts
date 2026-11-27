import type { InterviewPart } from '@/types/interview-room/interviewRoom';
import type {
  QuestionCard,
  ReceivedQuestion,
} from '@/types/interview-room/question';

/** 1부 공통 질문. 면접자 모두에게 같은 질문 카드를 쓴다. */
export const commonQuestions: readonly QuestionCard[] = [
  {
    id: 'common-1',
    category: '자기소개',
    text: '간단하게 자기소개 부탁드려요.',
    intent: '핵심 경험을 짧게 정리해서 전달하는지 봐요.',
  },
  {
    id: 'common-2',
    category: '경험 질문',
    text: '팀 프로젝트에서 맡은 역할과 기여한 성과는 무엇인가요?',
    intent: '본인의 역할과 성과를 구체적으로 설명하는지 봐요.',
  },
  {
    id: 'common-3',
    category: '경험 질문',
    text: '다른 사람에게 도움을 받아 성과를 낸 경험이 있나요?',
    intent: '도움을 요청하고 감사할 줄 아는 협업 태도를 봐요.',
  },
  {
    id: 'common-4',
    category: '경험 질문',
    text: '받은 피드백을 어떻게 다음 작업에 반영했나요?',
    intent: '피드백을 받아들여 개선하는 과정을 봐요.',
  },
  {
    id: 'common-5',
    category: '협업 질문',
    text: '최근에 누군가와 크게 의견이 달랐던 적이 있나요?',
    intent: '갈등 상황에서 상대 입장을 고려하는지 봐요.',
  },
  {
    id: 'common-6',
    category: '가치관 질문',
    text: '일할 때 가장 중요하게 생각하는 가치는 무엇인가요?',
    intent: '판단 기준이 분명하고 경험으로 뒷받침되는지 봐요.',
  },
];

/**
 * 2부 커스텀 질문. 면접관이 면접 전에 면접자의 자기소개서를 보고 써 둔 질문이다.
 * 질문지 작성(대기실 브랜치)이 합쳐지면 질문지 store의 질문으로 바꾼다.
 */
export const customQuestions: Readonly<
  Record<string, readonly QuestionCard[]>
> = {
  A: [
    {
      id: 'custom-a-1',
      category: '커스텀 질문',
      text: '예약 완료율 18%는 어떤 지표로 확인했나요?',
      intent: '성과를 숫자로 검증하는 습관이 있는지 봐요.',
    },
    {
      id: 'custom-a-2',
      category: '커스텀 질문',
      text: 'A/B 테스트 결과가 예상과 달랐다면 어떻게 했을까요?',
      intent: '가설을 세우고 결과를 해석하는 방식을 봐요.',
    },
    {
      id: 'custom-a-3',
      category: '커스텀 질문',
      text: '표본이 부족했던 첫 실험 뒤로 무엇을 바꿨나요?',
      intent: '실패에서 배운 점을 다음 실험에 적용하는지 봐요.',
    },
  ],
  B: [
    {
      id: 'custom-b-1',
      category: '커스텀 질문',
      text: '디자인 시스템으로 제작 속도가 두 배가 됐다는 건 어떻게 쟀나요?',
      intent: '성과를 잰 기준이 분명한지 봐요.',
    },
    {
      id: 'custom-b-2',
      category: '커스텀 질문',
      text: '구매 전환율 9%를 올린 실험에서 가장 어려웠던 점은 무엇인가요?',
      intent: '데이터를 근거로 가설을 세우고 검증하는지 봐요.',
    },
  ],
};

/**
 * 면접자 화면에 뜨는 질문. 프로토타입에는 질문을 고를 면접관이 없어서,
 * 부가 시작되고 조금 뒤에 부마다 정해 둔 질문을 하나씩 보여준다.
 */
export const receivedQuestions = {
  common: {
    text: '간단하게 자기소개 부탁드려요.',
    detail: '1 / 3',
    interviewerName: '단단한 곰',
  },
  custom: {
    text: '예약 완료율 18%는 어떤 지표로 확인했나요?',
    detail: '1 / 2',
    interviewerName: '단단한 곰',
  },
  free: {
    text: '18%를 올리려고 가장 먼저 바꾼 건 뭐였나요?',
    detail: '꼬리질문',
    interviewerName: '단단한 곰',
  },
} as const satisfies Record<InterviewPart, ReceivedQuestion>;

export const task3ReceivedQuestions = {
  ...receivedQuestions,
  custom: {
    ...receivedQuestions.custom,
    text: '프로젝트에서 개선이 필요하다고 판단한 근거는 무엇이었나요?',
  },
  free: {
    ...receivedQuestions.free,
    text: '그 개선이 효과가 있었는지는 어떻게 확인했나요?',
  },
} as const satisfies Record<InterviewPart, ReceivedQuestion>;
