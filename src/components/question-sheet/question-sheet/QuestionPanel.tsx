import { IconTrashcanLine } from '@karrotmarket/react-monochrome-icon';
import { type RefObject, useEffect, useId, useRef, useState } from 'react';
import { AddButton, Button, Tag, TextArea } from '@/components/common';
import { largeTag } from '@/components/interview/largeTag.css';
import { useCandidateQuestions } from '@/hooks/question-sheet/useCandidateQuestions';
import { useQuestionSheetStore } from '@/stores/question-sheet/questionSheetStore';
import type {
  QuestionDraft,
  QuestionPatch,
} from '@/types/question-sheet/questionDraft';
import {
  answerGuideMaxLength,
  intentMaxLength,
  isBlankQuestion,
  maxQuestions,
} from '@/utils/question-sheet/questionDraft';
import * as styles from './questionPanel.css';

type QuestionPanelProps = {
  interviewId: string;
  candidateId: string;
  exitLabel: string;
  onSaveExit: () => void;
  onFinish: () => void;
};

type QuestionItemProps = {
  number: number;
  question: QuestionDraft;
  onRemove: () => void;
};

type QuestionSummaryProps = QuestionItemProps & { onExpand: () => void };

type QuestionEditorProps = QuestionItemProps & {
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (patch: QuestionPatch) => void;
};

/** 2부에서 물어볼 질문 작성. 한 번에 질문 하나만 펼쳐서 고친다. */
export function QuestionPanel({
  interviewId,
  candidateId,
  exitLabel,
  onSaveExit,
  onFinish,
}: QuestionPanelProps) {
  const headingId = useId();
  const questionInputRef = useRef<HTMLInputElement>(null);
  const questions = useCandidateQuestions(interviewId, candidateId);
  const addQuestion = useQuestionSheetStore((state) => state.addQuestion);
  const updateQuestion = useQuestionSheetStore((state) => state.updateQuestion);
  const removeQuestion = useQuestionSheetStore((state) => state.removeQuestion);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const expandedQuestion = questions.find(({ id }) => id === expandedId);
  const isEmpty = questions.length === 0;
  const isFull = questions.length >= maxQuestions;

  function expand(questionId: string) {
    // 아무것도 쓰지 않은 질문은 접을 때 지운다.
    if (expandedQuestion && isBlankQuestion(expandedQuestion)) {
      removeQuestion(interviewId, candidateId, expandedQuestion.id);
    }
    setExpandedId(questionId);
  }

  function add() {
    if (expandedQuestion && isBlankQuestion(expandedQuestion)) {
      questionInputRef.current?.focus();
      return;
    }
    const questionId = addQuestion(interviewId, candidateId);
    if (questionId) setExpandedId(questionId);
  }

  function remove(questionId: string) {
    removeQuestion(interviewId, candidateId, questionId);
    if (questionId === expandedId) setExpandedId(null);
  }

  function update(questionId: string, patch: QuestionPatch) {
    updateQuestion(interviewId, candidateId, questionId, patch);
  }

  return (
    <section className={styles.panel} aria-labelledby={headingId}>
      <div className={styles.header}>
        <h2 id={headingId} className={styles.heading}>
          2부에서 물어볼 질문
        </h2>
        <span className={styles.count}>
          {questions.length} / {maxQuestions}
        </span>
      </div>
      <div className={styles.scrollArea}>
        {!isEmpty && (
          <>
            <p className={styles.helper}>
              최대 {maxQuestions}개 · 자동 저장 · 의도와 답변 방향은 면접자
              질문카드에 저장돼요
            </p>
            <ol className={styles.list}>
              {questions.map((question, index) =>
                question.id === expandedId ? (
                  <QuestionEditor
                    key={question.id}
                    number={index + 1}
                    question={question}
                    inputRef={questionInputRef}
                    onChange={(patch) => update(question.id, patch)}
                    onRemove={() => remove(question.id)}
                  />
                ) : (
                  <QuestionSummary
                    key={question.id}
                    number={index + 1}
                    question={question}
                    onExpand={() => expand(question.id)}
                    onRemove={() => remove(question.id)}
                  />
                ),
              )}
            </ol>
          </>
        )}
        <AddButton
          className={isEmpty ? styles.emptyAddButton : undefined}
          limited={isFull}
          description={`질문은 ${maxQuestions}개까지 만들 수 있어요.`}
          onClick={add}
        >
          {isEmpty ? '+ 서류를 읽으며 질문 만들기' : '+ 질문 추가하기'}
        </AddButton>
      </div>
      <div className={styles.footer}>
        <Button variant='secondary' size='large' onClick={onSaveExit}>
          {exitLabel}
        </Button>
        {isEmpty ? (
          <Button size='large' onClick={add}>
            질문 만들기
          </Button>
        ) : (
          <Button size='large' onClick={onFinish}>
            질문 준비 끝내기
          </Button>
        )}
      </div>
    </section>
  );
}

