import type { Candidate } from '@/types/question-sheet/candidate';
import { myNickname } from './participants';

/** 대기실에서 면접자가 읽기 전용으로 보는 내 자소서. 가입 때 등록한 서류를 API로 받으면 바꾼다. */
export const myResume: Candidate = {
  id: 'me',
  label: `${myNickname} (나)`,
  summary: '신입 · Lv.2 서류 합격자',
  resume: [
    {
      question: '지원 동기',
      answer:
        '좌석 예약 서비스를 리디자인하면서 사용자 인터뷰 12건을 진행했고, 예약 완료율을 18% 높였어요. 문제를 숫자로 확인하고 작은 실험으로 검증하는 방식이 저와 잘 맞는다고 느꼈어요.',
    },
    {
      question: '협업 경험',
      answer:
        '개발자와 의견이 달랐을 때 A/B 테스트로 결정했어요. 두 안의 전환율을 2주 동안 비교했고, 결과를 공유하면서 팀이 같은 기준으로 판단할 수 있게 됐어요.',
    },
  ],
};

/** 면접관에게 함께 공유된 이력·포트폴리오 파일 수 */
export const myAttachmentCount = 1;
