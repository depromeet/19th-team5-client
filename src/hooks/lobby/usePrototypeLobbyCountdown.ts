import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { interviewPaths } from '@/constants/common/paths';
import { mockCountdowns } from '@/mocks/interview/interview';
import { useMockCountdown } from '@/mocks/interview/useMockCountdown';
import type {
  InterviewPhase,
  InterviewRole,
} from '@/types/interview/interview';

export function usePrototypeLobbyCountdown(
  role: InterviewRole,
  phase: InterviewPhase,
) {
  const navigate = useNavigate();
  const isPreparing = phase === 'prepare';
  const { interviewerUntilOpen, untilOpen, untilStart } = mockCountdowns;
  const preparationSeconds =
    role === 'interviewer' ? interviewerUntilOpen : untilOpen;
  const remainingSeconds = useMockCountdown(
    isPreparing ? `${role}-until-open` : 'until-start',
    isPreparing ? preparationSeconds : untilStart,
  );
  const secondsUntilStart = isPreparing
    ? remainingSeconds + untilStart
    : remainingSeconds;
  const progress = 1 - secondsUntilStart / (preparationSeconds + untilStart);

  const isWaitingRoomDue = isPreparing && remainingSeconds === 0;
  useEffect(() => {
    if (!isWaitingRoomDue) return;
    navigate(interviewPaths.lobby({ role, phase: 'open' }), { replace: true });
  }, [isWaitingRoomDue, navigate, role]);

  return { remainingSeconds, progress };
}
