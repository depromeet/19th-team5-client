import { useThree } from '@react-three/fiber';
import { useLayoutEffect } from 'react';
import { characterScale } from '@/constants/space/characterModels';
import { useCharacterModel } from '@/hooks/space/useCharacterModel';
import type { CharacterKind, CharacterPose } from '@/types/space/character';
import type { Placement } from '@/types/space/stage';
import { setPose, sitPose } from '@/utils/space/characterRig';

type CharacterProps = {
  kind: CharacterKind;
  /** 발밑 위치와 바라보는 방향(three.js 좌표) */
  placement: Placement;
  pose?: CharacterPose;
};

/**
 * 제자리에 있는 면접자·면접관 캐릭터(NPC, 다른 참가자). 모델 키 3.6 유닛을 2m로 줄여 그린다.
 * 내가 조작하는 캐릭터는 PlayerCharacter를 쓴다.
 */
export function Character({ kind, placement, pose = 'stand' }: CharacterProps) {
  const { model, rig, originOffset } = useCharacterModel(kind);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    setPose(rig, pose === 'sit' ? sitPose : {});
    invalidate();
  }, [rig, pose, invalidate]);

  return (
    <group position={placement.position} rotation-y={placement.yaw}>
      <group scale={characterScale}>
        <primitive object={model} position={originOffset} />
      </group>
    </group>
  );
}
