import { useCallback, useEffect, useEffectEvent, useRef } from 'react';

/** 이동 키(KeyboardEvent.code)와 화면 기준 방향. x는 오른쪽, y는 위쪽(화면 안쪽)이 +다. */
const directionKeys = {
  ArrowUp: [0, 1],
  KeyW: [0, 1],
  ArrowDown: [0, -1],
  KeyS: [0, -1],
  ArrowLeft: [-1, 0],
  KeyA: [-1, 0],
  ArrowRight: [1, 0],
  KeyD: [1, 0],
} as const satisfies Record<string, readonly [number, number]>;

type DirectionKey = keyof typeof directionKeys;

/** 방향키를 스스로 쓰는 요소에 포커스가 있으면 키 입력을 그 요소에 양보한다. */
const arrowKeyTarget = [
  'input',
  'textarea',
  'select',
  '[contenteditable]:not([contenteditable="false"])',
  '[role="slider"]',
  '[role="tab"]',
  '[role="radio"]',
  '[role="option"]',
  '[role="menuitem"]',
].join(', ');

function isDirectionKey(code: string): code is DirectionKey {
  return Object.hasOwn(directionKeys, code);
}

export type MovementInput = { x: number; y: number };

/**
 * 눌린 이동 키(방향키·WASD)를 모아 화면 기준 방향으로 알려준다.
 * 매 프레임 읽으므로 상태 대신 ref에 모으고, 키를 처음 누를 때 onPress로 알린다.
 * enabled가 false가 되거나 창이 포커스를 잃으면 눌린 키를 모두 놓은 것으로 본다.
 */
export function useMovementKeys(enabled: boolean, onPress: () => void) {
  const pressed = useRef(new Set<DirectionKey>());
  const press = useEffectEvent(onPress);

  useEffect(() => {
    const keys = pressed.current;
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (!isDirectionKey(event.code) || event.isComposing) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (
        event.target instanceof Element &&
        event.target.closest(arrowKeyTarget)
      ) {
        return;
      }
      event.preventDefault();
      keys.add(event.code);
      press();
    }
    function handleKeyUp(event: KeyboardEvent) {
      if (isDirectionKey(event.code)) keys.delete(event.code);
    }
    function releaseAll() {
      keys.clear();
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', releaseAll);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', releaseAll);
      keys.clear();
    };
  }, [enabled]);

  /** 지금 눌린 키가 가리키는 방향. 반대 방향 키를 함께 누르면 서로 지운다. */
  return useCallback((): MovementInput => {
    let x = 0;
    let y = 0;
    for (const code of pressed.current) {
      const [dx, dy] = directionKeys[code];
      x += dx;
      y += dy;
    }
    return { x: Math.sign(x), y: Math.sign(y) };
  }, []);
}
