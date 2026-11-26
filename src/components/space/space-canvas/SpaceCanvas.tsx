import { Canvas, useThree } from '@react-three/fiber';
import { type ReactNode, useLayoutEffect, useMemo } from 'react';
import {
  Euler,
  Matrix4,
  PMREMGenerator,
  Vector3,
  type Vector3Tuple,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type SpaceCamera = {
  /** 카메라 위치(three.js 좌표) */
  position: Vector3Tuple;
  /** 카메라가 바라보는 점(three.js 좌표) */
  target: Vector3Tuple;
  /** 세로 시야각(도) */
  fov: number;
};

type SpaceCanvasProps = {
  /** 고정 카메라. 같은 객체를 계속 넘겨야 카메라를 다시 맞추지 않는다. */
  camera: SpaceCamera;
  /** 씬 배경색 */
  background: string;
  children: ReactNode;
};

/** position에서 target을 바라보는 카메라 회전(XYZ 오일러각) */
function lookAtRotation({ position, target }: SpaceCamera): Vector3Tuple {
  const matrix = new Matrix4().lookAt(
    new Vector3(...position),
    new Vector3(...target),
    new Vector3(0, 1, 0),
  );
  const { x, y, z } = new Euler().setFromRotationMatrix(matrix);
  return [x, y, z];
}

/**
 * 3D 공간 공통 캔버스. 톤 매핑·그림자·해상도 상한·실내 환경광을 한곳에서 맞춘다.
 * 지금 씬은 움직이지 않아서 화면이 바뀔 때만 다시 그린다(frameloop: demand).
 * 그림자는 three r187에서 없어진 PCFSoftShadowMap 대신 PCFShadowMap(percentage)을 쓴다.
 */
export function SpaceCanvas({
  camera,
  background,
  children,
}: SpaceCanvasProps) {
  const cameraOptions = useMemo(
    () => ({
      fov: camera.fov,
      near: 0.1,
      far: 200,
      position: camera.position,
      rotation: lookAtRotation(camera),
    }),
    [camera],
  );

  return (
    <Canvas
      aria-hidden='true'
      frameloop='demand'
      shadows='percentage'
      dpr={[1, 2]}
      camera={cameraOptions}
    >
      <color attach='background' args={[background]} />
      <RoomLight />
      {children}
    </Canvas>
  );
}

/** 실내 반사광. 금속·유리 재질이 자연스럽게 보이도록 RoomEnvironment를 환경맵으로 쓴다. */
function RoomLight() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useLayoutEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, 0.04).texture;
    room.dispose();
    generator.dispose();
    scene.environment = environment;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      environment.dispose();
    };
  }, [gl, scene]);

  return <hemisphereLight args={['#ffffff', '#cbb9a4', 1.1]} />;
}
