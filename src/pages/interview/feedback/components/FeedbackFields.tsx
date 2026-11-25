import { Checkbox } from '@/components/common/checkbox';
import { TextArea } from '@/components/common/text-area';
import type {
  FeedbackDraft,
  InterviewFeedback,
  KeywordGroup,
} from '@/types/Interview';
import { commentLimit } from '@/utils/FeedbackComment';
import { toggleFeedbackKeyword } from '@/utils/FeedbackDraft';
import * as styles from '../../Interview.css';
import * as feedbackStyles from '../FeedbackPage.css';

const groups = [
  {
    field: 'strengths',
    title: '좋았던 점',
    description: '상대에게 도움이 된 점을 1개 이상 골라주세요.',
  },
  {
    field: 'improvements',
    title: '아쉬운 점',
    description: '다음 연습에서 바꿔보면 좋을 점을 골라주세요.',
  },
] as const;

export function FeedbackFields({
  feedback,
  invalidGroups,
  keywords,
  disabled,
  commentError,
  onChange,
}: {
  feedback: FeedbackDraft;
  keywords: InterviewFeedback['keywords'];
  disabled: boolean;
  invalidGroups: Record<KeywordGroup, boolean>;
  commentError?: string;
  onChange: (feedback: FeedbackDraft) => void;
}) {
  return (
    <div className={feedbackStyles.fields}>
      {groups.map(({ field, title, description }) => {
        const selected = feedback[field];
        const missing = invalidGroups[field];
        return (
          <section className={styles.stack} key={field} aria-labelledby={field}>
            <div className={styles.row}>
              <h2 id={field} className={styles.subtitle}>
                {title} <span className={feedbackStyles.required}>*</span>
              </h2>
              <span className={styles.note}>{selected.length}개 선택</span>
            </div>
            <p className={styles.note}>{description}</p>
            <div className={feedbackStyles.chips}>
              {keywords[field].map((option) => (
                <Checkbox
                  key={option.value}
                  variant='chip'
                  checked={selected.includes(option.value)}
                  disabled={disabled}
                  aria-invalid={missing || undefined}
                  aria-describedby={missing ? `${field}-error` : undefined}
                  onChange={() =>
                    onChange({
                      ...feedback,
                      [field]: toggleFeedbackKeyword(
                        selected,
                        option,
                        keywords[field],
                      ),
                    })
                  }
                >
                  {option.label}
                </Checkbox>
              ))}
            </div>
            {missing && (
              <p id={`${field}-error`} role='alert' className={styles.error}>
                {selected.length === 0
                  ? '1개 이상 선택해주세요.'
                  : '선택한 키워드를 다시 확인해주세요.'}
              </p>
            )}
          </section>
        );
      })}
      <section className={styles.stack}>
        <h2 className={styles.subtitle}>
          <label htmlFor='feedback-comment'>한 줄 평 (선택)</label>
        </h2>
        <p className={styles.note} id='feedback-comment-description'>
          면접자에게 전하고 싶은 말을 짧게 남겨요.
        </p>
        <TextArea
          id='feedback-comment'
          aria-describedby='feedback-comment-description'
          className={feedbackStyles.comment}
          value={feedback.comment}
          error={!!commentError}
          helperText={commentError}
          placeholder='면접자에게 전하고 싶은 말을 짧게 남겨 주세요'
          maxLength={commentLimit}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...feedback, comment: event.target.value })
          }
        />
      </section>
    </div>
  );
}
