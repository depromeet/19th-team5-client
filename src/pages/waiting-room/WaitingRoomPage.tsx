import {
  IconDocumentFill,
  IconDocumentMagnifyingglassFill,
} from '@karrotmarket/react-monochrome-icon';
import { useReducer, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { Button, CountDown, GNB } from '@/components/common';
import { WrittenQuestionsOverlay } from '@/components/question-sheet';
import {
  InteractionPrompt,
  ScreenAnchored,
  type ScreenInset,
  SpaceShell,
} from '@/components/space';
import {
  ConnectionLostDialog,
  DocumentPeek,
  MicDock,
  MicPermissionDialog,
  MicTestDialog,
  MyResumeOverlay,
  NpcPracticeSheet,
  ParticipantsPanel,
  QuestionPreview,
  ResumePreview,
  RoomStatus,
  type WaitingRoomInteractable,
  WaitingRoomScene,
} from '@/components/waiting-room';
import { gnbLabels } from '@/constants/common/gnbLabels';
import { interviewPaths, reservationPaths } from '@/constants/common/paths';
import { shortcuts } from '@/constants/space/shortcuts';
import { useNetworkStatus } from '@/hooks/common/useNetworkStatus';
import { useNow } from '@/hooks/common/useNow';
import { useBookedRoom } from '@/hooks/reservation/useBookedRoom';
import { useKeyboardShortcut } from '@/hooks/space/useKeyboardShortcut';
import { useRoomMicrophone } from '@/hooks/waiting-room/useRoomMicrophone';
import { interviewMock, mockCountdowns } from '@/mocks/interview/interview';
import {
  clearMockWaitingClock,
  useMockWaitingCountdown,
} from '@/mocks/interview/useMockCountdown';
import { usePrototypeParams } from '@/mocks/interview/usePrototypeParams';
import { task4CustomQuestions } from '@/mocks/interview-room/task4Questions';
import { candidates } from '@/mocks/question-sheet/candidates';
import {
  myAttachmentCount,
  myResume,
  task3Resume,
} from '@/mocks/waiting-room/myResume';
import { npc, npcQuestions } from '@/mocks/waiting-room/npc';
import { getRoomParticipants } from '@/mocks/waiting-room/participants';
import { useQuestionSheetStore } from '@/stores/question-sheet/questionSheetStore';
import { visuallyHidden } from '@/styles/a11y.css';
import type {
  InterviewRole,
  InterviewTestTask,
} from '@/types/interview/interview';
import {
  formatRoomTime,
  getReservationReturnTo,
  interviewDuration,
  waitingRoomLeadTime,
} from '@/utils/reservation';
import { createScreenAnchor } from '@/utils/space/screenAnchor';
import * as styles from './waitingRoomPage.css';

type WaitingRoomProps = {
  interviewId: string;
  role: InterviewRole;
  title: string;
  untilStart: number;
  lobbyPath: string;
  task?: InterviewTestTask;
  exit?: { to: string; label: string };
};
type WaitingRoomEntryProps = Pick<WaitingRoomProps, 'interviewId'>;

/** 면접 시작 몇 초 전부터 카운트다운을 띄울지. 0초가 되면 면접방으로 들어간다. */
const startCountdownSeconds = 3;

const roomCapacity =
  interviewMock.headcount.interviewee + interviewMock.headcount.interviewer;

export function WaitingRoomPage() {
  const { interviewId = interviewMock.id } = useParams();
  return interviewId.startsWith('room-') ? (
    <ReservedWaitingRoom key={interviewId} interviewId={interviewId} />
  ) : (
    <PrototypeWaitingRoom interviewId={interviewId} />
  );
}

function PrototypeWaitingRoom({ interviewId }: WaitingRoomEntryProps) {
  const { role, task } = usePrototypeParams();
  const { key, state } = useLocation();
  const untilStart = useMockWaitingCountdown(interviewId, role);
  const returnTo = getReservationReturnTo(state);
  return (
    <WaitingRoom
      key={`${interviewId}-${role}-${key}`}
      interviewId={interviewId}
      role={role}
      task={task}
      title={interviewMock.roomTitle}
      untilStart={untilStart}
      lobbyPath={interviewPaths.lobby({ role, phase: 'open' })}
      exit={
        returnTo
          ? { to: returnTo, label: '예약 이어하기' }
          : { to: interviewPaths.lobbyHome, label: '로비로 돌아가기' }
      }
    />
  );
}

function ReservedWaitingRoom({ interviewId }: WaitingRoomEntryProps) {
  const { room, reservation } = useBookedRoom(interviewId);
  const now = useNow();
  if (
    !room ||
    !reservation ||
    now < room.startsAt - waitingRoomLeadTime ||
    now >= room.startsAt + interviewDuration
  ) {
    return <Navigate to={reservationPaths.room(interviewId)} replace />;
  }
  if (now >= room.startsAt) {
    return (
      <Navigate
        to={interviewPaths.interviewRoom(interviewId, {
          role: reservation.role,
        })}
        replace
      />
    );
  }
  return (
    <WaitingRoom
      interviewId={interviewId}
      role={reservation.role}
      title={`${formatRoomTime(room.startsAt)} ${room.title}`}
      untilStart={Math.ceil((room.startsAt - now) / 1000)}
      lobbyPath='/lobby'
    />
  );
}

/** 플로팅 카드에서 미리 보여줄 질문 수 */
const previewQuestionCount = 3;

/**
 * 말 걸기 안내가 김대리를 따라 움직일 때 비워 둘 화면 가장자리(px).
 * 위는 방 상태 표시(top 24px · 높이 약 60px), 아래는 마이크 독(bottom 32px · 높이 약 72px)을 피한다.
 */
const npcPromptInset: ScreenInset = {
  top: 96,
  right: 24,
  bottom: 120,
  left: 24,
};

/**
 * 면접자·면접관이 함께 쓰는 대기실. 공통으로 마이크 테스트, 참가자, 남은 시간, 연결 끊김,
 * 김대리와의 연습을 다루고, 면접관은 작성한 질문지를, 면접자는 내 자소서를 읽기 전용으로 본다.
 */
function WaitingRoom({
  interviewId,
  role,
  title,
  untilStart,
  lobbyPath,
  task,
  exit,
}: WaitingRoomProps) {
  const navigate = useNavigate();
  const [isMicReady, setIsMicReady] = useState(false);
  // 마이크는 꺼진 채로 들어오지만, 마이크 테스트 동안에는 목소리 크기를 보여주려고 입력을 받는다.
  const microphone = useRoomMicrophone({ isTesting: !isMicReady });
  const isOnline = useNetworkStatus();
  // 다시 연결하기: 실시간 연결이 없는 프로토타입에서는 연결 상태를 다시 읽기만 한다.
  const [, recheckConnection] = useReducer((count: number) => count + 1, 0);
  const [nearby, setNearby] = useState<WaitingRoomInteractable | null>(null);
  // 3D 씬이 김대리 머리 위 화면 좌표를 알려주면, 말 걸기 안내를 그 위에 띄운다.
  const [npcAnchor] = useState(createScreenAnchor);
  const [panel, setPanel] = useState<'npc' | 'document' | null>(null);
  // 카운트다운은 한 번 시작하면 남은 시간이 다시 늘어도 멈추지 않는다.
  const [countdownFrom, setCountdownFrom] = useState<number | null>(null);
  if (countdownFrom === null && untilStart <= startCountdownSeconds) {
    setCountdownFrom(Math.max(1, untilStart));
  }
  const isStarting = countdownFrom !== null;

  const isInterviewer = role === 'interviewer';
  const resume = task === '3' ? task3Resume : myResume;
  const participants = getRoomParticipants(role, isMicReady);
  const isMicOn = microphone.status === 'live' && !microphone.isMuted;
  // 다이얼로그·시트가 하나도 없을 때만 단축키와 상호작용 안내를 쓴다.
  const isRoomFocused = isMicReady && panel === null && isOnline && !isStarting;
  const canTalkToNpc = nearby === 'npc';
  const questionSheet = useQuestionSheetStore(
    (state) => state.sheets[interviewId],
  );
  const savedQuestionsByCandidate = Object.fromEntries(
    candidates.map(({ id }) => [
      id,
      (questionSheet?.[id] ?? []).filter(({ text }) => text.trim()),
    ]),
  );
  const hasSavedQuestions = Object.values(savedQuestionsByCandidate).some(
    (questions) => questions.length > 0,
  );
  const questionsByCandidate =
    task === '4' && !hasSavedQuestions
      ? task4CustomQuestions
      : savedQuestionsByCandidate;
  // 면접자 순서대로 이어 붙여 미리보기에 쓴다.
  const writtenQuestions = Object.values(questionsByCandidate).flat();

  const openNpc = () => setPanel('npc');
  const openDocument = () => setPanel('document');
  const closePanel = () => setPanel(null);
  const navigateOut = (to: string, replace = false) => {
    if (exit) clearMockWaitingClock();
    navigate(to, { replace });
  };
  const leaveRoom = () => navigateOut(lobbyPath);
  const exitAction = exit && (
    <Button variant='secondary' onClick={() => navigateOut(exit.to, true)}>
      {exit.label}
    </Button>
  );
  // 프로토타입은 서버 응답 없이 대기실에 들어온 역할 그대로 면접방에 들어간다.
  // 대기실로 뒤로 가지 않도록 기록을 바꾼다.
  const enterInterviewRoom = () =>
    navigateOut(
      interviewPaths.interviewRoom(
        interviewId,
        task ? { role, task } : { role },
      ),
      true,
    );

  useKeyboardShortcut(
    shortcuts.interact,
    openNpc,
    isRoomFocused && canTalkToNpc,
  );

  return (
    <>
      <SpaceShell
        header={<GNB variant='waiting' labels={gnbLabels.waiting} />}
        scene={
          <WaitingRoomScene
            participants={participants}
            canMove={isRoomFocused}
            onNearbyChange={setNearby}
            npcAnchor={npcAnchor}
          />
        }
      >
        <h1 className={visuallyHidden}>면접 대기실</h1>
        {isStarting ? (
          <div className={styles.startCountdown}>
            <CountDown
              seconds={countdownFrom}
              onComplete={enterInterviewRoom}
            />
          </div>
        ) : (
          <ParticipantsPanel
            className={styles.participants}
            participants={participants}
            capacity={roomCapacity}
          />
        )}
        <RoomStatus
          className={styles.status}
          title={title}
          remainingSeconds={untilStart}
        />
        {/* 김대리를 지나치지 않도록 안내는 늘 김대리 머리 위에 두고, 가까이 가야 누를 수 있다. */}
        {isRoomFocused && (
          <ScreenAnchored
            anchor={npcAnchor}
            fallbackClassName={styles.npcPrompt}
            inset={npcPromptInset}
          >
            <InteractionPrompt
              shortcut={shortcuts.interact}
              label='김대리에게 말 걸기'
              disabled={!canTalkToNpc}
              onClick={openNpc}
            />
          </ScreenAnchored>
        )}
        {!isStarting && (
          <MicDock
            className={exit ? styles.dockWithExit : styles.dock}
            isMicOn={isMicOn}
            exitAction={exitAction}
            onToggleMic={
              microphone.status === 'live'
                ? microphone.toggleMute
                : microphone.retry
            }
          />
        )}
        {!isStarting &&
          (isInterviewer ? (
            <DocumentPeek
              className={styles.documentPeek}
              icon={
                <IconDocumentMagnifyingglassFill size={28} aria-hidden='true' />
              }
              label='작성한 질문지'
              title={`2부 질문 ${writtenQuestions.length}개`}
              description='대기실에서는 볼 수만 있어요'
              preview={
                <QuestionPreview
                  questions={writtenQuestions.slice(0, previewQuestionCount)}
                  emptyText='아직 작성한 질문이 없어요'
                />
              }
              onOpenDetail={openDocument}
            />
          ) : (
            <DocumentPeek
              className={styles.documentPeek}
              icon={<IconDocumentFill size={28} aria-hidden='true' />}
              label='내 자소서'
              title={`자기소개서 ${resume.resume.length}문항`}
              description={`이력·포트폴리오 ${myAttachmentCount}개 · 면접관에게 공유됨`}
              preview={
                resume.resume[0] && (
                  <ResumePreview
                    question={`Q1. ${resume.resume[0].question}`}
                    answer={resume.resume[0].answer}
                  />
                )
              }
              onOpenDetail={openDocument}
            />
          ))}
      </SpaceShell>

      {/* 카운트다운이 시작되면 다이얼로그·시트를 모두 닫아 숫자가 가려지지 않게 한다. */}
      <MicTestDialog
        isOpen={!isStarting && !isMicReady && !microphone.isPermissionDenied}
        microphone={microphone}
        onComplete={() => setIsMicReady(true)}
        exitAction={exitAction}
      />
      <MicPermissionDialog
        isOpen={!isStarting && !isMicReady && microphone.isPermissionDenied}
        isChecking={microphone.status === 'requesting'}
        onRetry={microphone.retry}
        exitAction={exitAction}
      />
      <NpcPracticeSheet
        isOpen={!isStarting && panel === 'npc'}
        npc={npc}
        questions={npcQuestions}
        onClose={closePanel}
      />
      {isInterviewer ? (
        <WrittenQuestionsOverlay
          isOpen={!isStarting && panel === 'document'}
          questionsByCandidate={questionsByCandidate}
          candidates={candidates}
          remainingSeconds={untilStart}
          onClose={closePanel}
        />
      ) : (
        <MyResumeOverlay
          isOpen={!isStarting && panel === 'document'}
          resume={resume}
          remainingSeconds={untilStart}
          onClose={closePanel}
        />
      )}
      {!isOnline && (
        <ConnectionLostDialog
          rejoinSeconds={mockCountdowns.rejoin}
          onLeave={leaveRoom}
          onReconnect={recheckConnection}
        />
      )}
    </>
  );
}
