import type { QuestionDraft } from '@/types/question-sheet/questionDraft';

export const maxQuestions = 3;
export const intentMaxLength = 50;
export const answerGuideMaxLength = 100;

export function isBlankQuestion({ text, intent, answerGuide }: QuestionDraft) {
  return !text.trim() && !intent.trim() && !answerGuide.trim();
}

export function isFinishedQuestion({
  text,
  intent,
  answerGuide,
}: QuestionDraft) {
  return (
    text.trim().length > 0 &&
    intent.length <= intentMaxLength &&
    answerGuide.length <= answerGuideMaxLength
  );
}

export function hasUnfinishedQuestion(
  questionsByCandidate: Record<string, readonly QuestionDraft[]>,
) {
  return Object.values(questionsByCandidate).some((questions) =>
    questions.some(
      (question) => !isBlankQuestion(question) && !isFinishedQuestion(question),
    ),
  );
}
