import { useFrame, useThree } from '@react-three/fiber';
import { type RefObject, useMemo, useRef } from 'react';
import { type Object3D, Vector3 } from 'three';
import type { CameraAngle } from '@/types/space/camera';
import { orbitOffset } from '@/utils/space/coordinates';

/** 카메라가 대상을 따라잡는 빠르기. 클수록 덜 늦게 따라간다. */
const followRate = 6;

type FollowCameraProps = {
  /** 따라갈 대상(보통 내 캐릭터) */
  target: RefObject<Object3D | null>;
  /** 카메라 각도와 거리. 대상이 움직여도 이 각도를 그대로 유지해 시점이 돌지 않는다. */
  angle: CameraAngle;
  /** 대상 발밑에서 카메라가 바라보는 점까지의 높이(m) */
  lookHeight: number;
};

/**
 * 대상을 같은 각도로 따라가는 3인칭 카메라. 대상은 늘 화면 가운데 근처에 머문다.
 * 각도는 씬마다 상수로 정해 둔다. 실행 중에 바꾸면 다음에 화면을 새로 그릴 때 반영된다.
 */
export function FollowCamera({ target, angle, lookHeight }: FollowCameraProps) {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const offset = useMemo(() => orbitOffset(angle), [angle]);
  const focus = useMemo(() => new Vector3(), []);
  const goal = useMemo(() => new Vector3(), []);
  const hasFocus = useRef(false);

  useFrame((_, delta) => {
    const object = target.current;
    if (!object) return;
    // 걸을 때 몸이 위아래로 흔들려도 화면은 흔들리지 않게 높이는 고정한다.
    goal.set(object.position.x, lookHeight, object.position.z);
    if (hasFocus.current) {
      focus.lerp(goal, 1 - Math.exp(-delta * followRate));
    } else {
      focus.copy(goal);
      hasFocus.current = true;
    }
    if (focus.distanceToSquared(goal) < 1e-6) focus.copy(goal);
    else invalidate();
    camera.position.set(
      focus.x + offset[0],
      focus.y + offset[1],
      focus.z + offset[2],
    );
    camera.lookAt(focus);
  });

  return null;
}
