import type {
  InterviewPhase,
  InterviewRole,
} from '@/types/interview/interview';

export const interviewPaths = {
  lobby: (params: { role: InterviewRole; phase: InterviewPhase }) =>
    `/lobby?${new URLSearchParams(params)}`,
  waitingRoom: (interviewId: string, params: { role: InterviewRole }) =>
    `/interviews/${interviewId}/waiting-room?${new URLSearchParams(params)}`,
};

export const reservationPaths = {
  rooms: '/reservations',
  request: '/reservations/request',
  room: (id: string) => `/reservations/rooms/${encodeURIComponent(id)}`,
  mine: '/reservations/mine',
  notifications: '/notifications',
} as const;
