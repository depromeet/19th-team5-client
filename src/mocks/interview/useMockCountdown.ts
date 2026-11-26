import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { useCountdown } from '@/hooks/common/useCountdown';
import type { InterviewRole } from '@/types/interview/interview';
import { mockCountdowns } from './interview';

const mockClockStarts = new Map<string, number>();
const waitingClockKey = 'moing:mock:waiting-clock:v1';

function getMockClockStart(key: string) {
  const startedAt = mockClockStarts.get(key);
  if (startedAt !== undefined) return startedAt;
  const now = Date.now();
  mockClockStarts.set(key, now);
  return now;
}

/**
 * 프로토타입용 가짜 시계. 같은 key는 처음 본 시각부터 이어서 줄어들어
 * 로비의 단계 전환에 사용한다.
 */
export function useMockCountdown(key: string, totalSeconds: number) {
  return useCountdown(totalSeconds, getMockClockStart(key));
}

function restoreWaitingClock(entry: string) {
  try {
    const value = sessionStorage.getItem(waitingClockKey);
    const prefix = `${entry}:`;
    if (value?.startsWith(prefix)) {
      const startedAt = Number(value.slice(prefix.length));
      if (Number.isFinite(startedAt) && startedAt > 0) return startedAt;
    }
  } catch {
    // 저장소 접근이 제한돼도 현재 방문의 시간은 사용할 수 있다.
  }
}

export function clearMockWaitingClock() {
  try {
    sessionStorage.removeItem(waitingClockKey);
  } catch {
    // 저장소 접근이 제한된 탭에는 지울 시계가 없다.
  }
}

export function useMockWaitingCountdown(
  interviewId: string,
  role: InterviewRole,
) {
  const { key, state } = useLocation();
  const entry = JSON.stringify([key, interviewId, role]);
  const fromLobby = state?.fromDemoLobby === true;
  const startedAt = useMemo(
    () =>
      restoreWaitingClock(entry) ??
      (fromLobby ? getMockClockStart('until-start') : Date.now()),
    [entry, fromLobby],
  );

  useEffect(() => {
    try {
      sessionStorage.setItem(waitingClockKey, `${entry}:${startedAt}`);
    } catch {
      // 탭 저장소를 사용할 수 없으면 새로고침 시 복원만 생략한다.
    }
  }, [entry, startedAt]);

  return useCountdown(mockCountdowns.untilStart, startedAt);
}
