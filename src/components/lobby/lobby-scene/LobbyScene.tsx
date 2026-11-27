import { lazy, Suspense, useEffect, useEffectEvent, useState } from 'react';
import { SceneBoundary, ScenePlaceholder } from '@/components/space';
import type { InterviewRole } from '@/types/interview/interview';
import type { Avatar } from '@/types/Signup';
import type { ScreenAnchor } from '@/utils/space/screenAnchor';
import { canRenderSpaceScene } from '@/utils/space/webgl';

export type LobbyInteractable = 'kiosk';

/** three.js가 메인 번들에 섞이지 않도록 3D 장면은 로비에 들어올 때 따로 불러온다. */
const LobbyCanvas = lazy(() =>
  import('./LobbyCanvas').then((module) => ({
    default: module.LobbyCanvas,
  })),
);

type LobbySceneProps = {
  /** 내 캐릭터 모습을 고를 역할. 다가오는 면접에서 맡은 역할이고, 예약이 없으면 면접자다. */
  role: InterviewRole;
  /** 가입 때 고른 아바타 */
  avatar: Avatar;
  /** 내 캐릭터를 방향키로 움직일 수 있는지. 질문지·다이얼로그가 열려 있으면 false */
  canMove: boolean;
  /** 내 아바타가 상호작용 범위에 들어오거나 나갈 때 알린다. */
  onNearbyChange: (target: LobbyInteractable | null) => void;
  /**
   * 3D 씬이 키오스크 위 화면 좌표를 알리는 곳. HUD가 키오스크 사용 안내를 그 위에 띄운다.
   * 3D를 쓸 수 없으면 좌표를 알리지 않으므로 안내는 기본 위치에 남는다.
   */
  kioskAnchor: ScreenAnchor;
};

/**
 * 3D 로비. 나는 로비 입구에서 시작해, 방향키로 걸어 다니는 동안 키오스크와의 거리로 'kiosk'를 알린다.
 * 장면을 불러오는 동안에는 placeholder를 보여주고, 입구에 서 있으니 키오스크는 아직 멀다.
 */
export function LobbyScene({
  role,
  avatar,
  canMove,
  onNearbyChange,
  kioskAnchor,
}: LobbySceneProps) {
  const [canRender] = useState(canRenderSpaceScene);
  const unavailable = <UnavailableLobby onNearbyChange={onNearbyChange} />;

  if (!canRender) return unavailable;

  return (
    <SceneBoundary fallback={unavailable}>
      <Suspense fallback={<ScenePlaceholder label='3D 로비를 불러오는 중' />}>
        <LobbyCanvas
          role={role}
          avatar={avatar}
          canMove={canMove}
          onNearKioskChange={(isNear) =>
            onNearbyChange(isNear ? 'kiosk' : null)
          }
          kioskAnchor={kioskAnchor}
        />
      </Suspense>
    </SceneBoundary>
  );
}

/**
 * WebGL을 쓸 수 없거나 GPU 가속이 없을 때, 또는 GLB를 불러오지 못했을 때의 로비.
 * 걸어갈 수 없으니 키오스크 앞에 서 있는 것으로 두어, HUD의 안내로 바로 예약할 수 있게 한다.
 */
function UnavailableLobby({
  onNearbyChange,
}: Pick<LobbySceneProps, 'onNearbyChange'>) {
  const notifyNearby = useEffectEvent(onNearbyChange);

  useEffect(() => {
    notifyNearby('kiosk');
    return () => notifyNearby(null);
  }, []);

  return <ScenePlaceholder label='3D 로비를 표시할 수 없어요' />;
}
