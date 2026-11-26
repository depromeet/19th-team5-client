import { useEffect, useRef, useState } from 'react';
import type { AvatarDraft } from '@/pages/signup/AvatarDraft';
import type { createResumeStore } from '@/stores/ResumeStore';
import {
  mergeResumeDraft,
  type ResumeDraftChange,
} from '@/stores/signup/mergeResumeDraft';
import {
  readSignupProgress,
  updateSignupProgress,
} from '@/stores/signup/signupStorage';

type ResumeStore = ReturnType<typeof createResumeStore>;

function subscribeToResumeDraft(
  email: string,
  resume: ResumeStore,
  onError: (failed: boolean) => void,
) {
  const changes: ResumeDraftChange[] = [];
  let writing: Promise<void> | undefined;
  let reading: Promise<boolean> | undefined;
  let revision = 0;
  let restoring = false;
  let active = true;

  async function persistChanges() {
    while (changes.length) {
      const batch = changes.slice();
      await updateSignupProgress(email, (stored) => ({
        draft: batch.reduce(mergeResumeDraft, stored.draft ?? batch[0].before),
      }));
      changes.splice(0, batch.length);
    }
  }

  function flush() {
    writing ??= persistChanges().finally(() => {
      writing = undefined;
    });
    return writing;
  }

  async function restoreLatest() {
    await flush();
    const requestedRevision = revision;
    const { draft } = await readSignupProgress(email);
    if (!active || changes.length || revision !== requestedRevision)
      return false;
    if (draft) {
      restoring = true;
      resume.setState({ draft });
      restoring = false;
    }
    return true;
  }

  function sync() {
    reading ??= restoreLatest().finally(() => {
      reading = undefined;
    });
    return reading;
  }

  function report(failed: boolean) {
    if (active) onError(failed);
  }

  const onFocus = () => {
    void sync().then(
      (restored) => {
        if (restored) report(false);
      },
      () => report(true),
    );
  };
  window.addEventListener('focus', onFocus);
  const unsubscribe = resume.subscribe(({ draft }, previous) => {
    if (restoring || draft === previous.draft) return;
    changes.push({ before: previous.draft, after: draft });
    const writeRevision = ++revision;
    void flush().then(
      () => {
        if (writeRevision === revision) report(false);
      },
      () => {
        if (writeRevision === revision) report(true);
      },
    );
  });

  return {
    sync,
    dispose: () => {
      active = false;
      unsubscribe();
      window.removeEventListener('focus', onFocus);
    },
  };
}

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
