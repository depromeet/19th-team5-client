import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { FileLoader } from 'three';
import type { WalkGridSource } from '@/types/space/stage';
import { createWalkGrid } from '@/utils/space/walkGrid';

function asArrayBuffer(loader: FileLoader<unknown>) {
  loader.setResponseType('arraybuffer');
}

/**
 * 공간의 걷기 격자를 불러와 캐릭터 반경만큼 벽·가구에서 떨어뜨린다.
 * 불러오는 동안 컴포넌트를 멈추므로(suspend) Suspense 안에서 쓴다.
 */
export function useWalkGrid(source: WalkGridSource, radius: number) {
  const data = useLoader(FileLoader, source.url, asArrayBuffer);
  return useMemo(() => {
    if (!(data instanceof ArrayBuffer)) {
      throw new Error(`걷기 격자를 바이너리로 읽지 못했어요: ${source.url}`);
    }
    return createWalkGrid(data, source, radius);
  }, [data, source, radius]);
}
