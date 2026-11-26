/** 대상을 따라가는 카메라의 각도와 거리 */
export type CameraAngle = {
  /** 카메라가 바라보는 바닥 방향(three.js Y축 회전, 도). 0이면 +Z(Blender −Y, 남쪽)를 본다. */
  heading: number;
  /** 내려다보는 각도(도). 90이면 바로 위에서, 낮출수록 옆에서 본다. */
  pitch: number;
  /** 바라보는 점에서 카메라까지의 거리(m) */
  distance: number;
};
