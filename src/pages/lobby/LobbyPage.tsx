import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button, Dialog, GNB } from '@/components/common';
import {
  type LobbyInteractable,
  LobbyScene,
  NoticeCard,
  UpcomingInterviewCard,
  WorldChatBar,
} from '@/components/lobby';
import { QuestionSheetOverlay } from '@/components/question-sheet';
import { InteractionPrompt, SpaceShell } from '@/components/space';
import { gnbLabels } from '@/constants/common/gnbLabels';
import { interviewPaths, reservationPaths } from '@/constants/common/paths';
import { shortcuts } from '@/constants/space/shortcuts';
import { useKeyboardShortcut } from '@/hooks/space/useKeyboardShortcut';
import { interviewMock, mockCountdowns } from '@/mocks/interview/interview';
import { useMockCountdown } from '@/mocks/interview/useMockCountdown';
import { usePrototypeParams } from '@/mocks/interview/usePrototypeParams';
import { lobbyNotices } from '@/mocks/lobby/notices';
import { candidates } from '@/mocks/question-sheet/candidates';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import { visuallyHidden } from '@/styles/a11y.css';
import type {
  InterviewPhase,
  InterviewRole,
} from '@/types/interview/interview';
import * as styles from './lobbyPage.css';
import { ReservationLobby } from './ReservationLobby';

type LobbyViewProps = {
  role: InterviewRole;
  phase: InterviewPhase;
  remainingSeconds: number;
  isQuestionSheetOpen: boolean;
  onOpenQuestionSheet: () => void;
};

const participationLabels = {
  interviewee: '면접자로 참여',
  interviewer: '면접관으로 참여',
} as const satisfies Record<InterviewRole, string>;

const countdowns = {
  prepare: {
    key: 'until-open',
    label: '대기실 오픈까지',
    questionSheetLabel: '대기실 입장까지',
    seconds: mockCountdowns.untilOpen,
  },
  open: {
    key: 'until-start',
    label: '면접 시작까지',
    questionSheetLabel: '시작까지',
    seconds: mockCountdowns.untilStart,
  },
} as const satisfies Record<InterviewPhase, object>;

const upcomingLabels = {
  prepare: '곧 시작하는 면접',
  open: '예약된 면접',
} as const satisfies Record<InterviewPhase, string>;

/** 진행 바는 첫 알림(시안 기준 시작 1시간 전)부터 면접 시작까지 흐른 비율을 보여준다. */
const noticeToStartSeconds =
  mockCountdowns.untilOpen + mockCountdowns.untilStart;

export function LobbyPage() {
  const [params] = useSearchParams();
  // 역할·단계 URL은 기존 대기실 UT의 가속 시계를 사용한다.
  return params.has('role') || params.has('phase') ? (
    <PrototypeLobby />
  ) : (
    <ReservationLobby />
  );
}

function PrototypeLobby() {
  const { role, phase } = usePrototypeParams();
  // 질문지는 LobbyView 밖에 두어, 작성 중에 대기실 오픈 단계로 넘어가도 닫히지 않게 한다.
  const [isQuestionSheetOpen, setIsQuestionSheetOpen] = useState(false);
  const countdown = countdowns[phase];
  const remainingSeconds = useMockCountdown(countdown.key, countdown.seconds);

  return (
    <>
      {/* 역할·단계가 바뀌면 닫았던 카드도 다시 보여준다. */}
      <LobbyView
        key={`${role}-${phase}`}
        role={role}
        phase={phase}
        remainingSeconds={remainingSeconds}
        isQuestionSheetOpen={isQuestionSheetOpen}
        onOpenQuestionSheet={() => setIsQuestionSheetOpen(true)}
      />
      {role === 'interviewer' && (
        <QuestionSheetOverlay
          isOpen={isQuestionSheetOpen}
          interviewId={interviewMock.id}
          candidates={candidates}
          timerLabel={countdown.questionSheetLabel}
          remainingSeconds={remainingSeconds}
          exitLabel='저장하고 로비로'
          finishDescription='대기실 입장 전까지 언제든 다시 고칠 수 있어요'
          onClose={() => setIsQuestionSheetOpen(false)}
        />
      )}
    </>
  );
}

