import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  QuestionDraft,
  QuestionPatch,
} from '@/types/question-sheet/questionDraft';
import {
  isFinishedQuestion,
  maxQuestions,
} from '@/utils/question-sheet/questionDraft';

/** 면접 하나에 면접자별 질문 목록을 둔다. */
type QuestionSheets = Record<string, Record<string, QuestionDraft[]>>;

type QuestionSheetState = {
  sheets: QuestionSheets;
  addQuestion: (interviewId: string, candidateId: string) => string | null;
  updateQuestion: (
    interviewId: string,
    candidateId: string,
    questionId: string,
    patch: QuestionPatch,
  ) => void;
  removeQuestion: (
    interviewId: string,
    candidateId: string,
    questionId: string,
  ) => void;
  /** 비어 있거나 조건을 못 채운 질문을 지운다. 나가기 전에 부른다. */
  removeUnfinished: (interviewId: string) => void;
};

function updateSheet(
  sheets: QuestionSheets,
  interviewId: string,
  candidateId: string,
  update: (questions: QuestionDraft[]) => QuestionDraft[],
): QuestionSheets {
  const interview = sheets[interviewId] ?? {};
  return {
    ...sheets,
    [interviewId]: {
      ...interview,
      [candidateId]: update(interview[candidateId] ?? []),
    },
  };
}

/**
 * 면접관이 작성하는 2부 질문지. 입력할 때마다 sessionStorage에 자동 저장해
 * 로비에서 쓰던 질문을 대기실에서 그대로 불러온다. API가 생기면 저장 위치만 바꾼다.
 */
export const useQuestionSheetStore = create<QuestionSheetState>()(
  persist(
    (set, get) => ({
      sheets: {},
      addQuestion: (interviewId, candidateId) => {
        const questions = get().sheets[interviewId]?.[candidateId] ?? [];
        if (questions.length >= maxQuestions) return null;
        const id = crypto.randomUUID();
        set(({ sheets }) => ({
          sheets: updateSheet(sheets, interviewId, candidateId, (list) => [
            ...list,
            { id, text: '', intent: '', answerGuide: '' },
          ]),
        }));
        return id;
      },
      updateQuestion: (interviewId, candidateId, questionId, patch) =>
        set(({ sheets }) => ({
          sheets: updateSheet(sheets, interviewId, candidateId, (list) =>
            list.map((question) =>
              question.id === questionId ? { ...question, ...patch } : question,
            ),
          ),
        })),
      removeQuestion: (interviewId, candidateId, questionId) =>
        set(({ sheets }) => ({
          sheets: updateSheet(sheets, interviewId, candidateId, (list) =>
            list.filter((question) => question.id !== questionId),
          ),
        })),
      removeUnfinished: (interviewId) =>
        set(({ sheets }) => {
          const interview = sheets[interviewId] ?? {};
          return {
            sheets: {
              ...sheets,
              [interviewId]: Object.fromEntries(
                Object.entries(interview).map(([candidateId, questions]) => [
                  candidateId,
                  questions.filter(isFinishedQuestion),
                ]),
              ),
            },
          };
        }),
    }),
    {
      name: 'moing:question-sheets',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ sheets }) => ({ sheets }),
    },
  ),
);
