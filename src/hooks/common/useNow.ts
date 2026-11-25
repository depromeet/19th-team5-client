import { useEffect, useState } from 'react';

/** 1초마다 갱신되는 현재 시각(ms). enabled가 false면 멈춘다. */
export function useNow(enabled = true) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    if (!enabled) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [enabled]);

  return now;
}
