import { signupPaths } from '@/constants/common/paths';
import type { Avatar, SignupProfile } from '@/types/Signup';

export type { Avatar };

export type AvatarDraft = { avatar: Avatar | null; nickname: string };

export const avatars = { boy: '남자 아바타', girl: '여자 아바타' } as const;
export const emptyAvatarDraft: AvatarDraft = { avatar: null, nickname: '' };
export const nicknameLimit = 6;
const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });

export function nicknameLength(text: string) {
  return Array.from(segmenter.segment(text)).length;
}

export function isComplete(draft: AvatarDraft): draft is SignupProfile {
  return (
    draft.avatar !== null &&
    draft.nickname.trim().length > 0 &&
    nicknameLength(draft.nickname) <= nicknameLimit
  );
}

export function getSignupResumePath(draft?: AvatarDraft) {
  return draft && isComplete(draft) ? signupPaths.resume : signupPaths.avatar;
}
