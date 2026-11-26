import { useState } from 'react';
import { useParams } from 'react-router';
import { GNB } from '@/components/common';
import {
  InterviewDock,
  InterviewEndDialog,
  InterviewerSheet,
  type InterviewRoomInteractable,
  InterviewRoomScene,
  PartStepper,
  StageCard,
  type StageCardProps,
  TimeStatus,
} from '@/components/interview-room';
import { InteractionPrompt, SpaceShell } from '@/components/space';
import { partLabels } from '@/constants/interview-room/parts';
import { shortcuts } from '@/constants/space/shortcuts';
import { useKeyboardShortcut } from '@/hooks/space/useKeyboardShortcut';
import { useRoomMicrophone } from '@/hooks/waiting-room/useRoomMicrophone';
import { interviewMock } from '@/mocks/interview/interview';
import { usePrototypeParams } from '@/mocks/interview/usePrototypeParams';
import { pastMemos } from '@/mocks/interview-room/memos';
import {
  interviewees,
  myAvatarImageUrl,
} from '@/mocks/interview-room/participants';
import {
  commonQuestions,
  customQuestions,
} from '@/mocks/interview-room/questions';
import { mockSchedule } from '@/mocks/interview-room/schedule';
import {
  type MockInterviewSession,
  useMockInterviewSession,
} from '@/mocks/interview-room/useMockInterviewSession';
import { visuallyHidden } from '@/styles/a11y.css';
import type { InterviewRole } from '@/types/interview/interview';
import type { InterviewPart } from '@/types/interview-room/interviewRoom';
import { formatTime, toDurationString } from '@/utils/formatTime';
import { isInterviewPart } from '@/utils/interview-room/stage';
import * as styles from './interviewRoomPage.css';

export function InterviewRoomPage() {
  const { interviewId = interviewMock.id } = useParams();
  const { role } = usePrototypeParams();
  // 역할을 바꾸면 면접을 처음부터 다시 진행한다.
  return <InterviewRoom key={role} interviewId={interviewId} role={role} />;
}

type InterviewRoomProps = { interviewId: string; role: InterviewRole };

/**
 * 면접자·면접관이 함께 쓰는 면접방. 3D 면접장 위에 진행 단계, 남은 시간, 하단 독을 올린다.
 * 면접자는 자리에 앉아 질문을 받고, 면접관은 질문 카드를 보며 면접자마다 메모를 남긴다.
 * TODO(대기실 연동): 대기실(#22)이 합쳐지면 대기 시간이 끝날 때 3초 카운트다운 뒤 이 화면으로 들어온다.
 */
function InterviewRoom({ interviewId, role }: InterviewRoomProps) {
  const session = useMockInterviewSession(role);
  const [nearby, setNearby] = useState<InterviewRoomInteractable | null>(null);

  return (
    <SpaceShell
      header={<GNB variant='interview' />}
      scene={
        <InterviewRoomScene
          isSeated={session.stage !== 'seating'}
          onNearbyChange={setNearby}
        />
      }
    >
      <h1 className={visuallyHidden}>면접방</h1>
      {session.stage === 'finished' ? (
        <InterviewEnd role={role} />
      ) : (
        <InterviewInProgress
          interviewId={interviewId}
          role={role}
          session={session}
          nearby={nearby}
        />
      )}
    </SpaceShell>
  );
}

type InterviewInProgressProps = InterviewRoomProps & {
  session: MockInterviewSession;
  nearby: InterviewRoomInteractable | null;
};

