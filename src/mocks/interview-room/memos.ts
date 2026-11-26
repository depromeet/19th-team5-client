import type { InterviewMemo } from '@/types/interview-room/memo';

/** 3부 "지난 메모"에 보여줄 목 데이터. 1·2부에서 저장한 메모가 없는 면접자에게 쓴다. */
export const pastMemos: Readonly<Record<string, readonly InterviewMemo[]>> = {
  A: [
    {
      part: 'common',
      questionNumber: 2,
      text: '결론부터 말해서 좋았음. 다만 팀 프로젝트에서 본인이 맡은 역할이 흐릿하게 들림. 3부에서 기여한 부분을 수치로 다시 물어보기.',
    },
    {
      part: 'common',
      questionNumber: 3,
      text: '선배에게 피드백을 요청한 과정이 구체적이었음. 감사 표현까지 언급해서 협업 태도가 좋아 보임.',
    },
    {
      part: 'custom',
      questionNumber: 1,
      text: '가설 설정은 명확했으나 결과 해석에서 표본 크기 언급이 없었음. 실패 원인을 데이터로 설명하는지 꼬리질문으로 확인 필요. 말 속도가 조금 빠른 편.',
    },
  ],
  B: [
    {
      part: 'common',
      questionNumber: 1,
      text: '자기소개가 1분 안에 끝나서 좋았음. 직무와 연결하는 마무리가 아쉬움.',
    },
    {
      part: 'custom',
      questionNumber: 2,
      text: '전환율 실험의 가설은 분명했음. 실험 기간을 어떻게 정했는지 다시 물어보기.',
    },
  ],
};
