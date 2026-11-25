export const avatars = { boy: '남자 아바타', girl: '여자 아바타' } as const;
export type Avatar = keyof typeof avatars;
export type AvatarDraft = { avatar: Avatar | null; nickname: string };

export const nicknameLimit = 6;
const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });

export function nicknameLength(text: string) {
  return Array.from(segmenter.segment(text)).length;
}

export function isComplete(draft: AvatarDraft) {
  return (
    draft.avatar !== null &&
    draft.nickname.trim().length > 0 &&
    nicknameLength(draft.nickname) <= nicknameLimit
  );
}

export function initialDraft(state: unknown): AvatarDraft {
  if (
    state &&
    typeof state === 'object' &&
    'avatar' in state &&
    (state.avatar === 'boy' || state.avatar === 'girl') &&
    'nickname' in state &&
    typeof state.nickname === 'string'
  ) {
    return { avatar: state.avatar, nickname: state.nickname };
  }
  return { avatar: null, nickname: '' };
}
