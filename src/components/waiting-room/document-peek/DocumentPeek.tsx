import {
  IconDocumentFill,
  IconXmarkLine,
} from '@karrotmarket/react-monochrome-icon';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Button, FloatingCard } from '@/components/common';
import * as styles from './documentPeek.css';

type DocumentPeekProps = {
  /** 접힌 버튼의 아이콘 */
  icon: ReactNode;
  /** 카드 머리의 이름. 접힌 버튼의 이름으로도 쓴다. 예) 내 자소서 */
  label: string;
  title: string;
  description: string;
  /** 카드 가운데 미리보기 */
  preview: ReactNode;
  /** 자세히 보기를 누르면 부른다. */
  onOpenDetail: () => void;
  className?: string;
};

/**
 * 대기실 우측 하단에 접혀 있는 서류 버튼. 마우스를 올리거나 버튼을 누르면 요약 카드로 펼치고,
 * 자세히 보기로 읽기 전용 전체 화면을 연다.
 */
export function DocumentPeek({
  icon,
  label,
  title,
  description,
  preview,
  onOpenDetail,
  className,
}: DocumentPeekProps) {
  const cardId = useId();
  const titleId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const detailButtonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  // 펼치거나 접은 뒤 포커스를 옮길 곳. 마우스로 펼칠 때는 옮기지 않는다.
  const focusTarget = useRef<'card' | 'toggle' | null>(null);

  useEffect(() => {
    const target = focusTarget.current;
    focusTarget.current = null;
    if (target === 'card' && isExpanded) detailButtonRef.current?.focus();
    if (target === 'toggle' && !isExpanded) toggleRef.current?.focus();
  }, [isExpanded]);

  function expand(moveFocus: boolean) {
    if (moveFocus) focusTarget.current = 'card';
    setIsExpanded(true);
  }

  function collapse() {
    // 카드 안에 있던 포커스가 사라지지 않게 버튼으로 돌려준다.
    if (cardRef.current?.contains(document.activeElement)) {
      focusTarget.current = 'toggle';
    }
    setIsExpanded(false);
  }

  function openDetail() {
    collapse();
    onOpenDetail();
  }

  return (
    <section
      aria-label={label}
      className={[styles.peek, className].filter(Boolean).join(' ')}
      onMouseEnter={() => expand(false)}
      onMouseLeave={collapse}
    >
      <Button
        ref={toggleRef}
        className={styles.toggle}
        aria-label={`${label} 펼치기`}
        aria-expanded={isExpanded}
        aria-controls={cardId}
        hidden={isExpanded}
        onClick={() => expand(true)}
      >
        {icon}
      </Button>
      {isExpanded && (
        <FloatingCard
          ref={cardRef}
          id={cardId}
          className={styles.card}
          aria-labelledby={titleId}
          onKeyDown={(event) => {
            if (event.key === 'Escape') collapse();
          }}
        >
          <FloatingCard.Body>
            <div className={styles.content}>
              <div className={styles.header}>
                <span className={styles.iconBadge}>
                  <IconDocumentFill size={20} aria-hidden='true' />
                </span>
                <p className={styles.label}>{label}</p>
                <Button
                  variant='text'
                  className={styles.closeButton}
                  aria-label={`${label} 접기`}
                  onClick={collapse}
                >
                  <IconXmarkLine size={16} aria-hidden='true' />
                </Button>
              </div>
              <div className={styles.titleGroup}>
                <h2 id={titleId} className={styles.title}>
                  {title}
                </h2>
                <p className={styles.description}>{description}</p>
              </div>
              {preview}
            </div>
          </FloatingCard.Body>
          <FloatingCard.Footer>
            <Button ref={detailButtonRef} display='block' onClick={openDetail}>
              자세히 보기
            </Button>
          </FloatingCard.Footer>
        </FloatingCard>
      )}
    </section>
  );
}

/** 작성한 질문 미리보기. 한 줄씩 말줄임한다. */
export function QuestionPreview({
  questions,
  emptyText,
}: {
  questions: readonly { id: string; text: string }[];
  emptyText: string;
}) {
  if (questions.length === 0) {
    return <p className={styles.previewBox}>{emptyText}</p>;
  }
  return (
    <ol className={styles.previewBox}>
      {questions.map(({ id, text }, index) => (
        <li key={id} className={styles.questionRow}>
          <span className={styles.questionNumber}>{index + 1}</span>
          <span className={styles.questionText}>{text}</span>
        </li>
      ))}
    </ol>
  );
}

/** 자기소개서 첫 문항 미리보기. 답변은 두 줄까지 보여준다. */
export function ResumePreview({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className={styles.previewBox}>
      <p className={styles.resumeQuestion}>{question}</p>
      <p className={styles.resumeAnswer}>{answer}</p>
    </div>
  );
}
