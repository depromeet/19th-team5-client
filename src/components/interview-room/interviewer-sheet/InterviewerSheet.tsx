import { type ReactNode, useState } from 'react';
import { BottomSheet, Button } from '@/components/common';
import { interviewParts } from '@/constants/interview-room/parts';
import {
  type CandidateMemos,
  getMemoKey,
  useInterviewMemoStore,
} from '@/stores/interview-room/interviewMemoStore';
import type { Interviewee } from '@/types/interview-room/interviewee';
import type { InterviewPart } from '@/types/interview-room/interviewRoom';
import type { InterviewMemo } from '@/types/interview-room/memo';
import type { QuestionCard } from '@/types/interview-room/question';
import * as styles from './interviewerSheet.css';
import { MemoEditor } from './MemoEditor';
import { MemoHistory } from './MemoHistory';
import { QuestionPanel } from './QuestionPanel';

const noMemos: CandidateMemos = {};

function byQuestionOrder(a: InterviewMemo, b: InterviewMemo) {
  return (
    interviewParts.indexOf(a.part) - interviewParts.indexOf(b.part) ||
    a.questionNumber - b.questionNumber
  );
}

type InterviewerSheetProps = {
  interviewId: string;
  part: InterviewPart;
  interviewees: readonly Interviewee[];
  commonQuestions: readonly QuestionCard[];
  /** 면접자 id별 2부 질문 */
  customQuestions: Readonly<Record<string, readonly QuestionCard[]>>;
  /** 1·2부에 저장한 메모가 없을 때 3부에서 대신 보여줄 메모. 면접자 id별로 둔다. */
  fallbackMemos: Readonly<Record<string, readonly InterviewMemo[]>>;
  /** 질문 카드 아래쪽 가운데에 둘 하단 독 */
  dock: ReactNode;
  onSkipPart: () => void;
  onFinish: () => void;
};

/**
 * 면접관 질문 카드. 1·2부에는 질문과 의도를, 3부에는 1·2부에 남긴 메모를 보여주고
 * 오른쪽에서 면접자마다 메모를 남긴다. 면접이 진행되는 동안 열어 둔다.
 */
export function InterviewerSheet({
  interviewId,
  part,
  interviewees,
  commonQuestions,
  customQuestions,
  fallbackMemos,
  dock,
  onSkipPart,
  onFinish,
}: InterviewerSheetProps) {
  const [candidateId, setCandidateId] = useState(interviewees[0]?.id ?? '');
  // 부·면접자마다 보고 있던 질문 위치를 기억한다.
  const [questionIndexes, setQuestionIndexes] = useState<
    Record<string, number>
  >({});
  // 저장하기 전 입력을 면접자·질문마다 기억해, 탭이나 질문을 오가도 쓰던 내용이 남는다.
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const savedMemos = useInterviewMemoStore(
    (state) => state.memos[interviewId]?.[candidateId] ?? noMemos,
  );
  const saveMemo = useInterviewMemoStore((state) => state.saveMemo);

  const questions =
    part === 'common'
      ? commonQuestions
      : part === 'custom'
        ? (customQuestions[candidateId] ?? [])
        : [];
  const indexKey = `${part}:${candidateId}`;
  const questionIndex = Math.min(
    questionIndexes[indexKey] ?? 0,
    Math.max(questions.length - 1, 0),
  );
  const question = questions[questionIndex];

  const savedList = Object.values(savedMemos);
  // 3부에는 정해진 질문이 없어서, 꼬리질문마다 메모를 하나씩 이어 쓴다.
  const questionNumber =
    part === 'free'
      ? savedList.filter((memo) => memo.part === 'free').length + 1
      : questionIndex + 1;
  const memoKey = getMemoKey({ part, questionNumber });
  const draftKey = `${candidateId}:${memoKey}`;
  const savedText = savedMemos[memoKey]?.text ?? '';
  const draft = drafts[draftKey] ?? savedText;
  const canSave = candidateId !== '' && draft.trim() !== savedText;

  const writtenMemos = savedList
    .filter((memo) => memo.part !== 'free')
    .sort(byQuestionOrder);
  const historyMemos =
    writtenMemos.length > 0 ? writtenMemos : (fallbackMemos[candidateId] ?? []);

  function moveQuestion(offset: number) {
    setQuestionIndexes((indexes) => ({
      ...indexes,
      [indexKey]: questionIndex + offset,
    }));
  }

  function changeDraft(value: string) {
    setDrafts((current) => ({ ...current, [draftKey]: value }));
  }

  function save() {
    saveMemo(interviewId, candidateId, { part, questionNumber, text: draft });
    changeDraft(draft.trim());
  }

  return (
    <BottomSheet isOpen onRequestClose={keepOpen} aria-label='면접관 질문 카드'>
      <BottomSheet.Header>
        <BottomSheet.CandidateTabs
          candidates={interviewees}
          selectedId={candidateId}
          onSelect={setCandidateId}
        />
        {part === 'custom' && (
          <Button
            variant='secondary'
            className={styles.headerAction}
            onClick={onSkipPart}
          >
            2부 건너뛰기
          </Button>
        )}
        {part === 'free' && (
          <Button
            variant='danger'
            className={styles.headerAction}
            onClick={onFinish}
          >
            면접 마치기
          </Button>
        )}
      </BottomSheet.Header>
      <BottomSheet.Body
        sidebar={
          <MemoEditor
            label={`Q${questionNumber}`}
            value={draft}
            canSave={canSave}
            onChange={changeDraft}
            onSave={save}
          />
        }
      >
        <BottomSheet.Panel className={styles.panel}>
          {part === 'free' ? (
            <MemoHistory memos={historyMemos} />
          ) : question ? (
            <QuestionPanel
              question={question}
              number={questionIndex + 1}
              total={questions.length}
              labelIntent={part === 'custom'}
              onPrevious={
                questionIndex > 0 ? () => moveQuestion(-1) : undefined
              }
              onNext={
                questionIndex < questions.length - 1
                  ? () => moveQuestion(1)
                  : undefined
              }
            />
          ) : (
            <p className={styles.empty}>면접 전에 써 둔 질문이 없어요</p>
          )}
          <div className={styles.dock}>{dock}</div>
        </BottomSheet.Panel>
      </BottomSheet.Body>
    </BottomSheet>
  );
}

function keepOpen() {
  // 면접이 진행되는 동안에는 질문 카드를 닫지 않는다. Esc를 눌러도 그대로 둔다.
}