/** 면접이 끝나기 전까지의 HUD. 면접이 끝나면 사라지면서 마이크도 놓아준다. */
function InterviewInProgress({
  interviewId,
  role,
  session,
  nearby,
}: InterviewInProgressProps) {
  const microphone = useRoomMicrophone();
  const part = isInterviewPart(session.stage) ? session.stage : null;
  const canSit = session.stage === 'seating' && nearby === 'seat';

  useKeyboardShortcut(shortcuts.interact, session.sit, canSit);

  const leaveInterview = () => {
    // TODO(면접 나가기): 나가기 흐름이 정해지면 연결한다. 프로토타입에서는 동작하지 않는다.
  };

  const dockProps = {
    isMicOn: microphone.status === 'live' && !microphone.isMuted,
    // 부가 진행되는 동안에는 마이크 버튼에 목소리 크기를 보여주고 나가기 버튼을 둔다.
    voiceStream: part ? microphone.stream : null,
    onToggleMic:
      microphone.status === 'live' ? microphone.toggleMute : microphone.retry,
    onLeave: part ? leaveInterview : undefined,
  };

  return (
    <>
      {part && (
        <>
          <PartStepper
            className={styles.partStepper}
            currentPart={part}
            partSeconds={session.partSeconds}
          />
          <TimeStatus
            className={styles.timeStatus}
            remainingSeconds={session.totalRemainingSeconds}
            partProgress={
              role === 'interviewer'
                ? {
                    label: `${partLabels[part].order} · ${partLabels[part].title}`,
                    elapsedSeconds: session.elapsedSeconds,
                    totalSeconds: session.partSeconds[part],
                  }
                : undefined
            }
          />
        </>
      )}
      {role === 'interviewer' ? (
        part && (
          <InterviewerSheet
            interviewId={interviewId}
            part={part}
            interviewees={interviewees}
            commonQuestions={commonQuestions}
            customQuestions={customQuestions}
            fallbackMemos={pastMemos}
            dock={<InterviewDock {...dockProps} />}
            onSkipPart={session.skipPart}
            onFinish={session.finish}
          />
        )
      ) : (
        <>
          <StageCard
            className={styles.stageCard}
            {...getIntervieweeCard(session, part)}
          />
          {canSit && (
            <InteractionPrompt
              className={styles.seatPrompt}
              shortcut={shortcuts.interact}
              label='앉기'
              onClick={session.sit}
            />
          )}
          <InterviewDock className={styles.dock} {...dockProps} />
        </>
      )}
    </>
  );
}

/**
 * 면접자 화면 위쪽 카드. 앉기 전에는 할 일을, 부가 시작되면 질문을 기다리는 동안 안내를,
 * 면접관이 고른 질문이 오면 그 질문을 보여준다.
 */
function getIntervieweeCard(
  session: MockInterviewSession,
  part: InterviewPart | null,
): StageCardProps {
  if (!part) {
    return {
      variant: 'notice',
      caption: (
        <>
          면접장 입장 · 남은 시간{' '}
          <time dateTime={toDurationString(session.remainingSeconds)}>
            {formatTime(session.remainingSeconds)}
          </time>
        </>
      ),
      title: '내 자리로 가서 앉아 주세요',
    };
  }

  const { order, title } = partLabels[part];
  const question = session.receivedQuestion;
  if (question) {
    return {
      variant: 'question',
      caption: `${order} ${title} · ${question.detail}`,
      byline: `${question.interviewerName} 면접관`,
      title: question.text,
    };
  }
  return {
    variant: 'notice',
    caption: `${order} ${title}을 시작해요`,
    title:
      session.isAutoSeated && part === 'common'
        ? '1분이 지나 자동으로 앉았어요'
        : '면접관이 질문을 고르고 있어요',
  };
}

/** 면접이 끝나면 역할에 맞는 종료 다이얼로그를 띄운다. */
function InterviewEnd({ role }: { role: InterviewRole }) {
  const backToLobby = () => {
    // TODO(대기실 연동): 로비(#22)가 합쳐지면 로비로 이동한다. 지금 브랜치에는 로비가 없다.
  };
  const evaluate = () => {
    // TODO(평가): 평가 화면이 생기면 연결한다. 프로토타입에서는 동작하지 않는다.
  };

  return role === 'interviewer' ? (
    <InterviewEndDialog
      myRole='interviewer'
      avatarImageUrl={myAvatarImageUrl}
      evaluationSeconds={mockSchedule.evaluationSeconds}
      onWriteEvaluation={evaluate}
    />
  ) : (
    <InterviewEndDialog
      myRole='interviewee'
      avatarImageUrl={myAvatarImageUrl}
      onBackToLobby={backToLobby}
      onEvaluateInterviewers={evaluate}
    />
  );
}
