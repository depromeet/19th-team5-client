import type { BlenderPoint, StageLayout, StageSeat } from '@/types/space/stage';

/**
 * 면접자 대기실 01(cand_wait_01). 면접 시작 전 면접자·면접관이 함께 쓰는 대기실로 쓴다.
 * 좌표는 3D 디자이너가 넘긴 scene_data.json(areas.cand_wait_01 · npcs · hr)을 Blender 좌표 그대로 옮겼다.
 * 이 방은 월드 x 92~103.5에 있다. GLB를 옮기지 않고 그대로 그려야 좌표가 맞는다.
 */
export const candWait01Stage = {
  url: '/models/MOING_interview_center/glb_web_compressed/cand_wait_01.glb',
  area: { x: 92, y: 0, width: 11.5, depth: 9 },
  walkGrid: {
    url: '/models/MOING_interview_center/data/walk_grid/grid_cand_wait_01.bin',
    x0: 92,
    y0: 0,
    nx: 115,
    ny: 90,
    cell: 0.1,
  },
  seats: {
    Seat_Lounge_1: { x: 93.75, y: 4, z: 0.53, rotz: 50.389 },
    Seat_Lounge_2: { x: 96.65, y: 4, z: 0.53, rotz: -50.389 },
    Seat_Lounge_4: { x: 96.65, y: 1.6, z: 0.53, rotz: -129.611 },
    Seat_Puffy_1: { x: 97.75, y: 3.25, z: 0.53, rotz: 90 },
    Seat_Puffy_2: { x: 102.65, y: 3.25, z: 0.53, rotz: -90 },
    Seat_Sofa_1: { x: 99.45, y: 0.95, z: 0.59, rotz: -180 },
    Seat_Sofa_2: { x: 100.2, y: 0.95, z: 0.59, rotz: -180 },
    Seat_Sofa_3: { x: 100.95, y: 0.95, z: 0.59, rotz: -180 },
  },
  /** 인사팀 테이블. 직원 자리(npcs의 NPC_KimDaeri)와 그 앞에서 말을 거는 자리(hr) */
  hrDesk: {
    staffSeat: { x: 102.59, y: 6, z: 0.515, rotz: -90 },
    visitorSpot: { x: 100.4, y: 6 },
  },
} as const satisfies StageLayout & {
  hrDesk: { staffSeat: StageSeat; visitorSpot: BlenderPoint };
};
