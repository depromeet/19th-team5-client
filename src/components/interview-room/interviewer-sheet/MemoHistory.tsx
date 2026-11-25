import { useId } from 'react';
import { Tag } from '@/components/common';
import { partLabels } from '@/constants/interview-room/parts';
import { getMemoKey } from '@/stores/interview-room/interviewMemoStore';
import type { InterviewMemo } from '@/types/interview-room/memo';
import * as styles from './memoHistory.css';

type MemoHistoryProps = {
  /** 1·2부에 남긴 메모. 질문 순서대로 넘긴다. */
  memos: readonly InterviewMemo[];
};

/** 3부 질문 카드 왼쪽. 꼬리질문을 고를 수 있게 1·2부에 남긴 메모를 다시 보여준다. */
export function MemoHistory({ memos }: MemoHistoryProps) {
  const headingId = useId();

  return (
    <section className={styles.history} aria-labelledby={headingId}>
      <div className={styles.heading}>
        <h2 id={headingId} className={styles.title}>
          지난 메모
        </h2>
        <span>1·2부에서 적은 메모예요</span>
      </div>
      {memos.length > 0 ? (
        <ul className={styles.list}>
          {memos.map((memo) => (
            <li key={getMemoKey(memo)} className={styles.item}>
              <Tag tone='gray'>
                {partLabels[memo.part].order} Q{memo.questionNumber}
              </Tag>
              <p className={styles.text}>{memo.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>1·2부에 남긴 메모가 없어요</p>
      )}
    </section>
  );
}
