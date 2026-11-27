import { useRef } from 'react';
import type { Group, Vector3Tuple } from 'three';
import { FollowCamera } from '@/components/space/follow-camera';
import { PlayerCharacter } from '@/components/space/player-character';
import { type SpaceCamera, SpaceCanvas } from '@/components/space/space-canvas';
import { StageLighting } from '@/components/space/stage-lighting';
import { StageModel } from '@/components/space/stage-model';
import {
  characterHeight,
  characterKinds,
  characterRadius,
} from '@/constants/space/characterModels';
import { lobbyStage } from '@/constants/space/stages';
import { useProximity } from '@/hooks/space/useProximity';
import { useScreenAnchorTracking } from '@/hooks/space/useScreenAnchorTracking';
import { useWalkGrid } from '@/hooks/space/useWalkGrid';
import { color } from '@/styles/token';
import type { InterviewRole } from '@/types/interview/interview';
import type { Avatar } from '@/types/Signup';
import type { CameraAngle } from '@/types/space/camera';
import {
  headingForward,
  orbitOffset,
  standingPlacement,
  toThreePosition,
  yawToward,
} from '@/utils/space/coordinates';
import type { ScreenAnchor } from '@/utils/space/screenAnchor';

const stage = lobbyStage;
const { entrance } = stage;
const { screen, visitorSpot } = stage.kiosk;

/** 나는 로비 입구에서 리셉션 데스크의 키오스크 쪽(북쪽)을 보고 시작한다. */
const myStart = standingPlacement(entrance, yawToward(entrance, screen));

/**
 * 내 캐릭터를 따라가는 카메라 각도. 입구가 있는 남쪽 위에서 리셉션 데스크가 있는 북쪽을 본다.
 * 디자이너 웹 시뮬레이션도 로비에서는 북쪽을 본다.
 */
const cameraAngle: CameraAngle = { heading: 180, pitch: 45, distance: 10 };
const cameraLookHeight = 1;
const cameraOffset = orbitOffset(cameraAngle);

/** 위쪽 방향키가 가리킬 바닥 방향. 카메라가 바라보는 방향과 같다. */
const viewForward = headingForward(cameraAngle.heading);

/** 처음 그릴 때의 카메라. 따라가는 카메라와 같은 자리에서 시작해 첫 화면이 튀지 않는다. */
const initialCamera: SpaceCamera = (() => {
  const [x, , z] = myStart.position;
  const target: Vector3Tuple = [x, cameraLookHeight, z];
  const position: Vector3Tuple = [
    x + cameraOffset[0],
    cameraLookHeight + cameraOffset[1],
    z + cameraOffset[2],
  ];
  return { position, target, fov: 50 };
})();

/** 카메라가 남쪽에서 보므로, 입구 쪽 유리벽을 걷어 내야 로비 남쪽에서도 캐릭터가 가려지지 않는다. */
const cutaway = { area: stage.area, edges: ['south'] } as const;

const lobbyCenter = toThreePosition({
  x: stage.area.x + stage.area.width / 2,
  y: stage.area.y + stage.area.depth / 2,
});

/**
 * 키오스크를 쓸 수 있는 거리(m). 가운데 키오스크 앞 자리에서 잰다.
 * 디자이너 웹 시뮬레이션은 키오스크 3대 앞 자리마다 1.6m였는데, 양옆 자리(1.67m)까지 함께 덮도록 넓혔다.
 */
const kioskRange = { enter: 2.2, exit: 2.5 };
const kioskPoint = (() => {
  const [x, , z] = toThreePosition(visitorSpot);
  return [x, z] as const;
})();

/** 가운데 키오스크 위, 그 앞에 선 내 머리와 같은 높이. HUD의 키오스크 안내를 이 점 위에 띄운다. */
const kioskPromptPoint = toThreePosition({ ...screen, z: characterHeight });

type LobbyCanvasProps = {
  /** 내 캐릭터 모습을 고를 역할과 아바타 */
  role: InterviewRole;
  avatar: Avatar;
  /** 내 캐릭터를 움직일 수 있는지. 질문지·다이얼로그가 열려 있으면 false */
  canMove: boolean;
  /** 내 캐릭터가 키오스크를 쓸 수 있는 거리에 들어오거나 벗어날 때 알린다. */
  onNearKioskChange: (isNear: boolean) => void;
  /** 키오스크 위 화면 좌표를 HUD에 알릴 곳 */
  kioskAnchor: ScreenAnchor;
};

/** 3D 로비 캔버스. 씬 안에서만 쓸 수 있는 훅(걷기 격자·거리 판정)은 LobbyWorld가 맡는다. */
export function LobbyCanvas(props: LobbyCanvasProps) {
  return (
    <SpaceCanvas camera={initialCamera} background={color.neutral[100]}>
      <LobbyWorld {...props} />
    </SpaceCanvas>
  );
}

/**
 * 3D 로비 장면. 나는 로비 입구에서 시작해 방향키로 로비를 걸어 다니고,
 * 리셉션 데스크의 예약 키오스크 앞에 가까이 가면 면접을 예약할 수 있다.
 */
function LobbyWorld({
  role,
  avatar,
  canMove,
  onNearKioskChange,
  kioskAnchor,
}: LobbyCanvasProps) {
  const myBody = useRef<Group>(null);
  const walkGrid = useWalkGrid(stage.walkGrid, characterRadius);

  // 아래 두 훅은 캐릭터·카메라가 움직인 뒤에 계산하도록, 자식보다 나중에 등록되는 이 컴포넌트에서 부른다.
  useProximity({
    target: myBody,
    point: kioskPoint,
    ...kioskRange,
    onChange: onNearKioskChange,
  });
  useScreenAnchorTracking(kioskAnchor, kioskPromptPoint);

  return (
    <>
      <StageLighting center={lobbyCenter} reach={17} />
      <StageModel url={stage.url} cutaway={cutaway} />
      <PlayerCharacter
        kind={characterKinds[role][avatar]}
        start={myStart}
        walkGrid={walkGrid}
        forward={viewForward}
        enabled={canMove}
        bodyRef={myBody}
      />
      <FollowCamera
        target={myBody}
        angle={cameraAngle}
        lookHeight={cameraLookHeight}
      />
    </>
  );
}
