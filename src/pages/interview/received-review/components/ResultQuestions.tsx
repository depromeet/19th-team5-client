import { IconChevronDownLine } from '@karrotmarket/react-monochrome-icon';
import { Tag } from '@/components/common/tag';
import type { QuestionGroup } from '@/types/Interview';
import * as styles from '../../Interview.css';
import * as resultStyles from '../ReceivedReviewPage.css';

export function ResultQuestions({
  questionGroups,
}: {
  questionGroups: QuestionGroup[];
}) {
  return (
    <section className={resultStyles.section}>
      <div className={resultStyles.sectionHeading}>
        <div className={styles.row}>
          <h2 className={styles.subtitle}>내가 받은 질문</h2>
          <span className={styles.note} title='질문 그룹 수'>
            {questionGroups.length}개
          </span>
        </div>
        <p className={styles.note}>
          {questionGroups.length === 0
            ? '표시할 질문이 없어요.'
            : '질문을 누르면 질문 의도와 모범 답변 방향을 펼쳐 볼 수 있어요.'}
        </p>
      </div>
      {questionGroups.map((group, index) => (
        <details
          className={resultStyles.group}
          key={group.label}
          open={index === 0}
        >
          <summary className={resultStyles.summary}>
            <Tag tone='gray' className={resultStyles.groupTag}>
              {group.label}
            </Tag>
            <IconChevronDownLine size={18} aria-hidden />
          </summary>
          {group.questions.map((q, n) => (
            <details
              key={q.title}
              className={resultStyles.question}
              open={index === 0 && n === 0}
            >
              <summary className={resultStyles.questionSummary}>
                <IconChevronDownLine size={14} aria-hidden />Q{n + 1}. {q.title}
              </summary>
              <div className={resultStyles.questionAnswer}>
                <p className={resultStyles.questionIntent}>
                  질문 의도　{q.intent}
                </p>
                <div className={resultStyles.guide}>
                  <b className={resultStyles.guideTitle}>모범 답변 방향</b>
                  <span className={resultStyles.guideText}>{q.guide}</span>
                </div>
              </div>
            </details>
          ))}
        </details>
      ))}
    </section>
  );
}
