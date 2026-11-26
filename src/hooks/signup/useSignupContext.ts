import type { Dispatch, SetStateAction } from 'react';
import { useOutletContext } from 'react-router';
import { useStore } from 'zustand';
import type { ResumeState, ResumeStore } from '@/stores/signup/resumeStore';
import type { IssuedPass, SignupOptions } from '@/types/Signup';
import type { AvatarDraft } from '@/utils/signup/avatarDraft';

export type SignupContext = {
  avatar: [AvatarDraft, Dispatch<SetStateAction<AvatarDraft>>];
  resume: ResumeStore;
  syncResumeDraft: () => Promise<void>;
  options: SignupOptions;
  pass?: IssuedPass;
};

export function useSignupContext() {
  return useOutletContext<SignupContext>();
}

export function useResumeStore<T>(select: (state: ResumeState) => T) {
  return useStore(useSignupContext().resume, select);
}
