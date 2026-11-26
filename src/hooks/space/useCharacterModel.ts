import { useMemo } from 'react';
import { Mesh, MeshPhysicalMaterial, type Object3D } from 'three';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import { characterModels } from '@/constants/space/characterModels';
import { useSpaceGltf } from '@/hooks/space/useSpaceGltf';
import type { CharacterKind } from '@/types/space/character';
import { createCharacterRig } from '@/utils/space/characterRig';

/** three.js에서 Blender 미리보기와 비슷하게 보이도록 그림자와 재질을 맞춘다. */
function prepareModel(model: Object3D) {
  model.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.castShadow = true;
    object.receiveShadow = true;
    // 자세를 바꾸면 기본 자세로 계산한 경계가 맞지 않아, 화면 가장자리에서 잘려 보일 수 있다.
    object.frustumCulled = false;
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    for (const material of materials) {
      // 면접관 GLB에 들어 있는 흰색 sheen(1.0)은 three.js에서 정장을 하얗게 띄운다.
      // 같은 GLB의 복제본끼리 재질을 함께 쓰지만, 값이 늘 0이라 여러 번 적용해도 같다.
      if (material instanceof MeshPhysicalMaterial) material.sheen = 0;
    }
  });
}

/**
 * 캐릭터 GLB를 뼈대째 복제하고, 자세를 바꿀 수 있는 rig를 함께 만든다.
 * 같은 모델을 여러 명이 써도 GLB는 한 번만 받고, 복제본마다 따로 움직인다.
 */
export function useCharacterModel(kind: CharacterKind) {
  const { url, originOffset = [0, 0, 0] } = characterModels[kind];
  const { scene } = useSpaceGltf(url);
  const { model, rig } = useMemo(() => {
    const copy = cloneSkinned(scene);
    prepareModel(copy);
    return { model: copy, rig: createCharacterRig(copy) };
  }, [scene]);
  return { model, rig, originOffset };
}
