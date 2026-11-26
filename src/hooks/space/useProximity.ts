import { useFrame } from '@react-three/fiber';
import { type RefObject, useEffect, useRef } from 'react';
import type { Object3D } from 'three';

type ProximityOptions = {
  /** 거리를 잴 대상(보통 내 캐릭터) */
  target: RefObject<Object3D | null>;
  /** 기준점(three.js 바닥 좌표 x, z) */
  point: readonly [number, number];
  /** 이 거리(m) 안으로 들어오면 가깝다고 본다. */
  enter: number;
  /** 가까워진 뒤에는 이 거리(m)를 벗어나야 멀어졌다고 본다. 경계에서 안내가 깜박이지 않게 enter보다 크게 둔다. */
  exit: number;
  /** 가까워지거나 멀어질 때만 부른다. */
  onChange: (isNear: boolean) => void;
};

/**
 * 대상이 기준점에 가까운지 프레임마다 재고, 바뀔 때만 알린다.
 * 화면을 새로 그릴 때만 재므로, 캐릭터가 멈춰 있으면 계산도 멈춘다.
 */
export function useProximity({
  target,
  point,
  enter,
  exit,
  onChange,
}: ProximityOptions) {
  const isNear = useRef<boolean | null>(null);
  const latestOnChange = useRef(onChange);

  useEffect(() => {
    latestOnChange.current = onChange;
  }, [onChange]);

  useFrame(() => {
    const object = target.current;
    if (!object) return;
    const distance = Math.hypot(
      object.position.x - point[0],
      object.position.z - point[1],
    );
    const next = isNear.current ? distance <= exit : distance <= enter;
    if (next === isNear.current) return;
    isNear.current = next;
    latestOnChange.current(next);
  });
}
