import type { Vector3Tuple } from 'three';

/**
 * Blender(Z-up) 좌표(m). 3D 디자이너가 넘긴 scene_data.json 값을 그대로 옮길 때 쓴다.
 * three.js 좌표로 바꿀 때는 utils/space/coordinates를 거친다.
 */
export type BlenderPoint = {
  x: number;
  y: number;
  /** 높이. 생략하면 바닥(0) */
  z?: number;
};

/** 앉을 수 있는 자리. z는 좌면 높이, rotz는 앉았을 때 바라보는 방향(도) */
export type StageSeat = {
  x: number;
  y: number;
  z: number;
  rotz: number;
};

/** 방에 들어와 처음 서는 자리(scene_data.json links[].spawn). rotz는 바라보는 방향(도) */
export type StageSpawn = {
  x: number;
  y: number;
  rotz: number;
};

/** 바닥 범위. 남서쪽 모서리(x, y)와 동서 폭(width)·남북 길이(depth) */
export type StageArea = { x: number; y: number; width: number; depth: number };

/** 방의 가장자리 방향(Blender 기준. 북쪽이 +y) */
export type StageEdge = 'north' | 'south' | 'east' | 'west';

/**
 * 걸을 수 있는 영역 격자(walk_grid/*.bin)와 그 메타데이터(scene_data.json의 areas.<이름>.grid).
 * 칸 하나가 cell(m) 크기이고, (x0, y0)가 남서쪽 모서리다.
 */
export type WalkGridSource = {
  url: string;
  x0: number;
  y0: number;
  nx: number;
  ny: number;
  cell: number;
};

/** 공간(방) GLB와 그 안의 배치 데이터 */
export type StageLayout = {
  url: string;
  area: StageArea;
  walkGrid: WalkGridSource;
  seats: Readonly<Record<string, StageSeat>>;
};

/** three.js 좌표의 배치. position은 발밑, yaw는 Y축 회전(라디안) */
export type Placement = {
  position: Vector3Tuple;
  yaw: number;
};
