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

export const task3Resume: Candidate = {
  ...myResume,
  resume: [
    {
      question: '프로젝트에서 개선할 문제를 발견한 경험을 소개해 주세요.',
      answer:
        '팀 프로젝트로 좌석 예약 서비스를 만들었어요. 사용자가 좌석을 고른 뒤 마지막 확인 단계에서 예약을 끝내지 않고 나가는 경우가 반복됐어요. 사용성 테스트에서도 몇몇 사용자가 예약이 완료된 줄 알고 확인 버튼을 누르기 전에 화면을 닫았어요. 팀과 함께 이탈이 가장 많이 발생한 단계부터 살펴보기로 했어요.',
    },
    {
      question: '팀과 함께 문제를 개선하고 결과를 확인한 경험을 소개해 주세요.',
      answer:
        '팀원들과 예약이 아직 진행 중이라는 점을 보여주고, 마지막 확인 버튼을 찾기 쉽게 바꿨어요. 변경 전후에 좌석을 선택한 사람 중 예약을 끝낸 비율을 비교했더니 완료율이 높아졌어요. 같은 예약 과제로 사용성 테스트를 다시 진행해, 사용자가 예약이 완료되는 시점을 구분할 수 있는지도 확인했어요.',
    },
  ],
};

/** 면접관에게 함께 공유된 이력·포트폴리오 파일 수 */
export const myAttachmentCount = 1;
