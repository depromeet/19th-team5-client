import type { ComponentPropsWithRef } from 'react';
import type { Shortcut } from '@/constants/space/shortcuts';
import { Keycap } from '../keycap/Keycap';
import * as styles from './interactionPrompt.css';

type InteractionPromptProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'type'
> & {
  shortcut: Shortcut;
  /** 동사형 문구 한 줄. 예) 김대리에게 말 걸기 */
  label: string;
};

/**
 * 상호작용 범위 안에 들어왔을 때 보이는 안내. 3D 씬이 생기면 캐릭터 머리 위 24px에 띄운다.
 * 단축키를 못 쓰는 환경을 위해 버튼으로 두고, 누르면 같은 상호작용을 실행한다.
 */
export function InteractionPrompt({
  shortcut,
  label,
  className,
  ...props
}: InteractionPromptProps) {
  return (
    <button
      type='button'
      className={[styles.prompt, className].filter(Boolean).join(' ')}
      aria-keyshortcuts={shortcut.label}
      {...props}
    >
      {/* 공백은 화면에 보이지 않고, 스크린 리더가 "Space 김대리에게 말 걸기"로 읽게 한다. */}
      <Keycap>{shortcut.label}</Keycap> {label}
    </button>
  );
}
