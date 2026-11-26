import { create } from 'zustand';
import type { PasswordResetTicket } from '@/types/Auth';

type AuthSession = {
  email: string | null;
  resetTicket: PasswordResetTicket | null;
};
const storageKey = 'moing:mock:auth-session:v2';
const legacyKey = 'moing:mock:session:v1';

function isResetTicket(value: unknown): value is PasswordResetTicket {
  return (
    !!value &&
    typeof value === 'object' &&
    'email' in value &&
    typeof value.email === 'string' &&
    'id' in value &&
    typeof value.id === 'string' &&
    'expiresAt' in value &&
    typeof value.expiresAt === 'number' &&
    value.expiresAt > Date.now()
  );
}

function restoreSession(): AuthSession {
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (raw === null)
      return { email: sessionStorage.getItem(legacyKey), resetTicket: null };
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object')
      return {
        email:
          'email' in parsed && typeof parsed.email === 'string'
            ? parsed.email
            : null,
        resetTicket:
          'resetTicket' in parsed && isResetTicket(parsed.resetTicket)
            ? parsed.resetTicket
            : null,
      };
  } catch {
    // 저장소 접근이 차단된 탭에서도 로그인 화면을 열 수 있다.
  }
  return { email: null, resetTicket: null };
}

export const useAuthStore = create<AuthSession>(restoreSession);

export function saveAuthSession(update: Partial<AuthSession>) {
  const next = { ...useAuthStore.getState(), ...update };
  sessionStorage.setItem(storageKey, JSON.stringify(next));
  useAuthStore.setState(next);
  sessionStorage.removeItem(legacyKey);
}
