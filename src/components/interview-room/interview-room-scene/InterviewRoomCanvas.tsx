import { useRef, useState } from 'react';
import type { Group, Vector3Tuple } from 'three';
import { Character } from '@/components/space/character';
import { FirstPersonCamera } from '@/components/space/first-person-camera';
import { FollowCamera } from '@/components/space/follow-camera';
import { PlayerCharacter } from '@/components/space/player-character';
import { type SpaceCamera, SpaceCanvas } from '@/components/space/space-canvas';
import { StageLighting } from '@/components/space/stage-lighting';
import { StageModel } from '@/components/space/stage-model';
import {
  characterEyeHeight,
  characterKinds,
  characterRadius,
} from '@/constants/space/characterModels';
import { interview01AStage } from '@/constants/space/stages';
import { useProximity } from '@/hooks/space/useProximity';
import { useScreenAnchorTracking } from '@/hooks/space/useScreenAnchorTracking';
import { useWalkGrid } from '@/hooks/space/useWalkGrid';
import { color } from '@/styles/token';
import type { InterviewRole } from '@/types/interview/interview';
import type { InterviewRoomParticipant } from '@/types/interview-room/participant';
import type { CameraAngle } from '@/types/space/camera';
import type { StageSeat } from '@/types/space/stage';
import {
  headingForward,
  orbitOffset,
  sittingPlacement,
  standingPlacement,
  toThreePosition,
  toThreeYaw,
} from '@/utils/space/coordinates';
import type { ScreenAnchor } from '@/utils/space/screenAnchor';

const stage = interview01AStage;

/** 역할별 자리. 나는 늘 내 역할의 첫 자리에 앉고, 같은 역할의 다른 사람이 다음 자리를 채운다. */
const seatsByRole = {
  interviewee: ['Seat_Candidate_L', 'Seat_Candidate_R'],
  interviewer: ['Seat_Interviewer_L', 'Seat_Interviewer_R'],
} as const satisfies Record<
  InterviewRole,
  readonly (keyof typeof stage.seats)[]
>;

/** 자리에 앉으면 마주 보는 역할 */
const facingRole = {
  interviewee: 'interviewer',
  interviewer: 'interviewee',
} as const satisfies Record<InterviewRole, InterviewRole>;

/** 면접자인 나는 남쪽 문 앞 스폰 자리에 서서 방 안쪽을 보고 시작한다. */
const myStart = standingPlacement(stage.spawn, toThreeYaw(stage.spawn.rotz));

/**
 * 서 있을 때 내 캐릭터를 따라가는 3인칭 카메라 각도. 면접자 의자 뒤쪽(서쪽) 위에서 면접관 테이블(동쪽)을 본다.
 * 면접자 의자 둘이 화면에 나란히 놓이고, 맞은편 면접관은 얼굴이 보인다. 문(남쪽)은 화면 오른쪽에 있다.
 */
const cameraAngle: CameraAngle = { heading: 90, pitch: 45, distance: 9.2 };
/**
 * 카메라가 바라보는 높이(m). 머리보다 위를 봐서 내 캐릭터가 화면 아래쪽에 오고,
 * 내 자리 앞에 서도 맞은편 면접관이 화면 위쪽 단계 카드에 가리지 않는다.
 */
const cameraLookHeight = 2.2;
const cameraOffset = orbitOffset(cameraAngle);
const followFov = 50;

/** 위쪽 방향키가 가리킬 바닥 방향. 카메라가 바라보는 방향과 같다. */
const viewForward = headingForward(cameraAngle.heading);

/** 카메라가 서쪽 벽 밖에서 보므로 그 벽을 걷어 낸다. 앉아서 1인칭이 되면 다시 세운다. */
const cutaway = { area: stage.area, edges: ['west'] } as const;

const roomCenter = toThreePosition({
  x: stage.area.x + stage.area.width / 2,
  y: stage.area.y + stage.area.depth / 2,
});

/** 내 자리에 앉을 수 있는 거리(m). 의자에서 잰다. 디자이너 웹 시뮬레이션의 반경 1.7m를 따른다. */
const sitRange = { enter: 1.7, exit: 2 };

