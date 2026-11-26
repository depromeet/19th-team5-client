import type { Vector3Tuple } from 'three';

/** 캐릭터 모델 종류. 참가 역할(면접자·면접관)과 아바타(남·여)로 정해진다. */
export type CharacterKind =
  | 'interviewee-male'
  | 'interviewee-female'
  | 'interviewer-male'
  | 'interviewer-female';

export type CharacterPose = 'stand' | 'sit';

export type CharacterModel = {
  url: string;
  /**
   * GLB 원점이 발밑에서 벗어나 있을 때 되돌리는 값(모델 단위, 스케일 전).
   * 디자이너가 원점을 고쳐 다시 내보내면 지운다.
   */
  originOffset?: Vector3Tuple;
};
