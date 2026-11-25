import { useId } from 'react';
import { Tabs } from '@/components/common';
import { AvatarPortrait } from '@/components/interview';
import type { Candidate } from '@/types/question-sheet/candidate';
import * as styles from './resumePanel.css';

/**
 * 면접자 서류. 프로토타입은 자기소개서만 보여주고, 이력·포트폴리오 탭은 자리만 둔다.
 */
export function ResumePanel({ candidate }: { candidate: Candidate }) {
  const id = useId();
  const coverLetterTabId = `${id}-cover-letter`;
  const panelId = `${id}-panel`;

  return (
    <section className={styles.panel} aria-label={`${candidate.label} 서류`}>
      <Tabs className={styles.tabs} aria-label='서류 종류'>
        <Tabs.Item
          id={coverLetterTabId}
          className={styles.tab}
          selected
          aria-controls={panelId}
        >
          자기소개서
        </Tabs.Item>
        <Tabs.Item className={styles.tab} selected={false} disabled>
          이력 · 포트폴리오
        </Tabs.Item>
      </Tabs>
      <div
        id={panelId}
        className={styles.paper}
        role='tabpanel'
        aria-labelledby={coverLetterTabId}
      >
        <div className={styles.profile}>
          <AvatarPortrait size='small' />
          <div className={styles.profileText}>
            <p className={styles.name}>{candidate.label}</p>
            <p className={styles.summary}>{candidate.summary}</p>
          </div>
        </div>
        <hr className={styles.divider} />
        <dl className={styles.answers}>
          {candidate.resume.map(({ question, answer }, index) => (
            <div key={question} className={styles.answer}>
              <dt className={styles.answerQuestion}>
                Q{index + 1}. {question}
              </dt>
              <dd className={styles.answerText}>{answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
