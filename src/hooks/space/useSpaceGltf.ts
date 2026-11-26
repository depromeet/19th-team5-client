import { useLoader } from '@react-three/fiber';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/** 웹용 압축본(EXT_meshopt_compression) GLB도 풀 수 있게 디코더를 붙인다. */
function withMeshoptDecoder(loader: GLTFLoader) {
  loader.setMeshoptDecoder(MeshoptDecoder);
}

/**
 * 공간·캐릭터 GLB를 불러온다. 같은 주소는 한 번만 내려받고 결과를 함께 쓴다.
 * 불러오는 동안 컴포넌트를 멈추므로(suspend) Suspense 안에서 쓴다.
 */
export function useSpaceGltf(url: string) {
  return useLoader(GLTFLoader, url, withMeshoptDecoder);
}
