import { characterSitDrop } from '@/constants/space/characterModels';
import type { CameraAngle } from '@/types/space/camera';
import type { BlenderPoint, Placement, StageSeat } from '@/types/space/stage';

/**
 * Blender(Z-up) 좌표를 three.js(Y-up) 좌표로 바꾼다. (x, y, z) → (x, z, −y)
 * scene_data.json 좌표와 GLB 안의 좌표가 이 규칙으로 맞물린다.
 */
export function toThreePosition({
  x,
  y,
  z = 0,
}: BlenderPoint): Placement['position'] {
  return [x, z, -y];
}

/**
 * scene_data.json의 rotz(도)를 three.js Y축 회전(라디안)으로 바꾼다.
 * rotz가 0이면 캐릭터는 three.js +Z(Blender −Y)를 본다.
 */
export function toThreeYaw(rotz: number) {
  return (rotz * Math.PI) / 180;
}

/** from에 서서 to를 바라볼 때의 three.js Y축 회전(라디안) */
export function yawToward(from: BlenderPoint, to: BlenderPoint) {
  // three.js 좌표에서 to까지의 방향은 (dx, dz) = (Δx, −Δy)이고, +Z를 볼 때가 0이다.
  return Math.atan2(to.x - from.x, -(to.y - from.y));
}

/** 바닥에 선 캐릭터의 배치 */
export function standingPlacement(spot: BlenderPoint, yaw: number): Placement {
  return { position: toThreePosition({ ...spot, z: 0 }), yaw };
}

/** 좌석에 앉은 캐릭터의 배치. 몸 뿌리를 좌면보다 sit_drop만큼 낮춘다. */
export function sittingPlacement(seat: StageSeat): Placement {
  return {
    position: toThreePosition({ ...seat, z: seat.z - characterSitDrop }),
    yaw: toThreeYaw(seat.rotz),
  };
}

/** heading(도) 쪽을 가리키는 바닥 단위 벡터(three.js x, z). 0이면 +Z다. */
export function headingForward(heading: number): readonly [number, number] {
  const radians = (heading * Math.PI) / 180;
  return [Math.sin(radians), Math.cos(radians)];
}

/** 카메라가 바라보는 점에서 카메라 자리까지의 차이(three.js 좌표) */
export function orbitOffset({
  heading,
  pitch,
  distance,
}: CameraAngle): Placement['position'] {
  const [fx, fz] = headingForward(heading);
  const tilt = (pitch * Math.PI) / 180;
  const ground = Math.cos(tilt) * distance;
  return [-fx * ground, Math.sin(tilt) * distance, -fz * ground];
}
