import { useState } from 'react';
import { interviewParts } from '@/constants/interview-room/parts';
import { useNow } from '@/hooks/common/useNow';
import type { InterviewRole } from '@/types/interview/interview';
import type {
  InterviewPart,
  InterviewRoomStage,
} from '@/types/interview-room/interviewRoom';
import type { ReceivedQuestion } from '@/types/interview-room/question';
import { isInterviewPart } from '@/utils/interview-room/stage';
import { secondsBetween } from '@/utils/time';
import { receivedQuestions } from './questions';
import { mockSchedule } from './schedule';

type StageEntry = { stage: InterviewRoomStage; startedAt: number };

const stageOrder = [
  'seating',
  ...interviewParts,
  'finished',
] as const satisfies readonly InterviewRoomStage[];

function getNextStage(stage: InterviewRoomStage): InterviewRoomStage {
  return stageOrder[stageOrder.indexOf(stage) + 1] ?? 'finished';
}

function getStageSeconds(stage: InterviewRoomStage) {
  if (stage === 'seating') return mockSchedule.seatingSeconds;
  if (stage === 'finished') return Number.POSITIVE_INFINITY;
  return mockSchedule.partSeconds[stage];
}

/** 시간이 다 된 단계는 끝난 시각에 다음 단계로 넘긴다. 탭이 한동안 멈췄다 돌아와도 순서대로 따라잡는다. */
function resolveStage(entry: StageEntry, now: number): StageEntry {
  let current = entry;
  while (current.stage !== 'finished') {
    const endsAt = current.startedAt + getStageSeconds(current.stage) * 1000;
    if (now < endsAt) break;
    current = { stage: getNextStage(current.stage), startedAt: endsAt };
  }
  return current;
}

/** 지금 부의 남은 시간에 뒤에 남은 부의 시간을 더한다. 2부를 건너뛰면 그만큼 줄어든다. */
function getTotalRemainingSeconds(
  stage: InterviewRoomStage,
  remainingSeconds: number,
) {
  if (stage === 'finished') return 0;
  const laterParts: readonly InterviewPart[] =
    stage === 'seating'
      ? interviewParts
      : interviewParts.slice(interviewParts.indexOf(stage) + 1);
  const laterSeconds = laterParts.reduce(
    (sum, part) => sum + mockSchedule.partSeconds[part],
    0,
  );
  return stage === 'seating' ? laterSeconds : remainingSeconds + laterSeconds;
}

/**
 * 프로토타입 면접 진행. 실시간 서버 대신 정해 둔 시간표대로 단계를 넘긴다.
 * 사용자가 한 명뿐이라 다른 참가자를 기다리지 않는다. 면접자는 앉자마자 1부를 시작하고,
 * 면접관은 미리 앉아 있다고 보고 들어오자마자 1부를 시작한다.
 * API가 생기면 같은 모양을 돌려주는 실시간 훅으로 바꾼다.
 */
export function useMockInterviewSession(role: InterviewRole) {
  const [entry, setEntry] = useState<StageEntry>(() => ({
    stage: role === 'interviewer' ? 'common' : 'seating',
    startedAt: Date.now(),
  }));
  const now = useNow(entry.stage !== 'finished');
  const { stage, startedAt } = resolveStage(entry, now);
  const elapsedSeconds = secondsBetween(startedAt, now);
  const remainingSeconds =
    stage === 'finished'
      ? 0
      : Math.max(0, getStageSeconds(stage) - elapsedSeconds);
  // 면접관이 질문을 고르는 동안을 흉내 내어, 부가 시작되고 조금 뒤에 질문을 띄운다.
  const receivedQuestion: ReceivedQuestion | null =
    role === 'interviewee' &&
    isInterviewPart(stage) &&
    elapsedSeconds >= mockSchedule.questionDelaySeconds
      ? receivedQuestions[stage]
      : null;

  function moveTo(next: InterviewRoomStage) {
    setEntry({ stage: next, startedAt: Date.now() });
  }

  return {
    stage,
    /** 지금 단계가 시작된 뒤 흐른 시간(초) */
    elapsedSeconds,
    /** 지금 단계의 남은 시간(초) */
    remainingSeconds,
    /** 면접이 끝날 때까지 남은 시간(초) */
    totalRemainingSeconds: getTotalRemainingSeconds(stage, remainingSeconds),
    partSeconds: mockSchedule.partSeconds,
    /** 정해진 시간 안에 앉지 않아 자동으로 앉았는지 */
    isAutoSeated: entry.stage === 'seating' && stage !== 'seating',
    receivedQuestion,
    /** 자리에 앉고 1부를 시작한다. */
    sit: () => {
      if (stage === 'seating') moveTo('common');
    },
    /** 2부를 건너뛰고 3부를 시작한다. */
    skipPart: () => {
      if (stage === 'custom') moveTo('free');
    },
    finish: () => moveTo('finished'),
  };
}

export type MockInterviewSession = ReturnType<typeof useMockInterviewSession>;
