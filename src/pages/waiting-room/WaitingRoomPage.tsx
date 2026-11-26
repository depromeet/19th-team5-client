import { useReducer, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { GNB } from '@/components/common';
import { QuestionSheetOverlay } from '@/components/question-sheet';
import { InteractionPrompt, SpaceShell } from '@/components/space';
import {
  ConnectionLostDialog,
  MicDock,
  MicPermissionDialog,
  MicTestDialog,
  NpcPracticeSheet,
  ParticipantsPanel,
  RoomStatus,
  type WaitingRoomInteractable,
  WaitingRoomScene,
} from '@/components/waiting-room';
import { gnbLabels } from '@/constants/common/gnbLabels';
import { interviewPaths, reservationPaths } from '@/constants/common/paths';
import { shortcuts } from '@/constants/space/shortcuts';
import { useNetworkStatus } from '@/hooks/common/useNetworkStatus';
import { useNow } from '@/hooks/common/useNow';
import { useKeyboardShortcut } from '@/hooks/space/useKeyboardShortcut';
import { useRoomMicrophone } from '@/hooks/waiting-room/useRoomMicrophone';
import { interviewMock, mockCountdowns } from '@/mocks/interview/interview';
import { useMockCountdown } from '@/mocks/interview/useMockCountdown';
import { usePrototypeParams } from '@/mocks/interview/usePrototypeParams';
import { candidates } from '@/mocks/question-sheet/candidates';
import { npc, npcQuestions } from '@/mocks/waiting-room/npc';
import { getRoomParticipants } from '@/mocks/waiting-room/participants';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import { visuallyHidden } from '@/styles/a11y.css';
import type { InterviewRole } from '@/types/interview/interview';
import { formatRoomTime, minute } from '@/utils/reservation';
import { secondsBetween } from '@/utils/time';
import * as styles from './waitingRoomPage.css';

type WaitingRoomProps = {
  interviewId: string;
  role: InterviewRole;
  title: string;
  untilStart: number;
  lobbyPath: string;
};

type WaitingRoomEntryProps = Pick<WaitingRoomProps, 'interviewId'>;

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
  const { role } = usePrototypeParams();
  const untilStart = useMockCountdown('until-start', mockCountdowns.untilStart);
  return (
    <WaitingRoom
      key={`${interviewId}-${role}`}
      interviewId={interviewId}
      role={role}
      title={interviewMock.roomTitle}
      untilStart={untilStart}
      lobbyPath={interviewPaths.lobby({ role, phase: 'open' })}
    />
  );
}

function ReservedWaitingRoom({ interviewId }: WaitingRoomEntryProps) {
  const room = useReservationStore((state) =>
    state.rooms.find((item) => item.id === interviewId),
  );
  const reservation = useReservationStore((state) =>
    state.reservations.find((item) => item.roomId === interviewId),
  );
  const now = useNow();
  const [enteredAt] = useState(Date.now);
  if (
    !room ||
    !reservation ||
    enteredAt < room.startsAt - 15 * minute ||
    enteredAt >= room.startsAt
  ) {
    return <Navigate to={reservationPaths.room(interviewId)} replace />;
  }
  return (
    <WaitingRoom
      interviewId={interviewId}
      role={reservation.role}
      title={`${formatRoomTime(room.startsAt)} ${room.title}`}
      untilStart={secondsBetween(now, room.startsAt)}
      lobbyPath='/lobby'
    />
  );
}

/**
 * 면접자·면접관이 함께 쓰는 대기실. 공통으로 마이크 테스트, 참가자, 남은 시간, 연결 끊김을 다루고
 * 면접자는 김대리와 연습, 면접관은 2부 질문지를 연다.
 */
function WaitingRoom({
  interviewId,
  role,
  title,
  untilStart,
  lobbyPath,
}: WaitingRoomProps) {
  const navigate = useNavigate();
  const microphone = useRoomMicrophone();
  const isOnline = useNetworkStatus();
  // 다시 연결하기: 실시간 연결이 없는 프로토타입에서는 연결 상태를 다시 읽기만 한다.
  const [, recheckConnection] = useReducer((count: number) => count + 1, 0);
  const [isMicReady, setIsMicReady] = useState(false);
  const [nearby, setNearby] = useState<WaitingRoomInteractable | null>(null);
  const [panel, setPanel] = useState<'npc' | 'questions' | null>(null);

  const isInterviewer = role === 'interviewer';
  const participants = getRoomParticipants(role, isMicReady);
  const isMicOn = microphone.status === 'live' && !microphone.isMuted;
  // 다이얼로그·시트가 하나도 없을 때만 단축키와 상호작용 안내를 쓴다.
  const isRoomFocused = isMicReady && panel === null && isOnline;
  const canTalkToNpc = !isInterviewer && nearby === 'npc';

  const openNpc = () => setPanel('npc');
  const openQuestionSheet = () => setPanel('questions');
  const closePanel = () => setPanel(null);
  const leaveRoom = () => navigate(lobbyPath);

  useKeyboardShortcut(
    shortcuts.interact,
    openNpc,
    isRoomFocused && canTalkToNpc,
  );
  useKeyboardShortcut(
    shortcuts.questionSheet,
    openQuestionSheet,
    isRoomFocused && isInterviewer,
  );

  return (
    <>
      <SpaceShell
        header={<GNB variant='waiting' labels={gnbLabels.waiting} />}
        scene={<WaitingRoomScene onNearbyChange={setNearby} />}
      >
        <h1 className={visuallyHidden}>면접 대기실</h1>
        <ParticipantsPanel
          className={styles.participants}
          participants={participants}
          capacity={roomCapacity}
        />
        <RoomStatus
          className={styles.status}
          title={title}
          remainingSeconds={untilStart}
        />
        {isRoomFocused && canTalkToNpc && (
          <InteractionPrompt
            className={styles.npcPrompt}
            shortcut={shortcuts.interact}
            label='김대리에게 말 걸기'
            onClick={openNpc}
          />
        )}
        <MicDock
          className={styles.dock}
          isMicOn={isMicOn}
          onToggleMic={
            microphone.status === 'live'
              ? microphone.toggleMute
              : microphone.retry
          }
          onOpenQuestionSheet={isInterviewer ? openQuestionSheet : undefined}
        />
      </SpaceShell>

      <MicTestDialog
        isOpen={!isMicReady && !microphone.isPermissionDenied}
        microphone={microphone}
        onComplete={() => setIsMicReady(true)}
      />
      <MicPermissionDialog
        isOpen={!isMicReady && microphone.isPermissionDenied}
        isChecking={microphone.status === 'requesting'}
        onRetry={microphone.retry}
      />
      {isInterviewer ? (
        <QuestionSheetOverlay
          isOpen={panel === 'questions'}
          interviewId={interviewId}
          candidates={candidates}
          timerLabel='시작까지'
          remainingSeconds={untilStart}
          exitLabel='저장하고 대기실로'
          finishDescription='면접 시작 전까지 언제든 다시 고칠 수 있어요'
          onClose={closePanel}
        />
      ) : (
        <NpcPracticeSheet
          isOpen={panel === 'npc'}
          npc={npc}
          questions={npcQuestions}
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
