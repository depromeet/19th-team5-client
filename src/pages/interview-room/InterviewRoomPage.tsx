import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { GNB } from '@/components/common';
import {
  InterviewDock,
  InterviewEndDialog,
  InterviewerReviewDialog,
  InterviewerSheet,
  type InterviewRoomInteractable,
  InterviewRoomScene,
  PartStepper,
  StageCard,
  type StageCardProps,
  TimeStatus,
} from '@/components/interview-room';
import {
  InteractionPrompt,
  ScreenAnchored,
  type ScreenInset,
  SpaceShell,
} from '@/components/space';
import { interviewPaths, reservationPaths } from '@/constants/common/paths';
import { partLabels } from '@/constants/interview-room/parts';
import { shortcuts } from '@/constants/space/shortcuts';
import { useBookedRoom } from '@/hooks/reservation/useBookedRoom';
import { useKeyboardShortcut } from '@/hooks/space/useKeyboardShortcut';
import { useRoomMicrophone } from '@/hooks/waiting-room/useRoomMicrophone';
import { interviewMock } from '@/mocks/interview/interview';
import { usePrototypeParams } from '@/mocks/interview/usePrototypeParams';
import { pastMemos } from '@/mocks/interview-room/memos';
import {
  interviewees,
  interviewers,
  myAvatarImageUrl,
  myInterviewee,
} from '@/mocks/interview-room/participants';
import {
  commonQuestions,
  customQuestions,
} from '@/mocks/interview-room/questions';
import { mockSchedule } from '@/mocks/interview-room/schedule';
import { task4CustomQuestions } from '@/mocks/interview-room/task4Questions';
import {
  type MockInterviewSession,
  useMockInterviewSession,
} from '@/mocks/interview-room/useMockInterviewSession';
import { startWriteReviewSession } from '@/mocks/review/WriteReviewSession';
import { getRoomParticipants } from '@/mocks/waiting-room/participants';
import { visuallyHidden } from '@/styles/a11y.css';
import type {
  InterviewRole,
  InterviewTestTask,
} from '@/types/interview/interview';
import type { InterviewPart } from '@/types/interview-room/interviewRoom';
import { formatTime, toDurationString } from '@/utils/formatTime';
import { createInterviewResultNoticeState } from '@/utils/interview-room/resultNotice';
import { isInterviewPart } from '@/utils/interview-room/stage';
import { interviewDuration, reservationPhase } from '@/utils/reservation';
import {
  createScreenAnchor,
  type ScreenAnchor,
} from '@/utils/space/screenAnchor';
import * as styles from './interviewRoomPage.css';

type InterviewRoomProps = { interviewId: string; role: InterviewRole };
type InterviewRoomViewProps = InterviewRoomProps & {
  /** 프로토타입 면접인지. 면접자가 끝내고 로비로 가면 면접 결과 도착 카드를 띄운다. */
  isPrototype?: boolean;
  task?: InterviewTestTask;
};
type InterviewInProgressProps = InterviewRoomProps & {
  session: MockInterviewSession;
  task?: InterviewTestTask;
  nearby: InterviewRoomInteractable | null;
  seatAnchor: ScreenAnchor;
};

/**
 * 앉기 안내가 내 자리를 따라 움직일 때 비워 둘 화면 가장자리(px).
 * 위는 단계 카드(top 139px · 높이 약 100px), 아래는 하단 독(bottom 24px · 높이 약 72px)을 피한다.
 */
const seatPromptInset: ScreenInset = {
  top: 256,
  right: 24,
  bottom: 112,
  left: 24,
};

export function InterviewRoomPage() {
  const { interviewId = interviewMock.id } = useParams();
  return interviewId.startsWith('room-') ? (
    <ReservedInterviewRoom key={interviewId} interviewId={interviewId} />
  ) : (
    <PrototypeInterviewRoom interviewId={interviewId} />
  );
}

function PrototypeInterviewRoom({
  interviewId,
}: Pick<InterviewRoomProps, 'interviewId'>) {
  const { role, task } = usePrototypeParams();
  // 역할이나 UT 시나리오를 바꾸면 면접을 처음부터 다시 진행한다.
  return (
    <InterviewRoom
      key={`${role}:${task ?? ''}`}
      interviewId={interviewId}
      role={role}
      isPrototype
      task={task}
    />
  );
}

function ReservedInterviewRoom({
  interviewId,
}: Pick<InterviewRoomProps, 'interviewId'>) {
  const { room, reservation } = useBookedRoom(interviewId);
  const [enteredAt] = useState(Date.now);
  if (room && reservation && enteredAt < room.startsAt + interviewDuration) {
    const { role } = reservation;
    const phase = reservationPhase(room.startsAt, enteredAt);
    if (phase === 'started')
      return <InterviewRoom interviewId={interviewId} role={role} />;
    if (phase === 'open')
      return (
        <Navigate
          to={interviewPaths.waitingRoom(interviewId, { role })}
          replace
        />
      );
  }
  return <Navigate to={reservationPaths.room(interviewId)} replace />;
}

/**
 * 면접자·면접관이 함께 쓰는 면접방. 3D 면접장 위에 진행 단계, 남은 시간, 하단 독을 올린다.
 * 면접자는 자리에 앉아 질문을 받고, 면접관은 질문 카드를 보며 면접자마다 메모를 남긴다.
 * 대기실에서 시작 3초 카운트다운이 끝나면 이 화면으로 들어온다.
 */
