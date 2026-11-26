import { Tag } from '@/components/common';
import { DocumentOverlay, ResumePanel } from '@/components/interview';
import type { Candidate } from '@/types/question-sheet/candidate';
import * as styles from './myResumeOverlay.css';

type MyResumeOverlayProps = {
  isOpen: boolean;
  resume: Candidate;
  remainingSeconds: number;
  onClose: () => void;
};

/** 면접자가 대기실에서 보는 내 자소서. 면접관에게 공유된 서류를 읽기만 한다. */
export function MyResumeOverlay({
  isOpen,
  resume,
  remainingSeconds,
  onClose,
}: MyResumeOverlayProps) {
  return (
    <DocumentOverlay
      isOpen={isOpen}
      title='내 자소서'
      remainingSeconds={remainingSeconds}
      onClose={onClose}
    >
      <ResumePanel
        className={styles.panel}
        candidate={resume}
        badge={<Tag tone='gray'>면접관에게 공유됨 · 읽기 전용</Tag>}
      />
    </DocumentOverlay>
  );
}
