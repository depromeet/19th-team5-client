import { useRef } from 'react';
import type { Group, Vector3Tuple } from 'three';
import { Character } from '@/components/space/character';
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
import { candWait01Stage } from '@/constants/space/stages';
import { useProximity } from '@/hooks/space/useProximity';
import { useScreenAnchorTracking } from '@/hooks/space/useScreenAnchorTracking';
import { useWalkGrid } from '@/hooks/space/useWalkGrid';
import { color } from '@/styles/token';
import type { CameraAngle } from '@/types/space/camera';
import type { Participant } from '@/types/waiting-room/participant';
import {
  headingForward,
  orbitOffset,
  sittingPlacement,
  standingPlacement,
  toThreePosition,
  yawToward,
} from '@/utils/space/coordinates';
import type { ScreenAnchor } from '@/utils/space/screenAnchor';

const stage = candWait01Stage;
const { staffSeat, visitorSpot } = stage.hrDesk;

/**
 * 다른 참가자가 앉는 순서. 얼굴이 카메라 쪽을 향하는 안쪽 자리부터 채우고,
 * 카메라 바로 앞이라 크게 잘려 보이는 라운지 의자는 마지막에 쓴다.
 */
const seatOrder = [
  'Seat_Puffy_2',
  'Seat_Sofa_2',
  'Seat_Puffy_1',
  'Seat_Sofa_1',
  'Seat_Sofa_3',
  'Seat_Lounge_2',
  'Seat_Lounge_1',
  'Seat_Lounge_4',
] as const satisfies readonly (keyof typeof stage.seats)[];

/** 나는 김대리 앞 대화 자리에서 김대리를 보고 시작한다. */
const myStart = standingPlacement(
  visitorSpot,
  yawToward(visitorSpot, staffSeat),
);

/**
 * 내 캐릭터를 따라가는 카메라 각도. 북서쪽 위에서 김대리 테이블 쪽(동남동)을 본다.
 * pitch를 낮출수록 옆에서 보고, distance를 줄일수록 가까이서 본다.
 */
const cameraAngle: CameraAngle = { heading: 63, pitch: 45, distance: 9.2 };
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

/** 카메라가 북서쪽에서 보므로, 그쪽 벽을 걷어 내야 방 밖에서도 캐릭터가 가려지지 않는다. */
const cutaway = { area: stage.area, edges: ['north', 'west'] } as const;

const roomCenter = toThreePosition({
  x: stage.area.x + stage.area.width / 2,
  y: stage.area.y + stage.area.depth / 2,
});

/** 김대리에게 말을 걸 수 있는 거리(m). 대화 자리에서 잰다. 디자이너 웹 시뮬레이션의 반경 1.8m를 따른다. */
const talkRange = { enter: 1.8, exit: 2.1 };
const talkPoint = (() => {
  const [x, , z] = toThreePosition(visitorSpot);
  return [x, z] as const;
})();

/** 김대리 머리 꼭대기. HUD의 말 걸기 안내를 이 점 위에 띄운다. */
const npcHeadTop = (() => {
  const [x, y, z] = sittingPlacement(staffSeat).position;
  const headTop: Vector3Tuple = [x, y + characterHeight, z];
  return headTop;
})();

type WaitingRoomCanvasProps = {
  participants: readonly Participant[];
  /** 내 캐릭터를 움직일 수 있는지. 다이얼로그가 열려 있거나 카운트다운 중이면 false */
  canMove: boolean;
  /** 내 캐릭터가 김대리에게 말을 걸 수 있는 거리에 들어오거나 벗어날 때 알린다. */
  onNearNpcChange: (isNear: boolean) => void;
  /** 김대리 머리 위 화면 좌표를 HUD에 알릴 곳 */
  npcAnchor: ScreenAnchor;
};

/** 3D 대기실 캔버스. 씬 안에서만 쓸 수 있는 훅(걷기 격자·거리 판정)은 WaitingRoomWorld가 맡는다. */
export function WaitingRoomCanvas(props: WaitingRoomCanvasProps) {
  return (
    <SpaceCanvas camera={initialCamera} background={color.neutral[100]}>
      <WaitingRoomWorld {...props} />
    </SpaceCanvas>
  );
}

/**
 * 3D 대기실 장면. 김대리는 인사팀 테이블에, 다른 참가자는 정해진 순서대로 자리에 앉아 있다.
 * 나는 방향키로 걸어 다니고, 김대리 앞에 가까이 가면 말을 걸 수 있다.
 */
function WaitingRoomWorld({
  participants,
  canMove,
  onNearNpcChange,
  npcAnchor,
}: WaitingRoomCanvasProps) {
  const myBody = useRef<Group>(null);
  const walkGrid = useWalkGrid(stage.walkGrid, characterRadius);
  const me = participants.find((participant) => participant.isMe);
  const others = participants
    .filter((participant) => !participant.isMe)
    .slice(0, seatOrder.length);

  // 아래 두 훅은 캐릭터·카메라가 움직인 뒤에 계산하도록, 자식보다 나중에 등록되는 이 컴포넌트에서 부른다.
  useProximity({
    target: myBody,
    point: talkPoint,
    ...talkRange,
    onChange: onNearNpcChange,
  });
  useScreenAnchorTracking(npcAnchor, npcHeadTop);

  return (
    <>
      <StageLighting center={roomCenter} reach={8} />
      <StageModel url={stage.url} cutaway={cutaway} />
      {/* 김대리 */}
      <Character
        kind='interviewer-male'
        placement={sittingPlacement(staffSeat)}
        pose='sit'
      />
      {others.map((participant, index) => (
        <Character
          key={participant.id}
          kind={characterKinds[participant.role][participant.avatar]}
          placement={sittingPlacement(stage.seats[seatOrder[index]])}
          pose='sit'
        />
      ))}
      {me && (
        <PlayerCharacter
          kind={characterKinds[me.role][me.avatar]}
          start={myStart}
          walkGrid={walkGrid}
          forward={viewForward}
          enabled={canMove}
          bodyRef={myBody}
        />
      )}
      <FollowCamera
        target={myBody}
        angle={cameraAngle}
        lookHeight={cameraLookHeight}
      />
    </>
  );
}
