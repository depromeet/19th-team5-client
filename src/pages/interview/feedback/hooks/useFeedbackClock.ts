import { useEffect } from 'react';
import type { FeedbackStore } from '@/store/FeedbackStore';

export function getSecondsRemaining(deadline: number) {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

export function useFeedbackClock(
  store: FeedbackStore,
  deadline: number,
  complete: boolean,
) {
  useEffect(() => {
    if (complete) return;
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
  }, [store, deadline, complete]);
}
