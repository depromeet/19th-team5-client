import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import type {
  FeedbackDraft,
  InterviewDataSource,
  InterviewFeedback,
  ReceivedReview,
} from '@/types/Interview';
import { emptyFeedback, hasValidFeedbackKeywords } from '@/utils/FeedbackDraft';

const candidates = [
  { id: 'a', label: '면접자 A', name: '차분한 수달' },
  { id: 'b', label: '면접자 B', name: '씩씩한 토끼' },
] as const;

const profileImage = '/images/kim-daeri-profile.png';
const strengths = [
  '구체적인 사례',
  '논리적인 답변',
  '명확한 전달',
  '자신감 있는 태도',
  '직무 이해도',
];
const improvements = [
  '답변이 길어요',
  '근거가 부족해요',
  '말이 빨라요',
  '결론이 늦어요',
  '없어요',
];

const memos = {
  a: [
    [
      '1부 Q2',
      '몰입했던 경험',
      '결론부터 말해서 좋았음. 다만 팀 프로젝트에서 본인이 맡은 역할이 흐릿하게 들림. 3부에서 기여한 부분을 수치로 다시 물어보기.',
    ],
    [
      '1부 Q3',
      '도움을 받은 경험',
      '선배에게 피드백을 요청한 과정이 구체적이었음. 감사 표현까지 언급해서 협업 태도가 좋아 보임.',
    ],
    [
      '2부 Q1',
      'A/B 테스트 결과',
      '가설 설정은 명확했으나 결과 해석에서 표본 크기 언급이 없었음. 실패 원인을 데이터로 설명하는지 꼬리질문으로 확인 필요. 말 속도가 조금 빠른 편.',
    ],
    [
      '2부 Q2',
      '지표 설계',
      '전환율 외에 리텐션 지표까지 제시함. 근거가 명확하고 실무 이해도가 높아 보임.',
    ],
    [
      '3부 Q1',
      '팀 기여도',
      '본인이 제안한 개선과 팀의 성과를 구분해서 설명했음.',
    ],
  ],
  b: [
    [
      '1부 Q1',
      '협업 경험',
      '의견이 다른 팀원의 이야기를 먼저 들은 과정이 인상적이었음.',
    ],
    [
      '2부 Q1',
      '우선순위 설정',
      '고객 영향과 개발 비용을 기준으로 우선순위를 설명했음.',
    ],
  ],
};

const durationMinutes = 5;
const receivedReview: ReceivedReview = {
  viewer: { ticketCount: 2, hasUnreadNotifications: true },
  scheduleLabel: '11.20 (금) 14:00 · 면접자',
  levelLabel: 'Lv.2 서류 합격자',
  keywords: [
    { icon: 'example', label: '구체적인 사례', positive: true, count: 2 },
    { icon: 'delivery', label: '명확한 전달', positive: true, count: 2 },
    {
      icon: 'improvement',
      label: '근거가 부족해요',
      positive: false,
      count: 1,
    },
  ],
  comments: [
    {
      id: '1',
      author: '면접관 1',
      text: '사례가 구체적이라 이해가 쉬웠어요. 다만 결과를 숫자로 먼저 말해 주면 더 설득력 있을 것 같아요. 협업에서 내 역할을 조금 더 강조해 보세요.',
    },
    {
      id: '2',
      author: '면접관 2',
      text: '도움을 요청한 과정과 배운 점을 잘 전달했어요. 다음에는 선택의 근거도 함께 들려주세요.',
    },
  ],
  questionGroups: [
    {
      label: '1부 공통 질문',
      questions: [
        {
          title: '다른 사람에게 도움을 받아 성과를 낸 경험이 있나요?',
          intent: '도움을 요청하고 감사할 줄 아는 협업 태도를 봐요.',
          guide:
            '내가 막혔던 지점 → 누구에게 어떻게 요청했는지 → 결과 → 이후 내가 돌려준 것.',
        },
        {
          title: '팀원과 의견이 달랐을 때 어떻게 조율했나요?',
          intent: '다른 의견을 듣고 합의하는 과정을 봐요.',
          guide: '의견 차이 → 공통의 목표 → 합의한 기준과 결과.',
        },
      ],
    },
    {
      label: '2부 커스텀 질문',
      questions: [
        {
          title: 'A/B 테스트의 결과를 어떻게 해석했나요?',
          intent: '가설을 데이터로 검증하는 과정을 봐요.',
          guide: '가설 → 성공 지표 → 관찰한 차이 → 다음 실험.',
        },
      ],
    },
    {
      label: '3부 자유 질문',
      questions: [
        {
          title: '팀의 성과에 어떤 기여를 했나요?',
          intent: '팀의 성과와 개인의 역할을 구분해서 설명하는지 봐요.',
          guide: '팀의 목표 → 내가 맡은 일 → 성과와 배운 점.',
        },
      ],
    },
  ],
};