function LobbyView({
  role,
  phase,
  remainingSeconds,
  isQuestionSheetOpen,
  onOpenQuestionSheet,
}: LobbyViewProps) {
  const navigate = useNavigate();
  const [nearby, setNearby] = useState<LobbyInteractable | null>(null);
  const [isNoticeOpen, setIsNoticeOpen] = useState(true);
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const tickets = useReservationStore((state) => state.tickets);

  const countdown = countdowns[phase];
  const secondsUntilStart =
    phase === 'prepare'
      ? remainingSeconds + mockCountdowns.untilStart
      : remainingSeconds;
  const notice = lobbyNotices[phase][role];

  const closeNotice = () => setIsNoticeOpen(false);
  const enterWaitingRoom = () =>
    navigate(interviewPaths.waitingRoom(interviewMock.id, { role }), {
      state: { fromDemoLobby: true },
    });
  const openKiosk = () => navigate(reservationPaths.rooms);
  const viewReservation = () => setIsDetailOpen(true);

  // 질문지가 떠 있는 동안에는 공간의 단축키와 상호작용 안내를 쓰지 않는다.
  const canUseKiosk =
    nearby === 'kiosk' && !isQuestionSheetOpen && !isDetailOpen;
  useKeyboardShortcut(shortcuts.interact, openKiosk, canUseKiosk);

  // 대기실 오픈 시간이 되면 오픈 단계로 넘어가 "대기실 문 열렸어요" 알림을 보여준다.
  const isWaitingRoomDue = phase === 'prepare' && remainingSeconds === 0;
  useEffect(() => {
    if (!isWaitingRoomDue) return;
    navigate(interviewPaths.lobby({ role, phase: 'open' }), { replace: true });
  }, [isWaitingRoomDue, navigate, role]);

  const confirmNotice =
    phase === 'open'
      ? enterWaitingRoom
      : role === 'interviewer'
        ? onOpenQuestionSheet
        : closeNotice;
  const hasLaterAction = phase === 'open' || role === 'interviewer';

  return (
    <SpaceShell
      header={
        <GNB
          variant='member'
          labels={gnbLabels.member}
          lobbyTo={interviewPaths.lobby({ role, phase })}
          myPageTo='#my-page'
          notificationsTo={reservationPaths.notifications}
          activePage='lobby'
          ticketCount={tickets}
          hasUnreadNotifications
          onBookInterview={openKiosk}
        />
      }
      scene={<LobbyScene onNearbyChange={setNearby} />}
    >
      <h1 className={visuallyHidden}>로비</h1>
      {canUseKiosk && (
        <InteractionPrompt
          className={styles.kioskPrompt}
          shortcut={shortcuts.interact}
          label='예약 키오스크 사용하기'
          onClick={openKiosk}
        />
      )}
      {isNoticeOpen && (
        <NoticeCard
          className={styles.notice}
          time={notice.time}
          title={notice.title}
          description={notice.description}
          onClose={closeNotice}
          actions={
            <>
              {hasLaterAction && (
                <Button variant='secondary' onClick={closeNotice}>
                  나중에
                </Button>
              )}
              <Button onClick={confirmNotice}>확인</Button>
            </>
          }
        />
      )}
      {isUpcomingOpen && (
        <UpcomingInterviewCard
          className={styles.upcoming}
          label={upcomingLabels[phase]}
          title={interviewMock.title}
          summary={`${participationLabels[role]} · 면접자 ${interviewMock.headcount.interviewee} · 면접관 ${interviewMock.headcount.interviewer}`}
          countdownLabel={countdown.label}
          remainingSeconds={remainingSeconds}
          progress={1 - secondsUntilStart / noticeToStartSeconds}
          onClose={() => setIsUpcomingOpen(false)}
          actions={
            <>
              <Button variant='secondary' onClick={viewReservation}>
                예약 보기
              </Button>
              {role === 'interviewer' && (
                <Button onClick={onOpenQuestionSheet}>질문지 작성</Button>
              )}
            </>
          }
        />
      )}
      <WorldChatBar className={styles.worldChat} />
      <Dialog isOpen={isDetailOpen} onCancel={() => setIsDetailOpen(false)}>
        <Dialog.Header>{interviewMock.title}</Dialog.Header>
        <Dialog.Description>
          {participationLabels[role]} · 대기실 입장 13:45부터
        </Dialog.Description>
        <Dialog.Footer>
          <Button display='block' onClick={() => setIsDetailOpen(false)}>
            닫기
          </Button>
        </Dialog.Footer>
      </Dialog>
    </SpaceShell>
  );
}
