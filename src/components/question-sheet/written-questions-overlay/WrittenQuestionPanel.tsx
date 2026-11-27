import { useId } from 'react';
import type { QuestionDraft } from '@/types/question-sheet/questionDraft';
import * as styles from './writtenQuestionPanel.css';

type WrittenQuestion = Omit<QuestionDraft, 'answerGuide'> & {
  answerGuide?: string;
};

/** 면접자 한 명에게 쓴 2부 질문. 질문 의도와 모범 답변 방향을 함께 보여준다. */
export function WrittenQuestionPanel({
  questions,
}: {
  questions: readonly WrittenQuestion[];
}) {
  const headingId = useId();

  return (
    <section className={styles.panel} aria-labelledby={headingId}>
      <div className={styles.header}>
        <h2 id={headingId} className={styles.heading}>
          2부에서 물어볼 질문 {questions.length}개
        </h2>
        <p className={styles.helper}>
          대기실에서는 볼 수만 있어요. 질문 순서대로 2부에서 물어보게 돼요.
        </p>
      </div>
      {questions.length === 0 ? (
        <p className={styles.empty}>이 면접자에게 작성한 질문이 없어요</p>
      ) : (
        <ol className={styles.list}>
          {questions.map((question, index) => (
            <li key={question.id} className={styles.item}>
              <p className={styles.question}>
                <span className={styles.number}>{index + 1}</span>
                {question.text}
              </p>
              {(question.intent.trim() || question.answerGuide?.trim()) && (
                <dl className={styles.details}>
                  {question.intent.trim() && (
                    <div className={styles.detail}>
                      <dt className={styles.detailLabel}>질문 의도</dt>
                      <dd className={styles.detailText}>{question.intent}</dd>
                    </div>
                  )}
                  {question.answerGuide?.trim() && (
                    <div className={styles.detail}>
                      <dt className={styles.detailLabel}>모범 답변 방향</dt>
                      <dd className={styles.detailText}>
                        {question.answerGuide}
                      </dd>
                    </div>
                  )}
                </dl>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
