import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Dialog, GNB } from '@/components/common';
import {
  type LobbyInteractable,
  LobbyScene,
  NoticeCard,
  UpcomingInterviewCard,
  WorldChatBar,
} from '@/components/lobby';
import { QuestionSheetOverlay } from '@/components/question-sheet';
import { SpaceShell } from '@/components/space';
import { gnbLabels } from '@/constants/common/gnbLabels';
import { interviewPaths, reservationPaths } from '@/constants/common/paths';
import { shortcuts } from '@/constants/space/shortcuts';
import { useDisclosure } from '@/hooks/common/useDisclosure';
import { usePrototypeLobbyCountdown } from '@/hooks/lobby/usePrototypeLobbyCountdown';
import { useKeyboardShortcut } from '@/hooks/space/useKeyboardShortcut';
import { interviewMock } from '@/mocks/interview/interview';
import { usePrototypeParams } from '@/mocks/interview/usePrototypeParams';
import { lobbyNotices } from '@/mocks/lobby/notices';
import { candidates } from '@/mocks/question-sheet/candidates';
import { myAvatar } from '@/mocks/waiting-room/participants';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import { visuallyHidden } from '@/styles/a11y.css';
import type {
  InterviewPhase,
  InterviewRole,
} from '@/types/interview/interview';
import { createScreenAnchor } from '@/utils/space/screenAnchor';
import { KioskPrompt } from './KioskPrompt';
import * as styles from './lobbyPage.css';

type LobbyPhaseLabels = {
  upcoming: string;
  countdown: string;
  questionSheetTimer: string;
};

const participationLabels = {
  interviewee: '면접자로 참여',
  interviewer: '면접관으로 참여',
} as const satisfies Record<InterviewRole, string>;

const phaseLabels = {
  prepare: {
    upcoming: '곧 시작하는 면접',
    countdown: '대기실 오픈까지',
    questionSheetTimer: '대기실 입장까지',
  },
  open: {
    upcoming: '예약된 면접',
    countdown: '면접 시작까지',
    questionSheetTimer: '시작까지',
  },
} satisfies Record<InterviewPhase, LobbyPhaseLabels>;

export function PrototypeLobby() {
  const navigate = useNavigate();
  const { role, phase } = usePrototypeParams();
  const { remainingSeconds, progress } = usePrototypeLobbyCountdown(
    role,
    phase,
  );
  const questionSheet = useDisclosure();
  const [nearby, setNearby] = useState<LobbyInteractable | null>(null);
  // 3D 씬이 키오스크 위 화면 좌표를 알려주면, 키오스크 사용 안내를 그 위에 띄운다.
  const [kioskAnchor] = useState(createScreenAnchor);
  const [isNoticeOpen, setIsNoticeOpen] = useState(true);
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  // 역할·단계가 바뀌면 닫았던 카드도 다시 보여준다. 화면을 다시 마운트하지 않고 카드 상태만 되돌려서,
  // 3D 로비를 새로 불러오지 않고 걸어 다니던 내 캐릭터도 제자리에 둔다.
  const view = `${role}-${phase}`;
  const [cardView, setCardView] = useState(view);
  if (cardView !== view) {
    setCardView(view);
    setIsNoticeOpen(true);
    setIsUpcomingOpen(true);
    setIsDetailOpen(false);
  }
  const tickets = useReservationStore((state) => state.tickets);

  const labels = phaseLabels[phase];
  const notice = lobbyNotices[phase][role];

  const closeNotice = () => setIsNoticeOpen(false);
  const enterWaitingRoom = () =>
    navigate(interviewPaths.waitingRoom(interviewMock.id, { role }), {
      state: { fromDemoLobby: true },
    });
  const openKiosk = () => navigate(reservationPaths.rooms);
  const viewReservation = () => setIsDetailOpen(true);

  // 질문지·예약 상세가 떠 있는 동안에는 캐릭터 이동과 공간의 단축키, 상호작용 안내를 쓰지 않는다.
  const isLobbyFocused = !questionSheet.isOpen && !isDetailOpen;
  const isNearKiosk = nearby === 'kiosk';
  useKeyboardShortcut(
    shortcuts.interact,
    openKiosk,
    isLobbyFocused && isNearKiosk,
  );

  const confirmNotice =
    phase === 'open'
      ? enterWaitingRoom
      : role === 'interviewer'
        ? questionSheet.open
        : closeNotice;
  const hasLaterAction = phase === 'open' || role === 'interviewer';

  return (
    <>
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
        scene={
          <LobbyScene
            role={role}
            avatar={myAvatar}
            canMove={isLobbyFocused}
            onNearbyChange={setNearby}
            kioskAnchor={kioskAnchor}
          />
        }
      >
        <h1 className={visuallyHidden}>로비</h1>
        {isLobbyFocused && (
          <KioskPrompt
            anchor={kioskAnchor}
            isNear={isNearKiosk}
            onUse={openKiosk}
          />
        )}
        <div className={styles.interviewCards}>
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
              label={labels.upcoming}
              title={interviewMock.title}
              summary={`${participationLabels[role]} · 면접자 ${interviewMock.headcount.interviewee} · 면접관 ${interviewMock.headcount.interviewer}`}
              countdownLabel={labels.countdown}
              remainingSeconds={remainingSeconds}
              progress={progress}
              onClose={() => setIsUpcomingOpen(false)}
              actions={
                <>
                  <Button variant='secondary' onClick={viewReservation}>
                    예약 보기
                  </Button>
                  {role === 'interviewer' && (
                    <Button onClick={questionSheet.open}>질문지 작성</Button>
                  )}
                </>
              }
            />
          )}
        </div>
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
      {role === 'interviewer' && (
        <QuestionSheetOverlay
          isOpen={questionSheet.isOpen}
          interviewId={interviewMock.id}
          candidates={candidates}
          timerLabel={labels.questionSheetTimer}
          remainingSeconds={remainingSeconds}
          exitLabel='저장하고 로비로'
          finishDescription='대기실 입장 전까지 언제든 다시 고칠 수 있어요'
          onClose={questionSheet.close}
        />
      )}
    </>
  );
}
