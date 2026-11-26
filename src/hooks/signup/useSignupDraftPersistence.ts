import { useEffect, useRef, useState } from 'react';
import type { AvatarDraft } from '@/pages/signup/AvatarDraft';
import type { createResumeStore } from '@/stores/ResumeStore';
import { updateSignupProgress } from '@/stores/signup/signupStorage';

export function useSignupDraftPersistence(
  email: string,
  avatar: AvatarDraft,
  resume: ReturnType<typeof createResumeStore>,
) {
  const lastAvatar = useRef(avatar);
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

  useEffect(
    () =>
      resume.subscribe(({ draft }, previous) => {
        if (draft === previous.draft) return;
        void updateSignupProgress(email, { draft }).then(
          () => setResumeError(false),
          () => setResumeError(true),
        );
      }),
    [email, resume],
  );

  return avatarError || resumeError;
}
