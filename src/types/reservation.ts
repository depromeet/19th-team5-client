import type { InterviewRole } from '@/types/interview/interview';

export type InterviewRoom = {
  id: string;
  title: string;
  startsAt: number;
  source: 'requested' | 'admin';
  openedRequestId?: string;
  job: string;
  seats: Record<InterviewRole, number>;
};

export type Reservation = { roomId: string; role: InterviewRole };

export type RoomRequestDraft = {
  title: string;
  hour: number | null;
  job: string;
  reason: string;
};

export type RoomRequest = RoomRequestDraft & {
  id: string;
  submittedAt: number;
};
