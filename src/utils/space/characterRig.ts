import { Bone, MathUtils, type Object3D, Quaternion, Vector3 } from 'three';

/**
 * 자세를 바꿀 때 쓰는 뼈 이름. 네 캐릭터 모두 같은 이름을 쓴다.
 * GLTFLoader가 이름의 점을 지워서 Blender의 thigh.L이 thighL이 된다.
 */
export type RigBone =
  | 'thighL'
  | 'thighR'
  | 'shinL'
  | 'shinR'
  | 'upper_armL'
  | 'upper_armR'
  | 'forearmL'
  | 'forearmR';

/** 뼈마다 돌릴 각도(도). 캐릭터의 좌우축(모델 X축)을 기준으로 돌린다. */
export type RigPose = Partial<Record<RigBone, number>>;

type RigJoint = {
  bone: Bone;
  /** 기본 자세의 회전 */
  rest: Quaternion;
  /** 캐릭터 좌우축을 이 뼈 기준으로 바꾼 축 */
  axis: Vector3;
};

/** 캐릭터 한 명의 뼈와 기본 자세. 모델을 복제할 때마다 따로 만든다. */
export type CharacterRig = ReadonlyMap<string, RigJoint>;

/**
 * 뼈마다 기본 자세와 캐릭터 좌우축을 기억해 둔다.
 * 팔처럼 기본 자세가 기울어진 뼈도 캐릭터 기준으로 앞뒤로 돌릴 수 있게 축을 뼈 기준으로 바꿔 둔다.
 */
export function createCharacterRig(model: Object3D): CharacterRig {
  model.updateMatrixWorld(true);
  const toModel = model.getWorldQuaternion(new Quaternion()).invert();
  const rig = new Map<string, RigJoint>();
  model.traverse((object) => {
    if (!(object instanceof Bone)) return;
    const inModel = toModel
      .clone()
      .multiply(object.getWorldQuaternion(new Quaternion()));
    rig.set(object.name, {
      bone: object,
      rest: object.quaternion.clone(),
      axis: new Vector3(1, 0, 0).applyQuaternion(inModel.invert()).normalize(),
    });
  });
  return rig;
}

const turn = new Quaternion();

/** 모든 뼈를 기본 자세로 되돌린 뒤 pose의 각도만큼 돌린다. */
export function setPose(rig: CharacterRig, pose: RigPose) {
  for (const joint of rig.values()) joint.bone.quaternion.copy(joint.rest);
  for (const [name, degrees] of Object.entries(pose)) {
    const joint = rig.get(name);
    if (!joint || degrees === undefined) continue;
    turn.setFromAxisAngle(joint.axis, MathUtils.degToRad(degrees));
    joint.bone.quaternion.multiply(turn);
  }
}

/**
 * 앉은 자세. 허벅지를 앞으로 88° 들고 정강이를 80° 내린다(디자이너 README).
 * 팔은 내린 채로 둔다. 무릎 위에 올리면, 머리가 큰 캐릭터를 위에서 내려다보는 카메라에서는
 * 손이 턱에 붙은 것처럼 보인다.
 */
export const sitPose: RigPose = {
  thighL: -88,
  thighR: -88,
  shinL: 80,
  shinR: 80,
};

/**
 * 걷는 자세. phase는 걸음 위상(라디안), amount는 0(서 있음)부터 1(걷는 중)까지다.
 * 다리와 팔을 반대로 흔든다(디자이너 웹 시뮬레이션 값).
 */
export function walkPose(phase: number, amount: number): RigPose {
  const swing = Math.sin(phase) * amount;
  return {
    thighL: -swing * 30,
    thighR: swing * 30,
    shinL: Math.max(0, swing) * 38,
    shinR: Math.max(0, -swing) * 38,
    upper_armL: swing * 24,
    upper_armR: -swing * 24,
    forearmL: -10 * amount,
    forearmR: -10 * amount,
  };
}
