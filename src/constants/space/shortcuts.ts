/**
 * 3D 공간의 단축키. code는 KeyboardEvent.code, label은 화면에 보이는 키 이름이다.
 * 3D 시안 전에는 상호작용 범위 판정 없이 단축키만으로 상호작용을 실행한다.
 */
export const shortcuts = {
  interact: { code: 'Space', label: 'Space' },
  questionSheet: { code: 'KeyQ', label: 'Q' },
} as const;

export type Shortcut = (typeof shortcuts)[keyof typeof shortcuts];
