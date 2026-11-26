import {
  type ReactNode,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react';
import type { ScreenAnchor } from '@/utils/space/screenAnchor';
import * as styles from './screenAnchored.css';

/** 화면 가장자리에서 띄울 거리(px). 다른 HUD와 겹치지 않게 비워 둘 영역이다. */
export type ScreenInset = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const noInset: ScreenInset = { top: 0, right: 0, bottom: 0, left: 0 };

type ScreenAnchoredProps = {
  /** 3D 씬이 알려주는 화면 좌표 */
  anchor: ScreenAnchor;
  /** 아직 좌표를 받지 못했을 때(씬을 불러오는 중이거나 3D를 쓸 수 없을 때) 쓸 위치 */
  fallbackClassName: string;
  /** 좌표에서 위로 띄울 거리(px) */
  gap?: number;
  /** 이 영역 안에서만 움직인다. 좌표가 화면 가장자리를 넘으면 가장자리에 붙어 방향을 알려준다. */
  inset?: ScreenInset;
  children: ReactNode;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/**
 * 3D 씬 속 지점(예: 캐릭터 머리 꼭대기) 바로 위에 HUD를 띄운다. 가운데 아래가 그 지점 gap 위에 온다.
 * 카메라가 움직이는 동안 좌표가 매 프레임 바뀌어서, React를 다시 그리지 않고 transform만 직접 옮긴다.
 * 지점이 화면 밖으로 나가도 가장자리에 붙여 계속 보이고, 카메라 뒤로 가면 숨긴다.
 */
export function ScreenAnchored({
  anchor,
  fallbackClassName,
  gap = 24,
  inset = noInset,
  children,
}: ScreenAnchoredProps) {
  const element = useRef<HTMLDivElement>(null);
  const isAnchored = useSyncExternalStore(
    anchor.subscribe,
    () => anchor.get() !== null,
  );

  useLayoutEffect(() => {
    const node = element.current;
    if (!node) return;
    function place(target: HTMLDivElement) {
      const point = anchor.get();
      const layer = target.parentElement;
      if (!point || !layer) {
        target.style.removeProperty('transform');
        target.style.removeProperty('visibility');
        return;
      }
      const halfWidth = target.offsetWidth / 2;
      const x = clamp(
        point.x,
        inset.left + halfWidth,
        layer.clientWidth - inset.right - halfWidth,
      );
      // 요소의 아래 가장자리 위치. 위로 gap만큼 띄운 뒤 요소 높이만큼 올라간다.
      const bottom = clamp(
        point.y - gap,
        inset.top + target.offsetHeight,
        layer.clientHeight - inset.bottom,
      );
      target.style.transform = `translate(${x}px, ${bottom}px) translate(-50%, -100%)`;
      target.style.visibility = point.visible ? 'visible' : 'hidden';
    }
    place(node);
    return anchor.subscribe(() => place(node));
  }, [anchor, gap, inset]);

  return (
    <div
      ref={element}
      className={isAnchored ? styles.anchored : fallbackClassName}
    >
      {children}
    </div>
  );
}
