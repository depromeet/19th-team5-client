import { useFrame, useThree } from '@react-three/fiber';
import { type RefObject, useRef } from 'react';
import type { Group } from 'three';
import { characterScale } from '@/constants/space/characterModels';
import { useCharacterModel } from '@/hooks/space/useCharacterModel';
import { useMovementKeys } from '@/hooks/space/useMovementKeys';
import type { CharacterKind } from '@/types/space/character';
import type { Placement } from '@/types/space/stage';
import { setPose, walkPose } from '@/utils/space/characterRig';
import { isWalkable, type WalkGrid } from '@/utils/space/walkGrid';

/** 걷는 속도(m/s) */
const walkSpeed = 3.2;
/** 몸을 진행 방향으로 돌리는 빠르기. 클수록 빨리 돈다. */
const turnRate = 16;
/** 걷기·멈추기 자세가 바뀌는 빠르기 */
const blendRate = 10;
/** 걸음 위상이 도는 빠르기(라디안/초). 한 걸음에 반 바퀴다. */
const stepRate = 10.5;
/** 걸을 때 몸이 위아래로 흔들리는 높이(m) */
const bobHeight = 0.035;
/** 탭 전환 등으로 프레임 간격이 길어져도 한 번에 순간이동하지 않게 자른다. */
const maxFrameSeconds = 1 / 20;

type PlayerCharacterProps = {
  kind: CharacterKind;
  /** 처음 서 있는 자리와 방향(three.js 좌표) */
  start: Placement;
  /** 벽·가구에서 캐릭터 반경만큼 떨어뜨린 걷기 격자 */
  walkGrid: WalkGrid;
  /** 위쪽 방향키가 가리킬 바닥 방향(three.js x, z 단위 벡터). 보통 카메라가 바라보는 방향이다. */
  forward: readonly [number, number];
  /** false면 이동 키를 받지 않고 멈춘다. 다이얼로그가 열려 있을 때 등 */
  enabled: boolean;
  /** 카메라·거리 판정이 캐릭터 위치를 읽을 몸통 그룹 */
  bodyRef: RefObject<Group | null>;
};

function shortestTurn(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

/**
 * 방향키·WASD로 움직이는 내 캐릭터. 화면 기준으로 움직이고, 벽·가구에 막히면 그 축만 미끄러지듯 따라간다.
 * 움직이는 동안에만 다음 프레임을 요청해서, 멈춰 있으면 화면도 다시 그리지 않는다.
 */
export function PlayerCharacter({
  kind,
  start,
  walkGrid,
  forward,
  enabled,
  bodyRef,
}: PlayerCharacterProps) {
  const { model, rig, originOffset } = useCharacterModel(kind);
  const invalidate = useThree((state) => state.invalidate);
  const readInput = useMovementKeys(enabled, invalidate);
  const motion = useRef({
    x: start.position[0],
    z: start.position[2],
    yaw: start.yaw,
    /** 0(서 있음)~1(걷는 중) */
    walking: 0,
    phase: 0,
  });

  useFrame((_, delta) => {
    const body = bodyRef.current;
    if (!body) return;
    const dt = Math.min(delta, maxFrameSeconds);
    const state = motion.current;
    const input = readInput();
    let moved = false;
    let turning = false;

    if (input.x !== 0 || input.y !== 0) {
      // 화면 위쪽 = forward, 화면 오른쪽 = forward를 시계 방향으로 90° 돌린 방향(-z, x)
      const [fx, fz] = forward;
      const mx = fx * input.y - fz * input.x;
      const mz = fz * input.y + fx * input.x;
      const length = Math.hypot(mx, mz);
      const dx = (mx / length) * walkSpeed * dt;
      const dz = (mz / length) * walkSpeed * dt;
      // 걷기 격자는 Blender 좌표라서 three.js z를 Blender y = -z로 바꿔 묻는다.
      const canStand = (x: number, z: number) => isWalkable(walkGrid, x, -z);
      if (canStand(state.x + dx, state.z + dz)) {
        state.x += dx;
        state.z += dz;
        moved = true;
      } else if (canStand(state.x + dx, state.z)) {
        state.x += dx;
        moved = true;
      } else if (canStand(state.x, state.z + dz)) {
        state.z += dz;
        moved = true;
      }
      // 벽에 막혀 제자리에 있어도 누른 방향으로는 몸을 끝까지 돌린다.
      const turn = shortestTurn(Math.atan2(mx, mz) - state.yaw);
      state.yaw += turn * Math.min(1, dt * turnRate);
      turning = Math.abs(turn) > 0.01;
    }

    state.walking +=
      ((moved ? 1 : 0) - state.walking) * Math.min(1, dt * blendRate);
    if (state.walking < 0.001) state.walking = 0;
    state.phase += dt * stepRate * state.walking;

    body.position.set(
      state.x,
      Math.abs(Math.cos(state.phase)) * bobHeight * state.walking,
      state.z,
    );
    body.rotation.y = state.yaw;
    setPose(rig, walkPose(state.phase, state.walking));

    if (moved || turning || state.walking > 0) invalidate();
  });

  return (
    <group ref={bodyRef}>
      <group scale={characterScale}>
        <primitive object={model} position={originOffset} />
      </group>
    </group>
  );
}
