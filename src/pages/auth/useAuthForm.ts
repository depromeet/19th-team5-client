import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { signupPaths } from '@/constants/common/paths';
import { demoWaitingRoomPath } from '@/mocks/interview/interview';
import type { AuthOperation } from '@/types/Auth';

const messages = {
  'duplicate-email': '이미 가입한 이메일이에요. 로그인해 주세요.',
  'invalid-credentials': '이메일 또는 비밀번호를 확인해 주세요.',
  unavailable: '계정 정보를 처리하지 못했어요. 다시 시도해 주세요.',
};

export function useAuthForm(submit: AuthOperation, mode: 'login' | 'signup') {
  const navigate = useNavigate();
  const { search, hash, state } = useLocation();
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<keyof typeof messages | null>(null);
  const active = useRef<AbortController | null>(null);
  useEffect(() => () => active.current?.abort(), []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (active.current) return;
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    if (typeof email !== 'string' || typeof password !== 'string') return;
    const request = new AbortController();
    active.current = request;
    setPending(true);
    setFailure(null);
    try {
      const result = await submit({ email, password }, request.signal);
      if (request.signal.aborted) return;
      if (result === 'success') {
        if (mode === 'login')
          navigate(demoWaitingRoomPath, { replace: true, state });
        else
          navigate({ pathname: signupPaths.avatar, search, hash }, { state });
      } else {
        setFailure(result);
      }
    } catch {
      if (!request.signal.aborted) setFailure('unavailable');
    } finally {
      active.current = null;
      if (!request.signal.aborted) setPending(false);
    }
  }
  return { onSubmit, pending, failure, error: failure && messages[failure] };
}
