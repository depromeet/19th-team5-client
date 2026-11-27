import { type ComponentProps, useId, useState } from 'react';
import { Radio } from '@/components/common';
import { DocumentOverlay, ResumePanel } from '@/components/interview';
import { visuallyHidden } from '@/styles/a11y.css';
import type { Candidate } from '@/types/question-sheet/candidate';
import * as styles from '../questionSheetLayout.css';
import { WrittenQuestionPanel } from './WrittenQuestionPanel';

type WrittenQuestionsOverlayProps = {
  isOpen: boolean;
  questionsByCandidate: Readonly<
    Record<string, ComponentProps<typeof WrittenQuestionPanel>['questions']>
  >;
  candidates: readonly Candidate[];
  remainingSeconds: number;
  onClose: () => void;
};

/**
 * 면접관이 대기실에서 보는 작성한 질문지. 면접자별 서류와 2부 질문을 읽기만 한다.
 * 로비에서 저장했거나 UT에 미리 준비한 질문을 보여준다.
 */
export function WrittenQuestionsOverlay({
  isOpen,
  questionsByCandidate,
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
      <WrittenQuestions
        questionsByCandidate={questionsByCandidate}
        candidates={candidates}
      />
    </DocumentOverlay>
  );
}

/** 열 때마다 첫 면접자부터 보여주도록 오버레이가 열려 있을 때만 그린다. */
function WrittenQuestions({
  questionsByCandidate,
  candidates,
}: Pick<WrittenQuestionsOverlayProps, 'questionsByCandidate' | 'candidates'>) {
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
            questions={questionsByCandidate[candidate.id] ?? []}
          />
        </div>
      )}
    </div>
  );
}
