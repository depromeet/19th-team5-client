import {
  mergeResumeDraft,
  type ResumeDraftChange,
} from '@/utils/signup/mergeResumeDraft';
import type { ResumeStore } from './resumeStore';
import { readSignupProgress, updateSignupProgress } from './signupStorage';

export function subscribeToResumeDraft(
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
