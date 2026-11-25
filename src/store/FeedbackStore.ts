import { createStore } from 'zustand/vanilla';
import type { FeedbackDraft } from '@/types/Interview';

type FeedbackState = {
  edits: Record<string, FeedbackDraft>;
  activeId: string | undefined;
  attemptedIds: ReadonlySet<string>;
  seconds: number;
  selectCandidate: (id: string) => void;
  editDraft: (id: string, draft: FeedbackDraft) => void;
  markAttempted: (id: string) => void;
  clearEdits: () => void;
  setSeconds: (seconds: number) => void;
};

export function createFeedbackStore(seconds: number) {
  return createStore<FeedbackState>()((set) => ({
    edits: {},
    activeId: undefined,
    attemptedIds: new Set(),
    seconds,
    selectCandidate: (activeId) => set({ activeId }),
    editDraft: (id, draft) =>
      set(({ edits }) => ({ edits: { ...edits, [id]: draft } })),
    markAttempted: (id) =>
      set(({ attemptedIds }) => ({
        attemptedIds: new Set([...attemptedIds, id]),
      })),
    clearEdits: () => set({ edits: {} }),
    setSeconds: (seconds) =>
      set((state) => (state.seconds === seconds ? state : { seconds })),
  }));
}
export type FeedbackStore = ReturnType<typeof createFeedbackStore>;
