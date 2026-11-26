import { useThree } from '@react-three/fiber';
import { useLayoutEffect } from 'react';
import { Box3, Mesh } from 'three';
import { useSpaceGltf } from '@/hooks/space/useSpaceGltf';
import type { StageArea, StageEdge } from '@/types/space/stage';

/** 가장자리에서 이 거리(m) 안에 통째로 들어오는 물체를 그 가장자리의 벽으로 본다. */
const edgeBand = 0.5;

type StageCutaway = {
  /** 방 바닥 범위(Blender 좌표) */
  area: StageArea;
  /** 걷어 낼 가장자리. 카메라 쪽 벽을 걷어 내면 방 밖에서도 안이 보인다. */
  edges: readonly StageEdge[];
};

type StageModelProps = {
  /** 공간(방) GLB 주소 */
  url: string;
  /** 천장을 보일지. 위에서 내려다보는 3인칭에서는 숨기고, 1인칭(면접 의자)에서만 보인다. */
  showCeiling?: boolean;
  /** 카메라 쪽 벽과 거기 붙은 물체(창틀·문·액자 등)를 숨겨 단면처럼 보이게 한다. */
  cutaway?: StageCutaway;
};

/** 물체가 가장자리 띠 안에 통째로 들어오는지. three.js 좌표는 x = Blender x, z = −Blender y다. */
function liesOnEdge(box: Box3, area: StageArea, edge: StageEdge) {
  switch (edge) {
    case 'west':
      return box.max.x <= area.x + edgeBand;
    case 'east':
      return box.min.x >= area.x + area.width - edgeBand;
    case 'south':
      return box.min.z >= -(area.y + edgeBand);
    case 'north':
      return box.max.z <= -(area.y + area.depth - edgeBand);
  }
}

/**
 * 공간(방) GLB를 그린다. 디자이너가 천장 오브젝트에 rt_ceiling 속성을 붙여 두었다.
 * 같은 공간을 두 곳에 동시에 그리지 않아서, 불러온 장면을 복제하지 않고 그대로 쓴다.
 */
export function StageModel({
  url,
  showCeiling = false,
  cutaway,
}: StageModelProps) {
  const { scene } = useSpaceGltf(url);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    scene.updateMatrixWorld(true);
    const box = new Box3();
    scene.traverse((object) => {
      if (object.userData.rt_ceiling) {
        object.visible = showCeiling;
        return;
      }
      if (!(object instanceof Mesh)) return;
      box.setFromObject(object);
      object.visible = !cutaway?.edges.some((edge) =>
        liesOnEdge(box, cutaway.area, edge),
      );
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      // 유리처럼 비치는 재질은 그림자를 만들지 않는다. 창가 바닥이 어두워지지 않게 한다.
      object.castShadow = materials.every((material) => !material.transparent);
      object.receiveShadow = true;
    });
    invalidate();
  }, [scene, showCeiling, cutaway, invalidate]);

  return <primitive object={scene} />;
}
