import { useEffect, useRef, useState } from 'react';
import { subscribeToResumeDraft } from '@/stores/signup/resumeDraftPersistence';
import type { ResumeStore } from '@/stores/signup/resumeStore';
import { updateSignupProgress } from '@/stores/signup/signupStorage';
import type { AvatarDraft } from '@/utils/signup/avatarDraft';

export function useSignupDraftPersistence(
  email: string,
  avatar: AvatarDraft,
  resume: ResumeStore,
) {
  const lastAvatar = useRef(avatar);
  const syncResume = useRef<(() => Promise<boolean>) | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [resumeError, setResumeError] = useState(false);

  useEffect(() => {
    if (lastAvatar.current === avatar) return;
    lastAvatar.current = avatar;
    let active = true;
    void updateSignupProgress(email, { avatar }).then(
      () => {
        if (active) setAvatarError(false);
      },
      () => {
        if (active) setAvatarError(true);
      },
    );
    return () => {
      active = false;
    };
  }, [avatar, email]);

  useEffect(() => {
    const { sync, dispose } = subscribeToResumeDraft(
      email,
      resume,
      setResumeError,
    );
    syncResume.current = sync;
    return () => {
      syncResume.current = null;
      dispose();
    };
  }, [email, resume]);

  async function syncResumeDraft() {
    if (!(await syncResume.current?.())) {
      throw new Error('최신 이력서를 불러오지 못했어요.');
    }
    setResumeError(false);
  }

  return { saveError: avatarError || resumeError, syncResumeDraft };
}
