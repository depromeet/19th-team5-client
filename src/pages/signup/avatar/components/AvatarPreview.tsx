import { IconArrowClockwiseOvalLine } from '@karrotmarket/react-monochrome-icon';
import { useState } from 'react';
import { Button } from '@/components/common/button';
import type { Avatar } from '@/types/Signup';
import { avatars } from '@/utils/signup/avatarDraft';
import * as styles from '../../Signup.css';

export function AvatarPreview({ avatar }: { avatar: Avatar }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <>
      <img
        className={styles.avatarPreview}
        data-flipped={flipped}
        src={`/images/signup/${avatar}.png`}
        alt={`${avatars[avatar]} 전신 미리보기`}
      />
      <Button
        variant='text'
        className={styles.rotate}
        aria-label='아바타 좌우 돌려보기'
        aria-pressed={flipped}
        onClick={() => setFlipped(!flipped)}
      >
        <IconArrowClockwiseOvalLine size={34} aria-hidden='true' />
      </Button>
    </>
  );
}
