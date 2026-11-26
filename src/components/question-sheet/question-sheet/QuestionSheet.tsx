import { useId, useState } from 'react';
import { Button, Dialog, Radio, Timer } from '@/components/common';
import {
  isBlankQuestion,
  isFinishedQuestion,
  useQuestionSheetStore,
} from '@/stores/question-sheet/questionSheetStore';
import { visuallyHidden } from '@/styles/a11y.css';
import type { Candidate } from '@/types/question-sheet/candidate';
import { QuestionPanel } from './QuestionPanel';
import * as styles from './questionSheet.css';
import { ResumePanel } from './ResumePanel';

export type QuestionSheetProps = {
  interviewId: string;
  candidates: readonly Candidate[];
  titleId?: string;
  timerLabel: string;
  remainingSeconds: number;
  /** 보조 버튼 문구. 예) 저장하고 로비로 */
  exitLabel: string;
  /** 준비를 끝낼 때 보여줄 안내. 예) 대기실 입장 전까지 언제든 다시 고칠 수 있어요 */
  finishDescription: string;
  /** 저장을 마치고 화면을 떠날 때 부른다. */
  onExit: () => void;
};

/**
 * 면접관의 2부 질문지. 로비와 대기실에서 QuestionSheetOverlay로 띄운다.
 * 질문은 입력할 때마다 저장되고, 나갈 때 조건을 못 채운 질문만 확인 후 지운다.
 */
export function QuestionSheet({
  interviewId,
  candidates,
  titleId,
  timerLabel,
  remainingSeconds,
  exitLabel,
  finishDescription,
  onExit,
}: QuestionSheetProps) {
  const candidateGroupName = useId();
  const [candidateId, setCandidateId] = useState(candidates[0]?.id ?? '');
  const [dialog, setDialog] = useState<'finish' | 'unsaved' | null>(null);
  const interviewSheets = useQuestionSheetStore(
    (state) => state.sheets[interviewId],
  );
  const removeUnfinished = useQuestionSheetStore(
    (state) => state.removeUnfinished,
  );
  const candidate = candidates.find(({ id }) => id === candidateId);

  const hasUnsavedQuestion = Object.values(interviewSheets ?? {})
    .flat()
    .some(
      (question) => !isBlankQuestion(question) && !isFinishedQuestion(question),
    );

  function exit() {
    removeUnfinished(interviewId);
    setDialog(null);
    onExit();
  }

  function requestSaveExit() {
    if (hasUnsavedQuestion) setDialog('unsaved');
    else exit();
  }

  function requestFinish() {
    if (hasUnsavedQuestion) {
      setDialog('unsaved');
      return;
    }
    removeUnfinished(interviewId);
    setDialog('finish');
  }

  return (
    <div className={styles.sheet}>
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          면접 준비해볼까요?
        </h2>
        <div className={styles.timerGroup}>
          {timerLabel}
          <Timer tone='default' seconds={remainingSeconds} />
        </div>
      </div>
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
            <QuestionPanel
              key={candidate.id}
              interviewId={interviewId}
              candidateId={candidate.id}
              exitLabel={exitLabel}
              onSaveExit={requestSaveExit}
              onFinish={requestFinish}
            />
          </div>
        )}
      </div>

      <Dialog
        isOpen={dialog === 'finish'}
        closedby='closerequest'
        onCancel={() => setDialog(null)}
      >
        <Dialog.Header className={styles.centeredText}>
          면접 준비 끝! 이제 기다리기만 하면 돼요
        </Dialog.Header>
        <Dialog.Description className={styles.centeredText}>
          {finishDescription}
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            variant='secondary'
            size='large'
            display='block'
            onClick={() => setDialog(null)}
          >
            더 수정하기
          </Button>
          <Button size='large' display='block' onClick={exit}>
            저장하고 나가기
          </Button>
        </Dialog.Footer>
      </Dialog>

      <Dialog
        isOpen={dialog === 'unsaved'}
        closedby='closerequest'
        onCancel={() => setDialog(null)}
      >
        <Dialog.Header className={styles.centeredText}>
          작성 중인 질문이 있어요
        </Dialog.Header>
        <Dialog.Description className={styles.centeredText}>
          지금 나가면 저장하지 않은 내용이 사라져요
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            variant='secondary'
            size='large'
            display='block'
            onClick={() => setDialog(null)}
          >
            취소
          </Button>
          <Button variant='danger' size='large' display='block' onClick={exit}>
            나가기
          </Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}
