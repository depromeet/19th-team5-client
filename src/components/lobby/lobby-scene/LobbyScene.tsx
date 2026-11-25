import { useEffect, useEffectEvent } from 'react';
import { ScenePlaceholder } from '@/components/space';

export type LobbyInteractable = 'kiosk';

type LobbySceneProps = {
  /** 내 아바타가 상호작용 범위에 들어오거나 나갈 때 알린다. */
  onNearbyChange: (target: LobbyInteractable | null) => void;
};

/**
 * 3D 로비 자리. 지금은 내 아바타가 예약 키오스크 앞에 서 있다고 보고 'kiosk'를 알린다.
 * React Three Fiber 씬으로 바꿀 때도 같은 props를 유지하면 LobbyPage는 그대로 쓴다.
 */
export function LobbyScene({ onNearbyChange }: LobbySceneProps) {
  const notifyNearby = useEffectEvent(onNearbyChange);

  useEffect(() => {
    notifyNearby('kiosk');
    return () => notifyNearby(null);
  }, []);

  return <ScenePlaceholder label='3D 로비 (비워 둠)' />;
}
