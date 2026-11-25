import { createStore } from 'zustand/vanilla';
import type { ResumeSubmission, SignupOptions } from '@/types/Signup';
import {
  createResumeDraft,
  type Entry,
  hasAnswerInput,
  hasExperienceInput,
  type ResumeDraft,
  validAnswer,
  validateAttachments,
  validExperience,
} from './ResumeDraft';

export type ResumeState = {
  draft: ResumeDraft;
  pendingFiles: number;
  setCareer: (careerId: string) => void;
  setExperiences: (experiences: ResumeDraft['experiences']) => void;
  setAnswers: (answers: ResumeDraft['answers']) => void;
  beginAttachments: (files: File[]) => { started: boolean; error: string };
  finishAttachment: (file?: File) => void;
  clearPendingAttachments: () => void;
  removeAttachment: (file: File) => void;
  prepareRegistration: () => {
    submission: ResumeSubmission;
    commit: () => void;
  } | null;
};

function getRegistration({ draft, pendingFiles }: ResumeState) {
  if (pendingFiles) return null;
  const experiences = draft.experiences.filter(hasExperienceInput);
  const answers = draft.answers.filter(hasAnswerInput);
  if (
    !experiences.length ||
    !answers.length ||
    !experiences.every((row) => validExperience(row.draft)) ||
    !answers.every((row) => validAnswer(row.draft))
  )
    return null;
  return { experiences, answers };
}

export function canRegisterResume(state: ResumeState) {
  return getRegistration(state) !== null;
}

function saveEntry<T>(row: Entry<T>): Entry<T> {
  return { ...row, saved: row.draft, editing: false };
}

export function createResumeStore(options: SignupOptions) {
  return createStore<ResumeState>()((set, get) => ({
    draft: createResumeDraft(options),
    pendingFiles: 0,
    setCareer: (careerId) =>
      set(({ draft }) => ({ draft: { ...draft, careerId } })),
    setExperiences: (experiences) =>
      set(({ draft }) => ({ draft: { ...draft, experiences } })),
    setAnswers: (answers) =>
      set(({ draft }) => ({ draft: { ...draft, answers } })),
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
        draft: { ...draft, files: draft.files.filter((item) => item !== file) },
      })),
    prepareRegistration: () => {
      const state = get();
      const registration = getRegistration(state);
      if (!registration) return null;
      return {
        submission: {
          careerId: state.draft.careerId,
          experiences: registration.experiences.map((row) => row.draft),
          answers: registration.answers.map((row) => row.draft),
          files: state.draft.files,
        },
        commit: () => {
          set((current) => {
            if (current.draft !== state.draft) return current;
            return {
              draft: {
                ...state.draft,
                experiences: registration.experiences.map(saveEntry),
                answers: registration.answers.map(saveEntry),
              },
            };
          });
        },
      };
    },
  }));
}
