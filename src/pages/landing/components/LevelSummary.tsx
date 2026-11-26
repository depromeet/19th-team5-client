import { useEffect, useRef, useState } from 'react';
import * as pageStyles from '../HomePage.css';
import * as styles from './LevelSummary.css';
import { SectionTitle } from './SectionTitle';

export const interviewLevels = [
  { name: '지원자', requirement: '첫 출입증', pendingLabel: '첫 출입증' },
  { name: '서류 합격자', requirement: '면접 3회', pendingLabel: '면접 3회' },
  { name: '1차 합격자', requirement: '면접 8회', pendingLabel: '면접 5회 더' },
  {
    name: '최종 합격자',
    requirement: '면접 15회',
    pendingLabel: '면접 5회 더',
  },
  {
    name: '면접 마스터',
    requirement: '면접 30회',
    pendingLabel: '면접 5회 더',
  },
];

export function LevelSummary() {
  const listRef = useRef<HTMLOListElement>(null);
  const [filledCount, setFilledCount] = useState(0);
  const isComplete = filledCount === interviewLevels.length;

  useEffect(() => {
    const nextCard = listRef.current?.children.item(filledCount);
    if (!nextCard) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        if (entry.intersectionRatio < 0.5) return;
        if (reducedMotion.matches) {
          setFilledCount(interviewLevels.length);
          return;
        }
        // 좁은 화면에서도 다음 카드가 보이는 시점부터 한 칸씩 채운다.
        timer = window.setTimeout(
          () => setFilledCount(filledCount + 1),
          filledCount ? styles.levelFillDurationMs : 80,
        );
      },
      { threshold: 0.5 },
    );
    observer.observe(nextCard);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [filledCount]);

  return (
    <section id='levels'>
      <div className={pageStyles.container}>
        <SectionTitle label='LEVEL' title='면접을 볼수록 합격에 가까워져요' />
        <p className={pageStyles.detailDescription}>
          {interviewLevels.map(({ name }) => name).join(' → ')}. 신뢰도 레벨은
          다른 사람에게도 보여요.
        </p>
        <ol
          ref={listRef}
          className={styles.progressList}
          aria-label='출입증 레벨 달성 예시'
        >
          {interviewLevels.map(({ name, pendingLabel }, index) => (
            <li
              className={styles.progressCard}
              key={name}
              data-achieved={index < filledCount}
            >
              <h3 className={pageStyles.cardTitle}>{name}</h3>
              <p>{index < filledCount ? '달성' : pendingLabel}</p>
              {isComplete && index === interviewLevels.length - 1 && (
                <span className={styles.confetti} aria-hidden='true'>
                  {styles.confettiPieces.map((piece) => (
                    <span key={piece} className={piece} />
                  ))}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
