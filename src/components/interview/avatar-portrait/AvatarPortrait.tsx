import { type PortraitVariants, portrait } from './avatarPortrait.css';

type AvatarPortraitProps = PortraitVariants & { className?: string };

/** 아바타 얼굴. 프로토타입은 정장 캐릭터 한 종류만 쓴다. */
export function AvatarPortrait({ size, className }: AvatarPortraitProps) {
  return (
    <span
      className={[portrait({ size }), className].filter(Boolean).join(' ')}
      aria-hidden='true'
    />
  );
}
