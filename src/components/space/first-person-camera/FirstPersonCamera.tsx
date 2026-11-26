import { useFrame, useThree } from '@react-three/fiber';
import { type RefObject, useEffect, useMemo, useRef } from 'react';
import {
  MathUtils,
  Matrix4,
  type Object3D,
  PerspectiveCamera,
  Quaternion,
  Vector3,
  type Vector3Tuple,
} from 'three';

/** 카메라가 눈 위치까지 이만큼(0~1) 다가가면 내 몸을 숨긴다. 더 다가가면 머리 속이 보인다. */
const hideBodyAt = 0.6;

type CameraPose = { position: Vector3; quaternion: Quaternion; fov: number };

type FirstPersonCameraProps = {
  /** 눈 위치(three.js 좌표) */
  eye: Vector3Tuple;
  /** 바라보는 점(three.js 좌표) */
  target: Vector3Tuple;
  /** 세로 시야각(도) */
  fov: number;
  /** 지금 카메라 자리에서 눈 위치까지 옮겨 가는 시간(초) */
  transitionSeconds?: number;
  /** 1인칭으로 들어갈 내 몸. 카메라가 머리에 가까워지면 숨긴다. */
  body?: RefObject<Object3D | null>;
  /** 카메라가 눈 위치에 닿으면 한 번 부른다. */
  onArrive?: () => void;
};

/** 천천히 출발해서 천천히 멈추는 진행률 */
function easeInOut(progress: number) {
  return progress * progress * (3 - 2 * progress);
}

/**
 * 앉은 자리의 눈 위치에서 앞을 보는 1인칭 카메라. 둘러보기 없이 고정된다.
 * 붙는 순간의 카메라 자리(3인칭)에서 눈 위치로 옮겨 가고, 처음부터 눈 위치에 있으면 옮기지 않는다.
 */
export function FirstPersonCamera({
  eye,
  target,
  fov,
  transitionSeconds = 0.8,
  body,
  onArrive,
}: FirstPersonCameraProps) {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const [eyeX, eyeY, eyeZ] = eye;
  const [targetX, targetY, targetZ] = target;
  const goal = useMemo<CameraPose>(() => {
    const position = new Vector3(eyeX, eyeY, eyeZ);
    const rotation = new Matrix4().lookAt(
      position,
      new Vector3(targetX, targetY, targetZ),
      new Vector3(0, 1, 0),
    );
    return {
      position,
      quaternion: new Quaternion().setFromRotationMatrix(rotation),
      fov,
    };
  }, [eyeX, eyeY, eyeZ, targetX, targetY, targetZ, fov]);
  const start = useRef<CameraPose | null>(null);
  const elapsed = useRef(0);
  const hasArrived = useRef(false);
  const latestOnArrive = useRef(onArrive);

  useEffect(() => {
    latestOnArrive.current = onArrive;
  }, [onArrive]);

  // 화면이 멈춰 있어도(frameloop: demand) 붙자마자 옮겨 가기 시작한다.
  useEffect(() => {
    invalidate();
  }, [invalidate]);

  useFrame((_, delta) => {
    if (!(camera instanceof PerspectiveCamera)) return;
    if (!start.current) {
      start.current = {
        position: camera.position.clone(),
        quaternion: camera.quaternion.clone(),
        fov: camera.fov,
      };
      if (start.current.position.distanceToSquared(goal.position) < 1e-6) {
        elapsed.current = transitionSeconds;
      }
    }
    elapsed.current += delta;
    const progress =
      transitionSeconds > 0
        ? Math.min(1, elapsed.current / transitionSeconds)
        : 1;
    const amount = easeInOut(progress);
    camera.position.lerpVectors(start.current.position, goal.position, amount);
    camera.quaternion.slerpQuaternions(
      start.current.quaternion,
      goal.quaternion,
      amount,
    );
    const nextFov = MathUtils.lerp(start.current.fov, goal.fov, amount);
    if (camera.fov !== nextFov) {
      camera.fov = nextFov;
      camera.updateProjectionMatrix();
    }
    if (body?.current) body.current.visible = amount < hideBodyAt;

    if (progress < 1) {
      invalidate();
    } else if (!hasArrived.current) {
      hasArrived.current = true;
      latestOnArrive.current?.();
    }
  });

  return null;
}
