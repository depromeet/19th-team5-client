import { useEffect, useEffectEvent } from 'react';
import { ScenePlaceholder } from '@/components/space';

export type WaitingRoomInteractable = 'npc';

type WaitingRoomSceneProps = {
  /** 내 아바타가 상호작용 범위에 들어오거나 나갈 때 알린다. */
  onNearbyChange: (target: WaitingRoomInteractable | null) => void;
};

/**
 * 3D 대기실 자리. 지금은 내 아바타가 김대리 옆에 서 있다고 보고 'npc'를 알린다.
 * React Three Fiber 씬으로 바꿀 때도 같은 props를 유지하면 WaitingRoomPage는 그대로 쓴다.
 */
export function WaitingRoomScene({ onNearbyChange }: WaitingRoomSceneProps) {
  const notifyNearby = useEffectEvent(onNearbyChange);

  useEffect(() => {
    notifyNearby('npc');
    return () => notifyNearby(null);
  }, []);

  return <ScenePlaceholder label='3D 대기실 (비워 둠)' />;
}
