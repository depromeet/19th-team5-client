import { useEffect, useEffectEvent } from 'react';
import type { Shortcut } from '@/constants/space/shortcuts';

/** 포커스가 이 요소들 안에 있으면 키 입력을 그 요소에 양보한다. */
const interactiveTarget = [
  'input',
  'textarea',
  'select',
  'button',
  'a[href]',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[role="button"]',
].join(', ');

/**
 * 3D 공간의 단축키를 연결한다. 다이얼로그·시트가 열려 있을 때는 enabled를 false로 넘긴다.
 * 3D 씬이 생겨도 상호작용 범위 판정만 씬이 맡고, 키 처리는 이 훅을 그대로 쓴다.
 */
export function useKeyboardShortcut(
  shortcut: Shortcut,
  onPress: () => void,
  enabled: boolean,
) {
  const press = useEffectEvent(onPress);

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== shortcut.code) return;
      if (event.repeat || event.defaultPrevented || event.isComposing) return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }
      if (
        event.target instanceof Element &&
        event.target.closest(interactiveTarget)
      ) {
        return;
      }
      event.preventDefault();
      press();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, shortcut.code]);
}
