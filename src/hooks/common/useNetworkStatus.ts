import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

/**
 * 프로토타입에는 대기실 서버 연결이 없어서 브라우저의 온라인 상태로 연결 끊김을 흉내 낸다.
 * 실시간 연결이 생기면 그 연결 상태로 바꾼다.
 */
export function useNetworkStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
