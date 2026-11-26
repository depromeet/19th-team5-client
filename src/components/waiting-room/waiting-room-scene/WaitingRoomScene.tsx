import { lazy, Suspense, useEffect, useEffectEvent, useState } from 'react';
import { SceneBoundary, ScenePlaceholder } from '@/components/space';
import type { Participant } from '@/types/waiting-room/participant';
import type { ScreenAnchor } from '@/utils/space/screenAnchor';
import { canRenderSpaceScene } from '@/utils/space/webgl';

export type WaitingRoomInteractable = 'npc';

/** three.js가 메인 번들에 섞이지 않도록 3D 장면은 대기실에 들어올 때 따로 불러온다. */
const WaitingRoomCanvas = lazy(() =>
  import('./WaitingRoomCanvas').then((module) => ({
    default: module.WaitingRoomCanvas,
  })),
);

type WaitingRoomSceneProps = {
  /** 대기실 참가자. 나는 김대리 앞에서 시작하고, 다른 참가자는 자리에 앉아 있다. */
  participants: readonly Participant[];
  /** 내 캐릭터를 방향키로 움직일 수 있는지. 다이얼로그가 열려 있거나 카운트다운 중이면 false */
  canMove: boolean;
  /** 내 아바타가 상호작용 범위에 들어오거나 나갈 때 알린다. */
  onNearbyChange: (target: WaitingRoomInteractable | null) => void;
  /**
   * 3D 씬이 김대리 머리 위 화면 좌표를 알리는 곳. HUD가 말 걸기 안내를 그 위에 띄운다.
   * 3D를 쓸 수 없으면 좌표를 알리지 않으므로 안내는 기본 위치에 남는다.
   */
  npcAnchor: ScreenAnchor;
};

const unavailable = <ScenePlaceholder label='3D 대기실을 표시할 수 없어요' />;

/**
 * 3D 대기실. 나는 김대리 앞 대화 자리에서 시작하므로 들어오자마자 'npc'를 알리고,
 * 그 뒤에는 방향키로 걸어 다니는 동안 김대리와의 거리로 다시 알린다.
 * 장면을 불러오는 동안, WebGL을 쓸 수 없거나 GPU 가속이 없을 때는 placeholder를 보여준다.
 * 그때는 움직일 수 없으니 김대리 앞에 서 있는 것으로 두고, HUD는 그대로 동작한다.
 */
export function WaitingRoomScene({
  participants,
  canMove,
  onNearbyChange,
  npcAnchor,
}: WaitingRoomSceneProps) {
  const notifyNearby = useEffectEvent(onNearbyChange);
  const [canRender] = useState(canRenderSpaceScene);

  useEffect(() => {
    notifyNearby('npc');
    return () => notifyNearby(null);
  }, []);

  if (!canRender) return unavailable;

  return (
    <SceneBoundary fallback={unavailable}>
      <Suspense fallback={<ScenePlaceholder label='3D 대기실을 불러오는 중' />}>
        <WaitingRoomCanvas
          participants={participants}
          canMove={canMove}
          onNearNpcChange={(isNear) => onNearbyChange(isNear ? 'npc' : null)}
          npcAnchor={npcAnchor}
        />
      </Suspense>
    </SceneBoundary>
  );
}
