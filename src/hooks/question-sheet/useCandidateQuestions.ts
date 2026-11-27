import { useQuestionSheetStore } from '@/stores/question-sheet/questionSheetStore';
import type { QuestionDraft } from '@/types/question-sheet/questionDraft';

const emptyQuestions: readonly QuestionDraft[] = [];

export function useCandidateQuestions(
  interviewId: string,
  candidateId: string,
) {
  return useQuestionSheetStore(
    (state) => state.sheets[interviewId]?.[candidateId] ?? emptyQuestions,
  );
}
