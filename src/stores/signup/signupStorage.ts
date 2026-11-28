import type { IssuedPass, ResumeSubmission } from '@/types/Signup';
import type { AvatarDraft } from '@/utils/signup/avatarDraft';
import type { ResumeDraft } from '@/utils/signup/resumeDraft';

export type SignupProgress = {
  avatar?: AvatarDraft;
  draft?: ResumeDraft;
  pass?: IssuedPass;
  resume?: ResumeSubmission;
};
type StoredSignupProgress = Omit<SignupProgress, 'draft'> & {
  draft?: ResumeDraft & { hasSelectedCareer?: boolean };
};
type SignupUpdate =
  | Partial<SignupProgress>
  | ((current: SignupProgress) => Partial<SignupProgress>);

const databaseName = 'moing:mock:signup';
const storeName = 'progress';
let connection: Promise<IDBDatabase> | undefined;

function normalizeStoredProgress(
  stored: StoredSignupProgress = {},
): SignupProgress {
  if (stored.draft?.hasSelectedCareer === undefined) return stored;
  const { hasSelectedCareer, ...draft } = stored.draft;
  return {
    ...stored,
    draft: { ...draft, careerId: hasSelectedCareer ? draft.careerId : null },
  };
}

function openDatabase() {
  connection ??= new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => {
        database.close();
        connection = undefined;
      };
      resolve(database);
    };
    request.onerror = () => {
      connection = undefined;
      reject(request.error);
    };
  });
  return connection;
}

export async function readSignupProgress(email: string) {
  const database = await openDatabase();
  return new Promise<SignupProgress>((resolve, reject) => {
    const request = database
      .transaction(storeName)
      .objectStore(storeName)
      .get(email);
    request.onsuccess = () => resolve(normalizeStoredProgress(request.result));
    request.onerror = () => reject(request.error);
  });
}

export async function updateSignupProgress(
  email: string,
  update: SignupUpdate,
) {
  const database = await openDatabase();
  return new Promise<SignupProgress>((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.get(email);
    let next: SignupProgress = {};
    request.onsuccess = () => {
      const current = normalizeStoredProgress(request.result);
      const changes = typeof update === 'function' ? update(current) : update;
      next = { ...current, ...changes };
      store.put(next, email);
    };
    transaction.oncomplete = () => resolve(next);
    transaction.onabort = () => reject(transaction.error);
  });
}
