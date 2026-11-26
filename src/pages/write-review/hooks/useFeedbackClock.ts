import { useEffect } from 'react';
import type { FeedbackStore } from '@/store/FeedbackStore';

export function getSecondsRemaining(deadline: number) {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

/**
 * 마감 시각을 기준으로 남은 시간을 계산해 스토어에 갱신한다.
 * 타이머는 초 단위 값, 편집기는 마감 여부를 구독해 매초 폼을 다시 그리는 일을 줄인다.
 */
export function useFeedbackClock(store: FeedbackStore, deadline: number) {
  useEffect(() => {
    let timer: number | undefined;
    const { setSeconds } = store.getState();

    function tick() {
      window.clearTimeout(timer);
      const remaining = deadline - Date.now();
      setSeconds(Math.max(0, Math.ceil(remaining / 1000)));
      if (remaining > 0) {
        timer = window.setTimeout(tick, remaining % 1000 || 1000);
      }
    }

    tick();
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [store, deadline]);
}
