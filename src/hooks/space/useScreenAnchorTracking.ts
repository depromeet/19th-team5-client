import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { Vector3, type Vector3Tuple } from 'three';
import type { ScreenAnchor } from '@/utils/space/screenAnchor';

/**
 * 3D 점(three.js 좌표)이 화면 어디에 보이는지 캔버스 기준 CSS px로 anchor에 알린다.
 * HUD는 이 좌표에 DOM을 붙인다(ScreenAnchored). 화면을 새로 그릴 때만 계산하므로,
 * 카메라가 멈춰 있으면 계산도 멈춘다. 씬이 사라지면 anchor를 비워 HUD가 기본 위치로 돌아가게 한다.
 */
export function useScreenAnchorTracking(
  anchor: ScreenAnchor,
  point: Vector3Tuple,
) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const projected = useMemo(() => new Vector3(), []);
  const [x, y, z] = point;

  // 카메라를 옮기는 컴포넌트(FollowCamera 등)보다 나중에 등록되도록, 씬 조립 컴포넌트에서 부른다.
  useFrame(() => {
    camera.updateMatrixWorld();
    projected.set(x, y, z).project(camera);
    anchor.set({
      x: ((projected.x + 1) / 2) * size.width,
      y: ((1 - projected.y) / 2) * size.height,
      // 화면 밖이어도 카메라 앞이면 보이는 것으로 둔다. HUD가 가장자리에 붙여 방향을 알려준다.
      visible: projected.z < 1,
    });
  });

  useEffect(() => () => anchor.set(null), [anchor]);
}
