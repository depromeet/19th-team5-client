import type { FeedbackDraft, InterviewFeedback } from '@/types/Interview';
import { emptyFeedback } from '@/utils/FeedbackDraft';
import { writeReviewData } from './WriteReviewData';

type WriteReviewSession = {
  deadline: number;
  feedback: Record<string, FeedbackDraft>;
};

const storageKey = 'moing:example-interview:v1';
let fallbackDeadline: number | undefined;

function restoreSession(): WriteReviewSession | undefined {
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (raw === null) return;
    // 기존 모의 세션에서 쓰던 저장 형식을 읽는다.
    const { state }: { state?: WriteReviewSession } = JSON.parse(raw);
    if (state && Number.isFinite(state.deadline)) return state;
  } catch {
    // 저장소를 읽을 수 없어도 작성 화면을 열 수 있다.
  }
}

function persistSession(state: WriteReviewSession) {
  sessionStorage.setItem(storageKey, JSON.stringify({ state, version: 0 }));
}

export function loadWriteReview(): InterviewFeedback {
  const session = restoreSession();
  const deadline =
    session?.deadline ??
    fallbackDeadline ??
    Date.now() + writeReviewData.durationMinutes * 60_000;
  fallbackDeadline = deadline;
  if (!session) {
    try {
      persistSession({ deadline, feedback: {} });
    } catch {
      // 저장소가 차단된 경우에도 현재 탭에서는 기존 마감 시각을 유지한다.
    }
  }

  return {
    ...writeReviewData,
    deadline,
    drafts: Object.fromEntries(
      writeReviewData.candidates.map(({ id }) => {
        const { strengths, improvements, comment } =
          session?.feedback?.[id] ?? emptyFeedback();
        return [id, { strengths, improvements, comment }];
      }),
    ),
  };
}

export function saveWriteReviewDrafts(
  deadline: number,
  drafts: Record<string, FeedbackDraft>,
) {
  if (Date.now() >= deadline) {
    throw new Error('피드백 작성 시간이 종료됐어요.');
  }
  persistSession({ deadline, feedback: drafts });
}
