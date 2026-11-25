import { secondsBetween } from '@/utils/time';
import { useNow } from './useNow';

/** startedAt부터 totalSeconds를 센 남은 시간(초). 0 아래로 내려가지 않는다. */
export function useCountdown(totalSeconds: number, startedAt: number) {
  const now = useNow();
  return Math.max(0, totalSeconds - secondsBetween(startedAt, now));
}
