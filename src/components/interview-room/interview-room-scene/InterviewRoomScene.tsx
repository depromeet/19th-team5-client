import { lazy, Suspense, useEffect, useEffectEvent, useState } from 'react';
import { SceneBoundary, ScenePlaceholder } from '@/components/space';
import type { InterviewRoomParticipant } from '@/types/interview-room/participant';
import type { ScreenAnchor } from '@/utils/space/screenAnchor';
import { canRenderSpaceScene } from '@/utils/space/webgl';

export type InterviewRoomInteractable = 'seat';

/** three.js가 메인 번들에 섞이지 않도록 3D 장면은 면접방에 들어올 때 따로 불러온다. */
const InterviewRoomCanvas = lazy(() =>
  import('./InterviewRoomCanvas').then((module) => ({
    default: module.InterviewRoomCanvas,
  })),
);

type InterviewRoomSceneProps = {
  /** 면접방 사람들. 다른 사람은 역할별 자리에 앉아 있다. */
  participants: readonly InterviewRoomParticipant[];
  /** 내 아바타가 자리에 앉았는지. 앉으면 3인칭에서 1인칭 시점으로 바뀐다. 면접관은 처음부터 앉아 있다. */
  isSeated: boolean;
  /** 내 아바타가 상호작용 범위에 들어오거나 나갈 때 알린다. */
  onNearbyChange: (target: InterviewRoomInteractable | null) => void;
  /**
   * 3D 씬이 내 자리 위 화면 좌표를 알리는 곳. HUD가 앉기 안내를 그 위에 띄운다.
   * 3D를 쓸 수 없으면 좌표를 알리지 않으므로 안내는 기본 위치에 남는다.
   */
  seatAnchor: ScreenAnchor;
};

const unavailable = <ScenePlaceholder label='3D 면접장을 표시할 수 없어요' />;

/**
 * 3D 면접장. 면접관은 자기 자리에 앉은 1인칭으로, 면접자는 문 앞 스폰 자리에 선 3인칭으로 시작한다.
 * 면접자가 방향키로 걸어 내 자리 가까이 가면 'seat'을 알리고, 앉으면 1인칭으로 바뀐다.
 * 장면을 불러오는 동안, WebGL을 쓸 수 없거나 GPU 가속이 없을 때는 placeholder를 보여준다.
 * 그때는 걸을 수 없으니 내 자리 앞에 서 있는 것으로 보고 'seat'을 알려, 단축키로 바로 앉게 한다.
 */
export function InterviewRoomScene({
  participants,
  isSeated,
  onNearbyChange,
  seatAnchor,
}: InterviewRoomSceneProps) {
  const notifyNearby = useEffectEvent(onNearbyChange);
  const [canRender] = useState(canRenderSpaceScene);

  useEffect(() => {
    notifyNearby(isSeated ? null : 'seat');
    return () => notifyNearby(null);
  }, [isSeated]);

  if (!canRender) return unavailable;

  return (
    <SceneBoundary fallback={unavailable}>
      <Suspense fallback={<ScenePlaceholder label='3D 면접장을 불러오는 중' />}>
        <InterviewRoomCanvas
          participants={participants}
          isSeated={isSeated}
          onNearSeatChange={(isNear) => onNearbyChange(isNear ? 'seat' : null)}
          seatAnchor={seatAnchor}
        />
      </Suspense>
    </SceneBoundary>
  );
}
