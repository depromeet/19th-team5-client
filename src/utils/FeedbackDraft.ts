import type { FeedbackDraft, KeywordOption } from '@/types/Interview';

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
