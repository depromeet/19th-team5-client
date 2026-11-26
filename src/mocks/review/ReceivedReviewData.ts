import type { ReceivedReview } from '@/types/Interview';

export const receivedReviewData: ReceivedReview = {
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
