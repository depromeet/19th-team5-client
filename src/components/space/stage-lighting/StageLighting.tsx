import { useEffect, useMemo } from 'react';
import { DirectionalLight, type Vector3Tuple } from 'three';

type StageLightingProps = {
  /** 빛을 비출 공간의 중심(three.js 좌표) */
  center: Vector3Tuple;
  /** 그림자를 드리울 범위. 중심에서 가장자리까지(m) */
  reach: number;
};

/**
 * 공간 위에서 비스듬히 비추는 주광. 방 전체에 그림자를 드리운다.
 * 그림자 카메라 범위를 바꾼 뒤 투영 행렬을 다시 계산해야 해서, 조명 객체를 직접 만든다.
 */
export function StageLighting({ center, reach }: StageLightingProps) {
  const [x, y, z] = center;
  const light = useMemo(() => {
    const sun = new DirectionalLight('#fff4e6', 1.4);
    sun.position.set(x - 4, y + 9, z + 6);
    sun.target.position.set(x, y, z);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    const shadowCamera = sun.shadow.camera;
    shadowCamera.left = -reach;
    shadowCamera.right = reach;
    shadowCamera.top = reach;
    shadowCamera.bottom = -reach;
    shadowCamera.near = 0.5;
    shadowCamera.far = 40;
    shadowCamera.updateProjectionMatrix();
    return sun;
  }, [x, y, z, reach]);

  useEffect(() => () => light.dispose(), [light]);

  return (
    <>
      <primitive object={light} />
      <primitive object={light.target} />
    </>
  );
}
