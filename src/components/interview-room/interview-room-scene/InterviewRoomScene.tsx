import { useEffect, useEffectEvent } from 'react';
import { ScenePlaceholder } from '@/components/space';

export type InterviewRoomInteractable = 'seat';

type InterviewRoomSceneProps = {
  /** 내 아바타가 자리에 앉았는지. 앉으면 3인칭 하이앵글에서 1인칭 시점으로 바뀐다. */
  isSeated: boolean;
  /** 내 아바타가 상호작용 범위에 들어오거나 나갈 때 알린다. */
  onNearbyChange: (target: InterviewRoomInteractable | null) => void;
};

/**
 * 3D 면접장 자리. 지금은 들어오자마자 내 아바타가 내 자리 앞에 서 있다고 보고 'seat'을 알리고,
 * 앉은 뒤에는 범위를 벗어난 것으로 본다. 면접관은 처음부터 앉아 있다.
 * React Three Fiber 씬으로 바꿀 때도 같은 props를 유지하면 InterviewRoomPage는 그대로 쓴다.
 */
export function InterviewRoomScene({
  isSeated,
  onNearbyChange,
}: InterviewRoomSceneProps) {
  const notifyNearby = useEffectEvent(onNearbyChange);

  useEffect(() => {
    notifyNearby(isSeated ? null : 'seat');
    return () => notifyNearby(null);
  }, [isSeated]);

  return (
    <ScenePlaceholder
      label={
        isSeated
          ? '3D 면접장 · 1인칭 (비워 둠)'
          : '3D 면접장 · 하이앵글 3인칭 (면접관은 이미 착석)'
      }
    />
  );
}
