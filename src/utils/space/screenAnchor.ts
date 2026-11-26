/** 캔버스 기준 화면 좌표(CSS px). 화면 밖일 수도 있고, visible이 false면 카메라 뒤에 있다. */
export type ScreenPoint = { x: number; y: number; visible: boolean };

/**
 * 3D 씬이 계산한 화면 좌표를 HUD(DOM)와 나누는 작은 저장소.
 * 카메라가 움직이는 동안 매 프레임 바뀌므로 React 상태로 두지 않고, 구독한 쪽이 직접 DOM을 옮긴다.
 */
export type ScreenAnchor = {
  /** 아직 계산 전이거나 3D 씬이 없으면 null */
  get: () => ScreenPoint | null;
  set: (point: ScreenPoint | null) => void;
  subscribe: (listener: () => void) => () => void;
};

/** 0.5px보다 덜 움직였으면 같은 자리로 본다. */
function isSamePoint(a: ScreenPoint | null, b: ScreenPoint | null) {
  if (a === null || b === null) return a === b;
  return (
    a.visible === b.visible &&
    Math.abs(a.x - b.x) < 0.5 &&
    Math.abs(a.y - b.y) < 0.5
  );
}

export function createScreenAnchor(): ScreenAnchor {
  let current: ScreenPoint | null = null;
  const listeners = new Set<() => void>();
  return {
    get: () => current,
    set: (point) => {
      if (isSamePoint(current, point)) return;
      current = point;
      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
