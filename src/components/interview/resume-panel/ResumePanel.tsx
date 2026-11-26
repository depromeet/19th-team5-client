import { type ReactNode, useId } from 'react';
import { Tabs } from '@/components/common';
import type { Candidate } from '@/types/question-sheet/candidate';
import { AvatarPortrait } from '../avatar-portrait';
import * as styles from './resumePanel.css';

type ResumePanelProps = {
  candidate: Candidate;
  /** 프로필 오른쪽에 붙는 안내. 예) 면접관에게 공유됨 · 읽기 전용 */
  badge?: ReactNode;
  className?: string;
};

/**
 * 면접자 서류. 프로토타입은 자기소개서만 보여주고, 이력·포트폴리오 탭은 자리만 둔다.
 * 면접관의 질문지와 면접자의 내 자소서가 함께 쓴다.
 */
export function ResumePanel({ candidate, badge, className }: ResumePanelProps) {
  const id = useId();
  const coverLetterTabId = `${id}-cover-letter`;
  const panelId = `${id}-panel`;

  return (
    <section
      className={[styles.panel, className].filter(Boolean).join(' ')}
      aria-label={`${candidate.label} 서류`}
    >
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
          {badge}
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
