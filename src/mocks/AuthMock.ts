import { saveAuthSession, useAuthStore } from '@/stores/AuthStore';
import type { AuthDataSource, AuthResult } from '@/types/Auth';
import { passwordPattern } from '@/utils/AuthPassword';

const accountPrefix = 'moing:mock:account:v1:';
const resetLifetime = 15 * 60 * 1000;
const encoder = new TextEncoder();

async function passwordVerifier(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: encoder.encode(salt),
      iterations: 600_000,
    },
    key,
    256,
  );
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

function readAccount(key: string) {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;
  const record: unknown = JSON.parse(raw);
  if (
    !record ||
    typeof record !== 'object' ||
    !('salt' in record) ||
    typeof record.salt !== 'string' ||
    !('verifier' in record) ||
    typeof record.verifier !== 'string'
  ) {
    throw new Error('mock 계정 데이터를 읽을 수 없어요.');
  }
  return {
    salt: record.salt,
    verifier: record.verifier,
    resetId:
      'resetId' in record && typeof record.resetId === 'string'
        ? record.resetId
        : null,
    resetExpiresAt:
      'resetExpiresAt' in record && typeof record.resetExpiresAt === 'number'
        ? record.resetExpiresAt
        : 0,
  };
}

export const authMock: AuthDataSource = {
  async signup({ email, password }, signal) {
    const address = email.trim().toLowerCase();
    const accountKey = accountPrefix + address;
    // 같은 이메일로 여러 탭에서 가입해도 먼저 만든 계정의 비밀번호를 보존한다.
    return navigator.locks.request(
      accountKey,
      { signal },
      async (): Promise<AuthResult> => {
        if (localStorage.getItem(accountKey) !== null) return 'duplicate-email';
        const salt = crypto.randomUUID();
        const verifier = await passwordVerifier(password, salt);
        signal?.throwIfAborted();
        localStorage.setItem(accountKey, JSON.stringify({ salt, verifier }));
        try {
          saveAuthSession({ email: address, resetTicket: null });
        } catch (error) {
          localStorage.removeItem(accountKey);
          throw error;
        }
        return 'success';
      },
    );
  },
  async login({ email, password }, signal) {
    const address = email.trim().toLowerCase();
    const accountKey = accountPrefix + address;
    const account = readAccount(accountKey);
    if (!account) return 'invalid-credentials';
    if ((await passwordVerifier(password, account.salt)) !== account.verifier) {
      return 'invalid-credentials';
    }
    signal?.throwIfAborted();
    if (readAccount(accountKey)?.salt !== account.salt)
      return 'invalid-credentials';
    saveAuthSession({ email: address, resetTicket: null });
    return 'success';
  },
  async requestPasswordReset(email, signal) {
    const address = email.trim().toLowerCase();
    const key = accountPrefix + address;
    return navigator.locks.request(key, { signal }, () => {
      const account = readAccount(key);
      if (!account) {
        saveAuthSession({ resetTicket: null });
        return false;
      }
      const ticket = {
        email: address,
        id: crypto.randomUUID(),
        expiresAt: Date.now() + resetLifetime,
      };
      localStorage.setItem(
        key,
        JSON.stringify({
          ...account,
          resetId: ticket.id,
          resetExpiresAt: ticket.expiresAt,
        }),
      );
      try {
        saveAuthSession({ resetTicket: ticket });
      } catch (error) {
        localStorage.setItem(key, JSON.stringify(account));
        throw error;
      }
      return true;
    });
  },
  async resetPassword(ticket, password, signal) {
    if (!passwordPattern.test(password)) return 'invalid-password';
    const key = accountPrefix + ticket.email;
    return navigator.locks.request(key, { signal }, async () => {
      const account = readAccount(key);
      if (
        !account ||
        account.resetId !== ticket.id ||
        account.resetExpiresAt <= Date.now()
      )
        return 'invalid-link' as const;
      const salt = crypto.randomUUID();
      const verifier = await passwordVerifier(password, salt);
      signal?.throwIfAborted();
      if (account.resetExpiresAt <= Date.now()) return 'invalid-link' as const;
      localStorage.setItem(key, JSON.stringify({ salt, verifier }));
      try {
        const session = useAuthStore.getState();
        saveAuthSession({
          email: session.email === ticket.email ? null : session.email,
          resetTicket: null,
        });
      } catch (error) {
        localStorage.setItem(key, JSON.stringify(account));
        throw error;
      }
      return 'success' as const;
    });
  },
  currentEmail: () => useAuthStore.getState().email,
  logout() {
    saveAuthSession({ email: null, resetTicket: null });
  },
};
