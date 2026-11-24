import {
  IconArrowClockwiseCircularLine,
  IconXmarkLine,
} from '@karrotmarket/react-monochrome-icon';
import { useState } from 'react';
import { BottomSheet, Button } from '@/components/common';
import { useDisclosure } from '@/hooks/useDisclosure';
import * as shared from './bottomSheetStory.css';
import * as styles from './npcConversationExample.css';
import { QuestionNavigation } from './QuestionNavigation';

const questions = [
  {
    title: '지원 동기',
    prompt: '이 직무에 지원한 이유는 무엇인가요?',
    answer:
      '사용자 관찰을 제품 개선으로 연결하는 과정에 흥미를 느꼈습니다. 이 직무에서 그 경험을 더 깊이 쌓고 싶습니다.',
  },
  {
    title: '직무 강점',
    prompt: '이 직무에서 발휘할 수 있는 강점은 무엇인가요?',
    answer:
      '복잡한 문제를 작게 나누고 팀이 먼저 검증할 가설을 정리하는 데 강점이 있습니다.',
  },
  {
    title: '1분 자기소개',
    prompt: '1분 자기소개, 시작해볼까요?',
    answer:
      '안녕하세요, 사용자 문제를 숫자로 증명하는 프로덕트 디자이너 김모임입니다. 이전 회사에서 결제 단계를 3단계에서 2단계로 줄여 이탈률을 18% 낮췄고, 매주 개발·데이터 팀과 실험을 설계했어요. 입사하면 이 경험을 살려 첫 3개월 안에 핵심 전환 구간부터 개선하겠습니다.',
  },
  {
    title: '협업 경험',
    prompt: '동료와 함께 문제를 해결한 경험이 있나요?',
    answer:
      '팀원들과 문의 기록을 함께 분류해 사용자들이 자주 놓치는 안내를 찾았습니다. 화면에 안내를 추가한 뒤 같은 문의가 줄었는지 확인했습니다.',
  },
  {
    title: '갈등 해결',
    prompt: '의견이 갈릴 때 어떻게 합의점을 찾나요?',
    answer:
      '두 제안이 해결하려는 문제를 먼저 정리합니다. 판단 기준을 함께 정한 다음 작은 실험으로 각 제안을 비교합니다.',
  },
  {
    title: '도전 경험',
    prompt: '처음 맡은 과제를 어떻게 풀어냈나요?',
    answer:
      '먼저 현재 상황을 아는 동료에게 흐름을 배웠습니다. 가장 불확실한 부분부터 시제품으로 확인한 뒤 계획을 조정했습니다.',
  },
  {
    title: '피드백',
    prompt: '피드백을 받고 방식을 바꾼 경험이 있나요?',
    answer:
      '검토 회의에서 결론을 찾기 어렵다는 피드백을 받았습니다. 이후 첫 장에 결정이 필요한 항목과 근거를 함께 적었습니다.',
  },
  {
    title: '입사 후 목표',
    prompt: '입사 후 가장 먼저 이루고 싶은 목표는 무엇인가요?',
    answer:
      '제품을 처음 쓰는 사용자를 관찰하고 가장 자주 막히는 지점을 찾겠습니다. 팀과 함께 개선안을 적용하고 변화를 확인하고 싶습니다.',
  },
];

const tips = [
  '결론(나는 어떤 사람)부터 말하기',
  '경험 1개 + 정량적 수치 1개',
  '직무와 연결해서 마무리',
];

type NpcConversationExampleProps = {
  initialState?: 'question' | 'practice' | 'answer';
  profileImageUrl?: string | null;
};

export function NpcConversationExample({
  initialState,
  profileImageUrl,
}: NpcConversationExampleProps) {
  const showInitialAnswer = initialState === 'answer';
  const initiallyPracticing = initialState === 'practice' || showInitialAnswer;
  const { isOpen, open, close } = useDisclosure(initialState !== undefined);
  const [index, setIndex] = useState(2);
  const [showAnswer, setShowAnswer] = useState(showInitialAnswer);
  const [practicing, setPracticing] = useState(initiallyPracticing);
  const question = questions[index];

  function changeQuestion(nextIndex: number) {
    setIndex(nextIndex);
    setShowAnswer(false);
    setPracticing(false);
  }

  function closeConversation() {
    close();
    setIndex(2);
    setShowAnswer(showInitialAnswer);
    setPracticing(initiallyPracticing);
  }

  return (
    <>
      <Button onClick={open}>NPC 대화 열기</Button>
      <BottomSheet
        isOpen={isOpen}
        onRequestClose={closeConversation}
        aria-label='김대리와 대화'
      >
        <BottomSheet.Header>
          <div className={styles.header}>
            <BottomSheet.Avatar
              className={styles.avatar}
              src={profileImageUrl}
            />
            <div className={styles.introduction}>
              <h2 className={shared.name}>김대리</h2>
              <p className={styles.greeting}>
                많이 긴장되시죠? 제가 기다리는 동안 연습을 도와드릴게요
              </p>
            </div>
            <Button
              variant='text'
              className={styles.closeButton}
              onClick={closeConversation}
              aria-label='대화 닫기'
            >
              <IconXmarkLine size={20} aria-hidden='true' />
            </Button>
          </div>
        </BottomSheet.Header>
        <BottomSheet.Body
          sidebar={
            <BottomSheet.Panel>
              <h3 className={styles.tipHeading}>김대리의 답변 팁</h3>
              <ol className={styles.tips}>
                {tips.map((tip, index) => (
                  <li className={shared.tip} key={tip}>
                    <span className={shared.tipNumber} aria-hidden='true'>
                      {index + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ol>
            </BottomSheet.Panel>
          }
        >
          <BottomSheet.Panel variant={showAnswer ? 'highlighted' : 'default'}>
            <div className={styles.card}>
              <QuestionNavigation
                category='인성 질문'
                position={`${index + 1} / ${questions.length}`}
                detail={showAnswer ? `모범답안 · ${question.title}` : undefined}
                onPrevious={
                  index > 0 ? () => changeQuestion(index - 1) : undefined
                }
                onNext={
                  index < questions.length - 1
                    ? () => changeQuestion(index + 1)
                    : undefined
                }
              />
              <div className={styles.details}>
                {showAnswer ? (
                  <p className={styles.answer}>{question.answer}</p>
                ) : (
                  <h3 className={shared.question}>{question.prompt}</h3>
                )}
                <button
                  type='button'
                  className={styles.flipButton}
                  aria-label={
                    showAnswer ? '질문으로 돌아가기' : '모범답안 보기'
                  }
                  aria-expanded={showAnswer}
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  <IconArrowClockwiseCircularLine
                    size={14}
                    aria-hidden='true'
                  />
                  {showAnswer
                    ? '카드를 누르면 질문으로 돌아가요'
                    : '카드를 누르면 모범답안을 볼 수 있어요'}
                </button>
              </div>
              <div className={styles.actions}>
                {practicing && (
                  <span
                    className={styles.voiceBadge}
                    role='img'
                    aria-label='연습 중'
                  >
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                )}
                <Button
                  size='large'
                  display='block'
                  onClick={() => {
                    if (practicing) setShowAnswer(false);
                    setPracticing(!practicing);
                  }}
                >
                  {practicing ? '연습 끝내기' : '연습하기'}
                </Button>
              </div>
            </div>
          </BottomSheet.Panel>
        </BottomSheet.Body>
      </BottomSheet>
    </>
  );
}