const sheetCandidates = candidates.map((person) => ({
  ...person,
  imageUrl: profileImage,
  memos: memos[person.id].map(([part, title, body]) => ({ part, title, body })),
}));
const keywords = {
  strengths: strengths.map((label) => ({ value: label, label })),
  improvements: improvements.map((label) => ({
    value: label,
    label,
    exclusive: label === '없어요',
  })),
};

type Session = {
  deadline: number | null;
  feedback: Record<string, FeedbackDraft & { submitted: boolean }>;
};

// 기존 예시 세션을 그대로 복원한다. 실제 API로 전환하면 이 파일과 함께 제거된다.
let session: ReturnType<typeof createSession> | undefined;

function createSession() {
  return createStore<Session>()(
    persist(
      (): Session => ({
        deadline: null,
        feedback: {},
      }),
      {
        name: 'moing:example-interview:v1',
        storage: createJSONStorage(() => sessionStorage),
        partialize: ({ deadline, feedback }) => ({ deadline, feedback }),
      },
    ),
  );
}

function getFeedback(): InterviewFeedback {
  session ??= createSession();
  const { feedback, deadline: savedDeadline } = session.getState();
  const deadline = savedDeadline ?? Date.now() + durationMinutes * 60_000;
  if (savedDeadline === null) session.setState({ deadline });
  return {
    candidates: sheetCandidates,
    keywords,
    deadline,
    durationMinutes,
    scheduleLabel: '11.20 (월) 14:00',
    submittedIds: candidates
      .filter(({ id }) => feedback[id]?.submitted)
      .map(({ id }) => id),
    drafts: Object.fromEntries(
      candidates.map(({ id }) => {
        const { strengths, improvements, comment } =
          feedback[id] ?? emptyFeedback();
        return [id, { strengths, improvements, comment }];
      }),
    ),
  };
}

function storeDrafts(drafts: Record<string, FeedbackDraft>, submitId?: string) {
  session ??= createSession();
  const state = session.getState();
  if ((state.deadline ?? 0) <= Date.now())
    throw new Error('피드백 작성 시간이 종료됐어요.');
  const feedback = { ...state.feedback };
  for (const { id } of candidates) {
    if (drafts[id] && !feedback[id]?.submitted) {
      feedback[id] = { ...drafts[id], submitted: id === submitId };
    }
  }
  session.setState({ feedback });
}

export const interviewMock: InterviewDataSource = {
  async getReceivedReview() {
    return receivedReview;
  },
  async getFeedback() {
    return getFeedback();
  },
  async saveFeedback(drafts) {
    storeDrafts(drafts);
  },
  async submitFeedback({ candidateId, drafts }) {
    const { getFeedbackCommentError } = await import('@/utils/FeedbackComment');
    const draft = drafts[candidateId];
    if (
      !candidates.some(({ id }) => id === candidateId) ||
      !draft ||
      !hasValidFeedbackKeywords(draft.strengths, keywords.strengths) ||
      !hasValidFeedbackKeywords(draft.improvements, keywords.improvements) ||
      getFeedbackCommentError(draft.comment)
    ) {
      throw new Error('평가 내용을 확인해주세요.');
    }
    storeDrafts(drafts, candidateId);
    return getFeedback();
  },
};