/** 앉기 안내를 띄울 높이(m). 의자 등받이(약 0.9m) 바로 위 */
const seatPromptHeight = 1.2;

/** 1인칭 세로 시야각(도). 3인칭보다 넓혀서 맞은편 두 사람과 테이블이 함께 들어온다. */
const firstPersonFov = 60;

/** 눈을 머리 가운데에서 얼굴 앞쪽으로 내민 거리(m). 디자이너 웹 시뮬레이션 값 */
const eyeForward = 0.35;

/**
 * 1인칭에서 맞은편 두 사람 사이를 바라보는 높이(m).
 * 면접관은 화면 아래쪽을 질문 카드가 덮으므로 더 낮은 곳을 봐서, 맞은편 얼굴이 카드 위로 올라오게 한다.
 */
const lookHeights = {
  interviewee: 1.2,
  interviewer: 0.8,
} as const satisfies Record<InterviewRole, number>;

/** 역할별 내 자리에 앉았을 때의 눈 위치와, 맞은편 두 자리 사이에서 바라보는 점(three.js 좌표) */
function getSeatedView(role: InterviewRole) {
  const [mySeat] = seatsByRole[role];
  const {
    position: [x, y, z],
    yaw,
  } = sittingPlacement(stage.seats[mySeat]);
  const eye: Vector3Tuple = [
    x + Math.sin(yaw) * eyeForward,
    y + characterEyeHeight,
    z + Math.cos(yaw) * eyeForward,
  ];
  const [leftSeat, rightSeat] = seatsByRole[facingRole[role]];
  const [leftX, , leftZ] = toThreePosition(stage.seats[leftSeat]);
  const [rightX, , rightZ] = toThreePosition(stage.seats[rightSeat]);
  const target: Vector3Tuple = [
    (leftX + rightX) / 2,
    lookHeights[role],
    (leftZ + rightZ) / 2,
  ];
  return { eye, target };
}

const seatedViews = {
  interviewee: getSeatedView('interviewee'),
  interviewer: getSeatedView('interviewer'),
} as const satisfies Record<InterviewRole, ReturnType<typeof getSeatedView>>;

/**
 * 처음 그릴 때의 카메라. 앉아 있으면 1인칭 눈 위치에서, 서 있으면 따라가는 카메라와 같은 자리에서 시작해
 * 첫 화면이 튀지 않는다.
 */
function getInitialCamera(role: InterviewRole, isSeated: boolean): SpaceCamera {
  if (isSeated) {
    const { eye, target } = seatedViews[role];
    return { position: eye, target, fov: firstPersonFov };
  }
  const [x, , z] = myStart.position;
  return {
    position: [
      x + cameraOffset[0],
      cameraLookHeight + cameraOffset[1],
      z + cameraOffset[2],
    ],
    target: [x, cameraLookHeight, z],
    fov: followFov,
  };
}

type SeatedParticipant = {
  participant: InterviewRoomParticipant;
  seat: StageSeat;
};

/**
 * 나를 뺀 사람들을 역할별 남은 자리에 앉힌다. 내 자리(역할별 첫 자리)는 비워 두고,
 * 자리보다 사람이 많으면 남는 사람은 그리지 않는다.
 */
function seatOthers(
  participants: readonly InterviewRoomParticipant[],
  myRole: InterviewRole,
): SeatedParticipant[] {
  const taken: Record<InterviewRole, number> = {
    interviewee: myRole === 'interviewee' ? 1 : 0,
    interviewer: myRole === 'interviewer' ? 1 : 0,
  };
  return participants.flatMap((participant) => {
    if (participant.isMe) return [];
    const seatName = seatsByRole[participant.role][taken[participant.role]];
    taken[participant.role] += 1;
    return seatName ? [{ participant, seat: stage.seats[seatName] }] : [];
  });
}

