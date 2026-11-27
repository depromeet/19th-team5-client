import type { ReactNode } from 'react';
import * as styles from './stageCard.css';

export type StageCardProps = {
  /** notice: 지금 할 일 안내, question: 면접관이 고른 질문 */
  variant: 'notice' | 'question';
  /** 제목 위 한 줄. 예) 면접장 입장 · 남은 시간 00:48 */
  caption: ReactNode;
  /** caption 뒤에 흐린 점으로 나눠 붙이는 말. 예) 단단한 곰 면접관 */
  byline?: string;
  /** 제목. 강조할 말(예: 내 이름)은 요소로 감싸 넘길 수 있다. */
  title: ReactNode;
  className?: string;
};

/**
 * 면접자 화면 위쪽 가운데 카드. 지금 할 일이나 면접관이 고른 질문을 보여준다.
 * 같은 카드의 내용만 바꿔 쓰므로, 질문이 바뀌면 스크린 리더가 새 제목을 읽는다.
 */
export function StageCard({
  variant,
  caption,
  byline,
  title,
  className,
}: StageCardProps) {
  return (
    <div
      className={[styles.card({ variant }), className]
        .filter(Boolean)
        .join(' ')}
    >
      <p className={styles.caption}>
        <span>{caption}</span>
        {byline && (
          <>
            <span className={styles.separator} aria-hidden='true'>
              ·
            </span>
            <span>{byline}</span>
          </>
        )}
      </p>
      <h2 className={styles.title({ variant })} aria-live='polite'>
        {title}
      </h2>
    </div>
  );
}
