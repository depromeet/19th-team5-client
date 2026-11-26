import type { AvatarDraft } from '@/pages/signup/AvatarDraft';
import type { ResumeDraft } from '@/pages/signup/resume/ResumeDraft';
import type { IssuedPass, ResumeSubmission } from '@/types/Signup';

export type SignupProgress = {
  avatar?: AvatarDraft;
  draft?: ResumeDraft;
  pass?: IssuedPass;
  resume?: ResumeSubmission;
};
type SignupUpdate =
  | Partial<SignupProgress>
  | ((current: SignupProgress) => Partial<SignupProgress>);

const databaseName = 'moing:mock:signup';
const storeName = 'progress';
let connection: Promise<IDBDatabase> | undefined;

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
    request.onsuccess = () => resolve(request.result ?? {});
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
      const current: SignupProgress = request.result ?? {};
      const changes = typeof update === 'function' ? update(current) : update;
      next = { ...current, ...changes };
      store.put(next, email);
    };
    transaction.oncomplete = () => resolve(next);
    transaction.onabort = () => reject(transaction.error);
  });
}
