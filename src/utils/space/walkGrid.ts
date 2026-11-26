import type { WalkGridSource } from '@/types/space/stage';

/** 걸을 수 있는 칸이 1인 격자. 행 우선이고 j = 0이 남쪽 줄이다. */
export type WalkGrid = Omit<WalkGridSource, 'url'> & { cells: Uint8Array };

/** 반지름 radius(칸) 원 안의 칸 오프셋 */
function circleOffsets(radius: number) {
  const offsets: [number, number][] = [];
  for (let dj = -radius; dj <= radius; dj += 1) {
    for (let di = -radius; di <= radius; di += 1) {
      if (di * di + dj * dj <= radius * radius) offsets.push([di, dj]);
    }
  }
  return offsets;
}

/**
 * 걷기 격자(.bin, 1바이트/칸, 1 = 걸을 수 있음)를 읽고, 캐릭터 반경만큼 벽·가구에서 떨어뜨린다.
 * 원본은 가구·벽 그대로라서, 그대로 쓰면 캐릭터 몸이 가구에 파묻힌다.
 */
export function createWalkGrid(
  buffer: ArrayBuffer,
  { x0, y0, nx, ny, cell }: Omit<WalkGridSource, 'url'>,
  radius: number,
): WalkGrid {
  const source = new Uint8Array(buffer);
  if (source.length !== nx * ny) {
    throw new Error(
      `걷기 격자 크기가 맞지 않아요: ${source.length}바이트, 기대값 ${nx * ny}`,
    );
  }
  const offsets = circleOffsets(Math.round(radius / cell));
  const isOpen = (i: number, j: number) =>
    i >= 0 && j >= 0 && i < nx && j < ny && source[j * nx + i] === 1;
  const cells = new Uint8Array(nx * ny);
  for (let j = 0; j < ny; j += 1) {
    for (let i = 0; i < nx; i += 1) {
      const clear = offsets.every(([di, dj]) => isOpen(i + di, j + dj));
      cells[j * nx + i] = clear ? 1 : 0;
    }
  }
  return { x0, y0, nx, ny, cell, cells };
}

/** Blender 좌표 (x, y)에 설 수 있는지 */
export function isWalkable(grid: WalkGrid, x: number, y: number) {
  const i = Math.floor((x - grid.x0) / grid.cell);
  const j = Math.floor((y - grid.y0) / grid.cell);
  if (i < 0 || j < 0 || i >= grid.nx || j >= grid.ny) return false;
  return grid.cells[j * grid.nx + i] === 1;
}