function DeleteButton({
  number,
  onRemove,
}: Pick<QuestionItemProps, 'number' | 'onRemove'>) {
  return (
    <Button
      variant='text'
      className={styles.deleteButton}
      aria-label={`${number}번 질문 삭제`}
      onClick={onRemove}
    >
      <IconTrashcanLine size={16} aria-hidden='true' />
    </Button>
  );
}

function QuestionSummary({
  number,
  question,
  onExpand,
  onRemove,
}: QuestionSummaryProps) {
  const hasIntent = question.intent.trim().length > 0;
  const hasAnswerGuide = question.answerGuide.trim().length > 0;

  return (
    <li className={styles.collapsed}>
      <div className={styles.row}>
        <span className={styles.number}>{number}</span>
        <button
          type='button'
          className={styles.expandButton}
          aria-expanded={false}
          onClick={onExpand}
        >
          {question.text || (
            <span className={styles.emptyText}>질문을 입력해 주세요</span>
          )}
        </button>
        <DeleteButton number={number} onRemove={onRemove} />
      </div>
      {(hasIntent || hasAnswerGuide) && (
        <div className={styles.tags}>
          {hasIntent && (
            <Tag tone='gray' className={largeTag}>
              의도 ✓
            </Tag>
          )}
          {hasAnswerGuide && (
            <Tag tone='gray' className={largeTag}>
              답변 방향 ✓
            </Tag>
          )}
        </div>
      )}
    </li>
  );
}

function QuestionEditor({
  number,
  question,
  inputRef,
  onChange,
  onRemove,
}: QuestionEditorProps) {
  const inputId = useId();

  // 펼치거나 새로 만든 질문은 바로 입력할 수 있게 한다.
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <li className={styles.expanded}>
      <div className={styles.editorHeader}>
        <span className={styles.leading}>
          <span className={styles.number}>{number}</span>
          <label htmlFor={inputId} className={styles.fieldLabel}>
            질문
            <span className={styles.requiredMark} aria-hidden='true'>
              *
            </span>
          </label>
        </span>
        <DeleteButton number={number} onRemove={onRemove} />
      </div>
      <input
        id={inputId}
        ref={inputRef}
        className={styles.questionInput}
        value={question.text}
        placeholder='질문을 입력해 주세요'
        required
        onChange={(event) => onChange({ text: event.currentTarget.value })}
      />
      <TextArea
        className={styles.field}
        label='질문 의도'
        rows={1}
        value={question.intent}
        maxLength={intentMaxLength}
        placeholder='예) 가설이 틀렸을 때의 대처를 보고 싶어요'
        helperText={
          question.intent.length > intentMaxLength
            ? `${intentMaxLength}자 이내로 줄여 주세요`
            : undefined
        }
        onChange={(event) => onChange({ intent: event.currentTarget.value })}
      />
      <TextArea
        className={styles.field}
        label='모범 답변 방향'
        rows={1}
        value={question.answerGuide}
        maxLength={answerGuideMaxLength}
        placeholder='예) 원인 분석 → 다음 실험 설계 순서로 말하면 좋아요'
        helperText={
          question.answerGuide.length > answerGuideMaxLength
            ? `${answerGuideMaxLength}자 이내로 줄여 주세요`
            : undefined
        }
        onChange={(event) =>
          onChange({ answerGuide: event.currentTarget.value })
        }
      />
    </li>
  );
}
