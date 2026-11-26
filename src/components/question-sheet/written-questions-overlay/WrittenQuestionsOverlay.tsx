import { useId, useState } from 'react';
import { Radio } from '@/components/common';
import { DocumentOverlay, ResumePanel } from '@/components/interview';
import { visuallyHidden } from '@/styles/a11y.css';
import type { Candidate } from '@/types/question-sheet/candidate';
import { WrittenQuestionPanel } from './WrittenQuestionPanel';
import * as styles from './writtenQuestionsOverlay.css';

type WrittenQuestionsOverlayProps = {
  isOpen: boolean;
  interviewId: string;
  candidates: readonly Candidate[];
  remainingSeconds: number;
  onClose: () => void;
};

/**
 * 면접관이 대기실에서 보는 작성한 질문지. 면접자별 서류와 2부 질문을 읽기만 한다.
 * 질문은 로비에서 QuestionSheetOverlay로 쓴다.
 */
export function WrittenQuestionsOverlay({
  isOpen,
  interviewId,
  candidates,
  remainingSeconds,
  onClose,
}: WrittenQuestionsOverlayProps) {
  return (
    <DocumentOverlay
      isOpen={isOpen}
      title='작성한 질문지'
      remainingSeconds={remainingSeconds}
      onClose={onClose}
    >
      <WrittenQuestions interviewId={interviewId} candidates={candidates} />
    </DocumentOverlay>
  );
}

/** 열 때마다 첫 면접자부터 보여주도록 오버레이가 열려 있을 때만 그린다. */
function WrittenQuestions({
  interviewId,
  candidates,
}: Pick<WrittenQuestionsOverlayProps, 'interviewId' | 'candidates'>) {
  const candidateGroupName = useId();
  const [candidateId, setCandidateId] = useState(candidates[0]?.id ?? '');
  const candidate = candidates.find(({ id }) => id === candidateId);

  return (
    <div className={styles.body}>
      <fieldset className={styles.candidates}>
        <legend className={visuallyHidden}>면접자 선택</legend>
        {candidates.map(({ id, label }) => (
          <Radio
            key={id}
            name={candidateGroupName}
            value={id}
            checked={id === candidateId}
            onChange={() => setCandidateId(id)}
          >
            {label}
          </Radio>
        ))}
      </fieldset>
      {candidate && (
        <div className={styles.columns}>
          <ResumePanel candidate={candidate} />
          <WrittenQuestionPanel
            interviewId={interviewId}
            candidateId={candidate.id}
          />
        </div>
      )}
    </div>
  );
}
