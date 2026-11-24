import {
  IconChevronLeftLine,
  IconChevronRightLine,
} from '@karrotmarket/react-monochrome-icon';
import { Button } from '@/components/common';
import * as styles from './bottomSheet.stories.css';

type QuestionNavigationProps = {
  category: string;
  position: string;
  detail?: string;
  onPrevious?: () => void;
  onNext?: () => void;
};

export function QuestionNavigation({
  category,
  position,
  detail,
  onPrevious,
  onNext,
}: QuestionNavigationProps) {
  return (
    <div className={styles.questionNavigation}>
      <div className={styles.questionMeta}>
        <span className={styles.badge}>{category}</span>
        <span>{position}</span>
        {detail && <span className={styles.answerLabel}>{detail}</span>}
      </div>
      <div className={styles.questionControls}>
        <span className={styles.navigationLabel}>다른 질문</span>
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
  );
}
