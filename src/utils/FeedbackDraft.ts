import type {
  FeedbackDraft,
  InterviewFeedback,
  KeywordOption,
} from '@/types/Interview';

export function emptyFeedback(): FeedbackDraft {
  return { strengths: [], improvements: [], comment: '' };
}

export function hasValidFeedbackKeywords(
  selected: string[],
  options: KeywordOption[],
) {
  return (
    selected.length > 0 &&
    selected.every((value) =>
      options.some(
        (option) =>
          option.value === value &&
          (!option.exclusive || selected.length === 1),
      ),
    )
  );
}

export function toggleFeedbackKeyword(
  selected: string[],
  option: KeywordOption,
  options: KeywordOption[],
) {
  if (selected.includes(option.value)) {
    return selected.filter((value) => value !== option.value);
  }
  if (option.exclusive) return [option.value];
  return [
    ...selected.filter((value) =>
      options.some((item) => item.value === value && !item.exclusive),
    ),
    option.value,
  ];
}

export function findPendingCandidate(sheet: InterviewFeedback) {
  return sheet.candidates.find(({ id }) => !sheet.submittedIds.includes(id));
}

export function mergeFeedbackDrafts(
  sheet: InterviewFeedback,
  edits: Record<string, FeedbackDraft>,
) {
  const drafts = { ...sheet.drafts };
  for (const { id } of sheet.candidates) {
    if (!sheet.submittedIds.includes(id) && Object.hasOwn(edits, id)) {
      drafts[id] = edits[id];
    }
  }
  return drafts;
}