function InterviewRoom({
  interviewId,
  role,
  isPrototype = false,
  task,
}: InterviewRoomViewProps) {
  const session = useMockInterviewSession(role, task);
  const [nearby, setNearby] = useState<InterviewRoomInteractable | null>(null);
  // 대기실에서 함께 기다린 사람들이 그대로 들어온다. 3D 면접장에서는 역할과 아바타만 쓴다.
  const [participants] = useState(() => getRoomParticipants(role, true));
  // 3D 씬이 내 자리 위 화면 좌표를 알려주면, 앉기 안내를 그 위에 띄운다.
  const [seatAnchor] = useState(createScreenAnchor);

  return (
    <SpaceShell
      header={<GNB variant='interview' />}
      scene={
        <InterviewRoomScene
          participants={participants}
          isSeated={session.stage !== 'seating'}
          onNearbyChange={setNearby}
          seatAnchor={seatAnchor}
        />
      }
    >
      <h1 className={visuallyHidden}>면접방</h1>
      {session.stage === 'finished' ? (
        <InterviewEnd role={role} isPrototype={isPrototype} />
      ) : (
        <InterviewInProgress
          interviewId={interviewId}
          role={role}
          session={session}
          task={task}
          nearby={nearby}
          seatAnchor={seatAnchor}
        />
      )}
    </SpaceShell>
  );
}

/** 면접이 끝나기 전까지의 HUD. 면접이 끝나면 사라지면서 마이크도 놓아준다. */
function InterviewInProgress({
  interviewId,
  role,
  session,
  task,
  nearby,
  seatAnchor,
}: InterviewInProgressProps) {
  const microphone = useRoomMicrophone();
  const part = isInterviewPart(session.stage) ? session.stage : null;
  const isSeating = session.stage === 'seating';
  const canSit = isSeating && nearby === 'seat';
  const isTask4 = task === '4';

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
            interviewId={isTask4 ? `${interviewId}:task4` : interviewId}
            part={part}
            interviewees={interviewees}
            commonQuestions={commonQuestions}
            customQuestions={isTask4 ? task4CustomQuestions : customQuestions}
            fallbackMemos={isTask4 ? {} : pastMemos}
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
          {/* 내 자리를 찾을 수 있도록 안내는 늘 내 자리 위에 두고, 가까이 가야 누를 수 있다. */}
          {isSeating && (
            <ScreenAnchored
              anchor={seatAnchor}
              fallbackClassName={styles.seatPrompt}
              inset={seatPromptInset}
            >
              <InteractionPrompt
                shortcut={shortcuts.interact}
                label='앉기'
                disabled={!canSit}
                onClick={session.sit}
              />
            </ScreenAnchored>
          )}
          <InterviewDock className={styles.dock} {...dockProps} />
        </>
      )}
    </>
  );
}

/** 면접자 카드에서 내 이름(예: 면접자 A)을 강조한다. */
const myName = <span className={styles.myName}>{myInterviewee.name}</span>;

/**
 * 면접자 화면 위쪽 카드. 앉기 전에는 내가 어떤 이름으로 참여하는지를, 부가 시작되면 질문을 기다리는 동안 안내를,
 * 면접관이 고른 질문이 오면 내 이름을 앞에 붙여 그 질문을 보여준다.
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
      title: <>{myName}로 면접에 참여합니다</>,
    };
  }

  const { order, title } = partLabels[part];
  const question = session.receivedQuestion;
  if (question) {
    return {
      variant: 'question',
      caption: `${order} ${title} · ${question.detail}`,
      byline: `${question.interviewerName} 면접관`,
      title: (
        <>
          {myName}님 {question.text}
        </>
      ),
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

/**
 * 면접이 끝나면 역할에 맞는 종료 다이얼로그를 띄운다.
 * 면접관은 면접자 평가 화면으로, 면접자는 면접관 평가(선택)를 거쳐 로비로 간다.
 * 면접방으로 뒤로 돌아오지 않도록 기록을 바꾼다.
 * 프로토타입 면접은 결과가 바로 도착한 것으로 보고, 로비에 면접 결과 도착 카드를 띄운다.
 */
function InterviewEnd({
  role,
  isPrototype,
}: {
  role: InterviewRole;
  isPrototype: boolean;
}) {
  const navigate = useNavigate();
  const [isReviewingInterviewers, setIsReviewingInterviewers] = useState(false);
  const backToLobby = () =>
    navigate(interviewPaths.lobbyHome, {
      replace: true,
      state: isPrototype
        ? createInterviewResultNoticeState(Date.now())
        : undefined,
    });

  if (role === 'interviewer') {
    return (
      <InterviewEndDialog
        myRole='interviewer'
        avatarImageUrl={myAvatarImageUrl}
        evaluationSeconds={mockSchedule.evaluationSeconds}
        onWriteEvaluation={() => {
          startWriteReviewSession();
          navigate(interviewPaths.writeReview, { replace: true });
        }}
      />
    );
  }

  return isReviewingInterviewers ? (
    <InterviewerReviewDialog
      interviewers={interviewers}
      onBackToLobby={backToLobby}
    />
  ) : (
    <InterviewEndDialog
      myRole='interviewee'
      avatarImageUrl={myAvatarImageUrl}
      onBackToLobby={backToLobby}
      onEvaluateInterviewers={() => setIsReviewingInterviewers(true)}
    />
  );
}
