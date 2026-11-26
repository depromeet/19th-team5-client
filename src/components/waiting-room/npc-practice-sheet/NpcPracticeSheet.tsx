import {
  IconArrowClockwiseCircularLine,
  IconChevronLeftLine,
  IconChevronRightLine,
  IconXmarkLine,
} from '@karrotmarket/react-monochrome-icon';
import { useId, useState } from 'react';
import { BottomSheet, Button, Dialog, Tag } from '@/components/common';
import type { Npc, NpcQuestion } from '@/types/waiting-room/npc';
import * as styles from './npcPracticeSheet.css';

type NpcPracticeSheetProps = {
  isOpen: boolean;
  npc: Npc;
  questions: readonly NpcQuestion[];
  onClose: () => void;
};

/**
 * 김대리와 아이스브레이킹. 예상 질문을 넘겨 보며 연습하고, 카드를 눌러 모범답안을 본다.
 * 연습 중에 닫으려 하면 종료 확인을 먼저 띄운다.
 */
export function NpcPracticeSheet({
  isOpen,
  npc,
  questions,
  onClose,
}: NpcPracticeSheetProps) {
  const nameId = useId();
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);
  const question = questions[index];

  function changeQuestion(nextIndex: number) {
    setIndex(nextIndex);
    setShowAnswer(false);
    setIsPracticing(false);
  }

  function requestClose() {
    if (isPracticing) setIsEndConfirmOpen(true);
    else onClose();
  }

  function endPractice() {
    setIsPracticing(false);
    setShowAnswer(false);
    setIsEndConfirmOpen(false);
    onClose();
  }

  if (!question) return null;

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onRequestClose={requestClose}
        aria-labelledby={nameId}
      >
        <BottomSheet.Header>
          <div className={styles.header}>
            <BottomSheet.Avatar
              className={styles.avatar}
              src={npc.profileImageUrl}
            />
            <div className={styles.introduction}>
              <h2 id={nameId} className={styles.name}>
                {npc.name}
              </h2>
              <p className={styles.greeting}>{npc.greeting}</p>
            </div>
            <Button
              variant='text'
              className={styles.closeButton}
              aria-label={`${npc.name}와 대화 닫기`}
              onClick={requestClose}
            >
              <IconXmarkLine size={20} aria-hidden='true' />
            </Button>
          </div>
        </BottomSheet.Header>
        <BottomSheet.Body
          sidebar={
            <BottomSheet.Panel>
              <h3 className={styles.tipHeading}>{npc.name}의 답변 팁</h3>
              <ol className={styles.tips}>
                {npc.tips.map((tip, tipIndex) => (
                  <li key={tip} className={styles.tip}>
                    <span className={styles.tipNumber} aria-hidden='true'>
                      {tipIndex + 1}
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
              <div className={styles.navigation}>
                <div className={styles.meta}>
                  <Tag tone='gray'>{npc.category}</Tag>
                  <span>
                    {index + 1} / {questions.length}
                  </span>
                  {showAnswer && (
                    <span className={styles.answerLabel}>
                      모범답안 · {question.title}
                    </span>
                  )}
                </div>
                <div className={styles.controls}>
                  <span className={styles.controlsLabel}>다른 질문</span>
                  <Button
                    variant='secondary'
                    className={styles.arrowButton}
                    aria-label='이전 질문'
                    disabled={index === 0}
                    onClick={() => changeQuestion(index - 1)}
                  >
                    <IconChevronLeftLine size={20} aria-hidden='true' />
                  </Button>
                  <Button
                    variant='secondary'
                    className={styles.arrowButton}
                    aria-label='다음 질문'
                    disabled={index === questions.length - 1}
                    onClick={() => changeQuestion(index + 1)}
                  >
                    <IconChevronRightLine size={20} aria-hidden='true' />
                  </Button>
                </div>
              </div>
              <div className={styles.details}>
                {showAnswer ? (
                  <p className={styles.answer}>{question.answer}</p>
                ) : (
                  <h3 className={styles.question}>{question.prompt}</h3>
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
                <Button
                  size='large'
                  display='block'
                  onClick={() =>
                    isPracticing
                      ? setIsEndConfirmOpen(true)
                      : setIsPracticing(true)
                  }
                >
                  {isPracticing ? '연습 끝내기' : '연습하기'}
                </Button>
                {isPracticing && (
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
              </div>
            </div>
          </BottomSheet.Panel>
        </BottomSheet.Body>
      </BottomSheet>

      <Dialog
        isOpen={isEndConfirmOpen}
        closedby='closerequest'
        onCancel={() => setIsEndConfirmOpen(false)}
      >
        <Dialog.Header className={styles.centeredText}>
          연습을 종료할까요?
        </Dialog.Header>
        <Dialog.Description className={styles.centeredText}>
          종료하면 대기실로 돌아가요. 연습은 언제든 다시 할 수 있어요
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            variant='secondary'
            size='large'
            display='block'
            onClick={() => setIsEndConfirmOpen(false)}
          >
            계속 연습하기
          </Button>
          <Button size='large' display='block' onClick={endPractice}>
            종료하기
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}
