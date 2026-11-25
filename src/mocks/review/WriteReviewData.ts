import type { InterviewFeedback } from '@/types/Interview';

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

export const writeReviewData: Pick<
  InterviewFeedback,
  'candidates' | 'keywords' | 'durationMinutes' | 'scheduleLabel'
> = {
  candidates: sheetCandidates,
  keywords,
  durationMinutes: 5,
  scheduleLabel: '11.20 (월) 14:00',
};
