import { Button, TextArea } from '@/components/common';
import * as styles from './memoEditor.css';

export const memoMaxLength = 100;

type MemoEditorProps = {
  /** 어느 질문의 메모인지. 예) Q3 */
  label: string;
  value: string;
  canSave: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
};

/** 질문 카드 오른쪽. 지금 보고 있는 면접자와 질문에 메모를 남긴다. */
export function MemoEditor({
  label,
  value,
  canSave,
  onChange,
  onSave,
}: MemoEditorProps) {
  return (
    <div className={styles.editor}>
      <TextArea
        className={styles.field}
        aria-label='면접 메모'
        placeholder={`${label}.\n답변을 들으며 떠오른 점을 적어 두세요`}
        maxLength={memoMaxLength}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      <Button
        size='large'
        className={styles.saveButton}
        disabled={!canSave}
        onClick={onSave}
      >
        저장
      </Button>
    </div>
  );
}
