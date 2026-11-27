import type {
  InterviewPhase,
  InterviewRole,
} from '@/types/interview/interview';

export const interviewPaths = {
  lobby: (params: { role: InterviewRole; phase: InterviewPhase }) =>
    `/lobby?${new URLSearchParams(params)}`,
  waitingRoom: (interviewId: string, params: { role: InterviewRole }) =>
    `/interviews/${interviewId}/waiting-room?${new URLSearchParams(params)}`,
  interviewRoom: (interviewId: string, params: { role: InterviewRole }) =>
    `/interviews/${encodeURIComponent(interviewId)}/interview-room?${new URLSearchParams(params)}`,
  /** 면접이 끝난 뒤 돌아가는 로비 */
  lobbyHome: '/lobby',
  /** 면접관이 면접자를 평가하는 화면 */
  writeReview: '/write-review',
  /** 면접자가 면접관에게 받은 평가(결과)를 보는 화면 */
  receivedReview: '/received-review',
};

export const signupPaths = {
  account: '/signup',
  avatar: '/signup/avatar',
  resumeGuide: '/signup/resume-guide',
  resume: '/signup/resume',
  pass: '/signup/pass',
} as const;

export const reservationPaths = {
  rooms: '/reservations',
  request: '/reservations/request',
  room: (id: string) => `/reservations/rooms/${encodeURIComponent(id)}`,
  questionSheet: (roomId: string) =>
    `/lobby?${new URLSearchParams({ questionSheet: roomId })}`,
  mine: '/reservations/mine',
  notifications: '/notifications',
} as const;