type InterviewRoomCanvasProps = {
  /** 면접방 사람들. 나(isMe)도 들어 있어야 내 역할과 캐릭터를 안다. */
  participants: readonly InterviewRoomParticipant[];
  /** 내가 자리에 앉았는지. 앉으면 1인칭으로 바뀌고 더는 걷지 않는다. */
  isSeated: boolean;
  /** 서 있는 내가 내 자리에 앉을 수 있는 거리에 들어오거나 벗어날 때 알린다. */
  onNearSeatChange: (isNear: boolean) => void;
  /** 내 자리 위 화면 좌표를 HUD에 알릴 곳 */
  seatAnchor: ScreenAnchor;
};

/** 3D 면접장 캔버스. 씬 안에서만 쓸 수 있는 훅(걷기 격자·거리 판정)은 InterviewRoomWorld가 맡는다. */
export function InterviewRoomCanvas(props: InterviewRoomCanvasProps) {
  const myRole =
    props.participants.find((participant) => participant.isMe)?.role ??
    'interviewee';
  // 카메라는 처음 그릴 때만 맞춘다. 그 뒤로는 따라가는 카메라·1인칭 카메라가 옮긴다.
  const [camera] = useState(() => getInitialCamera(myRole, props.isSeated));

  return (
    <SpaceCanvas camera={camera} background={color.neutral[100]}>
      <InterviewRoomWorld {...props} myRole={myRole} />
    </SpaceCanvas>
  );
}

/**
 * 3D 면접장 장면. 면접자 둘은 서쪽 의자에, 면접관 둘은 동쪽 테이블 뒤에 마주 앉는다.
 * 서 있는 나는 방향키로 걸어 내 자리로 가고, 앉으면 카메라가 내 눈 위치로 들어가 1인칭이 된다.
 */
function InterviewRoomWorld({
  participants,
  myRole,
  isSeated,
  onNearSeatChange,
  seatAnchor,
}: InterviewRoomCanvasProps & { myRole: InterviewRole }) {
  const myBody = useRef<Group>(null);
  const mySeatedBody = useRef<Group>(null);
  // 1인칭 카메라가 방 안 눈 위치에 닿기 전까지는 벽을 걷어 낸 채로 두어, 들어가는 동안 벽에 가리지 않는다.
  const [isCameraInside, setIsCameraInside] = useState(isSeated);
  const walkGrid = useWalkGrid(stage.walkGrid, characterRadius);
  const me = participants.find((participant) => participant.isMe);
  const others = seatOthers(participants, myRole);
  const mySeat = stage.seats[seatsByRole[myRole][0]];
  const [seatX, , seatZ] = toThreePosition(mySeat);
  const seatedView = seatedViews[myRole];

  // 아래 두 훅은 캐릭터·카메라가 움직인 뒤에 계산하도록, 자식보다 나중에 등록되는 이 컴포넌트에서 부른다.
  useProximity({
    target: myBody,
    point: [seatX, seatZ],
    ...sitRange,
    onChange: onNearSeatChange,
  });
  useScreenAnchorTracking(seatAnchor, [seatX, seatPromptHeight, seatZ]);

  return (
    <>
      <StageLighting center={roomCenter} reach={8} />
      <StageModel
        url={stage.url}
        showCeiling={isCameraInside}
        cutaway={isCameraInside ? undefined : cutaway}
      />
      {others.map(({ participant, seat }) => (
        <Character
          key={participant.id}
          kind={characterKinds[participant.role][participant.avatar]}
          placement={sittingPlacement(seat)}
          pose='sit'
        />
      ))}
      {me &&
        (isSeated ? (
          <group ref={mySeatedBody}>
            <Character
              kind={characterKinds[me.role][me.avatar]}
              placement={sittingPlacement(mySeat)}
              pose='sit'
            />
          </group>
        ) : (
          <PlayerCharacter
            kind={characterKinds[me.role][me.avatar]}
            start={myStart}
            walkGrid={walkGrid}
            forward={viewForward}
            enabled
            bodyRef={myBody}
          />
        ))}
      {isSeated ? (
        <FirstPersonCamera
          eye={seatedView.eye}
          target={seatedView.target}
          fov={firstPersonFov}
          body={mySeatedBody}
          onArrive={() => setIsCameraInside(true)}
        />
      ) : (
        <FollowCamera
          target={myBody}
          angle={cameraAngle}
          lookHeight={cameraLookHeight}
        />
      )}
    </>
  );
}
