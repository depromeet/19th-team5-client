import type { QuestionCard } from '../../types/interview-room/question.ts';

export const task4CustomQuestions = {
  A: [
    {
      id: 'task4-custom-a-1',
      category: '커스텀 질문',
      text: '프로젝트에서 개선이 필요하다고 판단한 근거는 무엇이었나요?',
      intent: '문제를 발견할 때 어떤 관찰이나 데이터를 근거로 삼았는지 봐요.',
    },
    {
      id: 'task4-custom-a-2',
      category: '커스텀 질문',
      text: '문제가 가장 자주 발생하는 지점은 어떻게 찾았나요?',
      intent: '관찰과 데이터를 바탕으로 문제의 범위를 좁히는지 봐요.',
    },
    {
      id: 'task4-custom-a-3',
      category: '커스텀 질문',
      text: '여러 개선안 중 무엇을 먼저 시도했고, 그 이유는 무엇이었나요?',
      intent: '예상 효과와 작업 범위를 고려해 우선순위를 정했는지 봐요.',
    },
  ],
  B: [
    {
      id: 'task4-custom-b-1',
      category: '커스텀 질문',
      text: '팀의 작업 방식에서 반복되는 문제를 어떻게 알아차렸나요?',
      intent: '반복되는 불편을 구체적인 사례로 설명하는지 봐요.',
    },
    {
      id: 'task4-custom-b-2',
      category: '커스텀 질문',
      text: '그 문제를 먼저 해결할 가치가 있다고 판단한 근거는 무엇이었나요?',
      intent: '문제가 팀의 작업에 미치는 영향을 어떻게 판단했는지 봐요.',
    },
    {
      id: 'task4-custom-b-3',
      category: '커스텀 질문',
      text: '개선을 시작하기 전에 어떤 상태가 되면 효과가 있다고 보기로 했나요?',
      intent: '변경 전에 성공 기준을 구체적으로 정했는지 봐요.',
    },
  ],
} as const satisfies Record<'A' | 'B', readonly QuestionCard[]>;
