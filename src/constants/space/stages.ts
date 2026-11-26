import type {
  BlenderPoint,
  StageLayout,
  StageSeat,
  StageSpawn,
} from '@/types/space/stage';

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

/**
 * 면접실 A(interview_01_A, 오크 슬랫 벽). 면접자 의자 2개가 동쪽 면접관 테이블을 마주 본다.
 * 좌표는 scene_data.json(areas.interview_01_A · links의 「면접실 01」 spawn)을 Blender 좌표 그대로 옮겼다.
 * 디자이너 웹 시뮬레이션도 면접 순서가 되면 이 방으로 들어간다. 이 방은 월드 x 132~142에 있다.
 */
export const interview01AStage = {
  url: '/models/MOING_interview_center/glb_web_compressed/interview_01_A.glb',
  area: { x: 132, y: 0, width: 10, depth: 9.5 },
  walkGrid: {
    url: '/models/MOING_interview_center/data/walk_grid/grid_interview_01_A.bin',
    x0: 132,
    y0: 0,
    nx: 100,
    ny: 95,
    cell: 0.1,
  },
  seats: {
    Seat_Candidate_L: { x: 136.325, y: 3.9, z: 0.5, rotz: 90 },
    Seat_Candidate_R: { x: 136.325, y: 5.6, z: 0.5, rotz: 90 },
    Seat_Interviewer_L: { x: 140.73, y: 3.9, z: 0.535, rotz: -90 },
    Seat_Interviewer_R: { x: 140.73, y: 5.6, z: 0.535, rotz: -90 },
  },
  /** 남쪽 문으로 들어와 서는 자리. 방 안쪽(북쪽)을 본다. */
  spawn: { x: 137, y: 1.2, rotz: 180 },
} as const satisfies StageLayout & { spawn: StageSpawn };
