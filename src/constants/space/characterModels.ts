import type { InterviewRole } from '@/types/interview/interview';
import type { Avatar } from '@/types/Signup';
import type { CharacterKind, CharacterModel } from '@/types/space/character';

/**
 * 캐릭터 GLB. 네 모델 모두 같은 뼈대 이름과 비율을 써서 자세·애니메이션을 함께 쓸 수 있다.
 * (면접자 여자만 무릎 보조 뼈 2개가 더 있다.)
 * TODO(에셋): 모델 하나가 17만~46만 삼각형·5~16MB라 무겁다. 경량화본을 받으면 경로만 바꾼다.
 */
export const characterModels: Record<CharacterKind, CharacterModel> = {
  'interviewee-male': { url: '/models/interviewee-male/interviewee_male.glb' },
  'interviewee-female': {
    url: '/models/interviewee-female/interviewee_female.glb',
  },
  'interviewer-male': { url: '/models/interviewer-male/interviewer_male.glb' },
  'interviewer-female': {
    url: '/models/interviewer-female/interviewer_female.glb',
    // 이 GLB만 뿌리 노드가 x −2.4에 있어서, 그대로 두면 자리에서 1.3m 옆에 그려진다.
    originOffset: [2.4, 0, 0],
  },
};

/** 참가 역할과 가입 때 고른 아바타로 캐릭터 모델을 고른다. */
export const characterKinds = {
  interviewee: { boy: 'interviewee-male', girl: 'interviewee-female' },
  interviewer: { boy: 'interviewer-male', girl: 'interviewer-female' },
} as const satisfies Record<InterviewRole, Record<Avatar, CharacterKind>>;

/** GLB 키가 3.6 유닛이라 이만큼 줄이면 2m가 된다. scene_data.json의 char.scale */
export const characterScale = 0.5555555555555556;

/** 앉으면 몸 뿌리를 좌면보다 이만큼 낮춘다(m). scene_data.json의 char.sit_drop */
export const characterSitDrop = 0.34444444444444444;

/** 벽·가구와 이만큼 떨어져서 걷는다(m). 디자이너 README의 걷기 격자 침식 반경 */
export const characterRadius = 0.4;

/** 스케일을 맞춘 캐릭터 키(m). 앉아도 상체는 그대로라 몸 뿌리에서 머리 꼭대기까지 이 높이다. */
export const characterHeight = 2;

/** 몸 뿌리에서 눈까지의 높이(m). 1인칭 카메라를 둔다. 디자이너 웹 시뮬레이션 값 */
export const characterEyeHeight = 1.5;
