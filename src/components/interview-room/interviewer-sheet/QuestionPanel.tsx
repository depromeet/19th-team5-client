import {
  IconChevronLeftLine,
  IconChevronRightLine,
} from '@karrotmarket/react-monochrome-icon';
import { Button, Tag } from '@/components/common';
import type { QuestionCard } from '@/types/interview-room/question';
import * as styles from './questionPanel.css';

type QuestionPanelProps = {
  question: QuestionCard;
  /** 지금 질문의 순서. 1부터 센다. */
  number: number;
  total: number;
  /** 의도 앞에 "의도 ·"를 붙인다. 면접관이 직접 쓴 2부 질문에 쓴다. */
  labelIntent?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
};

/** 질문 카드 왼쪽. 질문과 의도를 보여주고, 같은 부의 다른 질문으로 넘긴다. */
export function QuestionPanel({
  question,
  number,
  total,
  labelIntent = false,
  onPrevious,
  onNext,
}: QuestionPanelProps) {
  return (
    <>
      <div className={styles.navigation}>
        <div className={styles.meta}>
          <Tag tone='gray'>{question.category}</Tag>
          <span>
            {number} / {total}
          </span>
        </div>
        <div className={styles.controls}>
          <span className={styles.controlsLabel}>다른 질문</span>
          <Button
            variant='secondary'
            className={styles.arrowButton}
            aria-label='이전 질문'
            disabled={!onPrevious}
            onClick={onPrevious}
          >
            <IconChevronLeftLine size={20} aria-hidden='true' />
          </Button>
          <Button
            variant='secondary'
            className={styles.arrowButton}
            aria-label='다음 질문'
            disabled={!onNext}
            onClick={onNext}
          >
            <IconChevronRightLine size={20} aria-hidden='true' />
          </Button>
        </div>
      </div>
      <h2 className={styles.question}>{question.text}</h2>
      <p className={styles.intent}>
        {labelIntent && '의도 · '}
        {question.intent}
      </p>
    </>
  );
}
