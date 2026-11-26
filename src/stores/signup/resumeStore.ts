import { createStore, type StoreApi } from 'zustand/vanilla';
import type { ResumeSubmission, SignupOptions } from '@/types/Signup';
import {
  type Answer,
  createResumeDraft,
  type Entry,
  type Experience,
  getResumeLimitError,
  getSubmittableEntry,
  type ResumeDraft,
  type ResumeEntryUpdate,
  sameAttachment,
  validAnswer,
  validateAttachments,
  validExperience,
} from '@/utils/signup/resumeDraft';

export type ResumeState = {
  draft: ResumeDraft;
  pendingFiles: number;
  setCareer: (careerId: string) => void;
  setExperiences: (update: ResumeEntryUpdate<Experience>) => void;
  setAnswers: (update: ResumeEntryUpdate<Answer>) => void;
  beginAttachments: (files: File[]) => { started: boolean; error: string };
  finishAttachment: (file?: File) => void;
  clearPendingAttachments: () => void;
  removeAttachment: (file: File) => void;
  prepareRegistration: () => {
    submission: ResumeSubmission;
    commit: () => void;
  } | null;
};
export type ResumeStore = StoreApi<ResumeState>;

function submittableEntries<T>(rows: Entry<T>[], valid: (value: T) => boolean) {
  return rows.flatMap((row) => {
    const value = getSubmittableEntry(row, valid);
    return value === null ? [] : [{ row, value }];
  });
}

function getRegistration({ draft, pendingFiles }: ResumeState) {
  if (pendingFiles) return null;
  const experiences = submittableEntries(draft.experiences, validExperience);
  const answers = submittableEntries(draft.answers, validAnswer);
  if (
    getResumeLimitError(
      draft,
      answers.map(({ value }) => value),
    )
  )
    return null;
  if (
    !draft.hasSelectedCareer &&
    !experiences.length &&
    !answers.length &&
    !draft.files.length
  )
    return null;
  return { experiences, answers };
}

export function canRegisterResume(state: ResumeState) {
  return getRegistration(state) !== null;
}

function saveRegisteredEntries<T>(
  entries: Entry<T>[],
  registered: { row: Entry<T>; value: T }[],
) {
  const submittedDrafts = new Set(
    registered.flatMap(({ row, value }) => (value === row.draft ? [row] : [])),
  );
  return entries.map((row) =>
    submittedDrafts.has(row)
      ? { ...row, saved: row.draft, editing: false }
      : row,
  );
}

export function createResumeStore(
  options: SignupOptions,
  initialDraft?: ResumeDraft,
) {
  return createStore<ResumeState>()((set, get) => ({
    draft: initialDraft ?? createResumeDraft(options),
    pendingFiles: 0,
    setCareer: (careerId) =>
      set(({ draft }) => ({
        draft: { ...draft, careerId, hasSelectedCareer: true },
      })),
    setExperiences: (update) =>
      set(({ draft }) => ({
        draft: { ...draft, experiences: update(draft.experiences) },
      })),
    setAnswers: (update) =>
      set(({ draft }) => ({
        draft: { ...draft, answers: update(draft.answers) },
      })),
    beginAttachments: (files) => {
      const state = get();
      if (!files.length || state.pendingFiles)
        return { started: false, error: '' };
      const error = validateAttachments(state.draft.files, files);
      if (error) return { started: false, error };
      set({ pendingFiles: files.length });
      return { started: true, error: '' };
    },
    finishAttachment: (file) =>
      set((state) => {
        if (!state.pendingFiles) return state;
        return {
          pendingFiles: state.pendingFiles - 1,
          draft: file
            ? { ...state.draft, files: [...state.draft.files, file] }
            : state.draft,
        };
      }),
    clearPendingAttachments: () => set({ pendingFiles: 0 }),
    removeAttachment: (file) =>
      set(({ draft }) => ({
        draft: {
          ...draft,
          files: draft.files.filter((item) => !sameAttachment(item, file)),
        },
      })),
    prepareRegistration: () => {
      const state = get();
      const registration = getRegistration(state);
      if (!registration) return null;
      return {
        submission: {
          careerId: state.draft.careerId,
          experiences: registration.experiences.map(({ value }) => value),
          answers: registration.answers.map(({ value }) => value),
          files: state.draft.files,
        },
        commit: () => {
          set((current) => {
            if (current.draft !== state.draft) return current;
            return {
              draft: {
                ...state.draft,
                experiences: saveRegisteredEntries(
                  state.draft.experiences,
                  registration.experiences,
                ),
                answers: saveRegisteredEntries(
                  state.draft.answers,
                  registration.answers,
                ),
              },
            };
          });
        },
      };
    },
  }));
}
