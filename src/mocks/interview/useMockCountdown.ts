import { useCountdown } from '@/hooks/common/useCountdown';

const mockClockStarts = new Map<string, number>();

function getMockClockStart(key: string) {
  const startedAt = mockClockStarts.get(key);
  if (startedAt !== undefined) return startedAt;
  const now = Date.now();
  mockClockStarts.set(key, now);
  return now;
}

/**
 * 프로토타입용 가짜 시계. 같은 key는 처음 본 시각부터 이어서 줄어들어
 * 로비와 대기실을 옮겨 다녀도 남은 시간이 이어진다. 새로고침하면 처음부터 다시 센다.
 */
export function useMockCountdown(key: string, totalSeconds: number) {
  return useCountdown(totalSeconds, getMockClockStart(key));
}
