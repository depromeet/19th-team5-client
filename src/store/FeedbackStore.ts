import { createStore } from 'zustand/vanilla';
import type { FeedbackDraft } from '@/types/Interview';

type FeedbackState = {
  drafts: Record<string, FeedbackDraft>;
  activeId: string | undefined;
  attemptedIds: ReadonlySet<string>;
  seconds: number;
  selectCandidate: (id: string) => void;
  editDraft: (id: string, draft: FeedbackDraft) => void;
  markAttempted: (id: string) => void;
  setSeconds: (seconds: number) => void;
};

export function createFeedbackStore(
  drafts: Record<string, FeedbackDraft>,
  seconds: number,
) {
  return createStore<FeedbackState>()((set) => ({
    drafts,
    activeId: undefined,
    attemptedIds: new Set(),
    seconds,
    selectCandidate: (activeId) => set({ activeId }),
    editDraft: (id, draft) =>
      set(({ drafts }) => ({ drafts: { ...drafts, [id]: draft } })),
    markAttempted: (id) =>
      set(({ attemptedIds }) => ({
        attemptedIds: new Set([...attemptedIds, id]),
      })),
    setSeconds: (seconds) =>
      set((state) => (state.seconds === seconds ? state : { seconds })),
  }));
}
export type FeedbackStore = ReturnType<typeof createFeedbackStore>;
