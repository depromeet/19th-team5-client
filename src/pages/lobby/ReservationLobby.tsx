import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button, Dialog, GNB } from '@/components/common';
import {
  EmptyInterviewCard,
  type LobbyInteractable,
  LobbyScene,
  NoticeCard,
  WorldChatBar,
} from '@/components/lobby';
import { QuestionSheetOverlay } from '@/components/question-sheet';
import { InterviewPass } from '@/components/reservation/interview-pass/InterviewPass';
import { SpaceShell } from '@/components/space';
import { gnbLabels } from '@/constants/common/gnbLabels';
import {
  interviewPaths,
  reservationPaths,
  signupPaths,
} from '@/constants/common/paths';
import { shortcuts } from '@/constants/space/shortcuts';
import { useReservationSchedule } from '@/hooks/reservation/useReservationSchedule';
import { useKeyboardShortcut } from '@/hooks/space/useKeyboardShortcut';
import { candidates } from '@/mocks/question-sheet/candidates';
import { myAvatar } from '@/mocks/waiting-room/participants';
import * as bookingStyles from '@/pages/reservation/reservation.css';
import { useAuthStore } from '@/stores/AuthStore';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import { visuallyHidden } from '@/styles/a11y.css';
import { getInterviewResultArrivedAt } from '@/utils/interview-room/resultNotice';
import {
  canPrepareQuestions,
  formatRoomTime,
  preparationLeadTime,
} from '@/utils/reservation';
import { createScreenAnchor } from '@/utils/space/screenAnchor';
import { secondsBetween } from '@/utils/time';
import { BookedInterviewCard } from './BookedInterviewCard';
import { KioskPrompt } from './KioskPrompt';
import * as styles from './lobbyPage.css';

export function ReservationLobby() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = useAuthStore((state) => state.email);
  const { now, upcoming, notices } = useReservationSchedule();
  const tickets = useReservationStore((state) => state.tickets);
  const rooms = useReservationStore((state) => state.rooms);
  const reservations = useReservationStore((state) => state.reservations);
  const room = rooms.find(
    (item) => item.id === location.state?.confirmedRoomId,
  );
  const booking = reservations.find((item) => item.roomId === room?.id);
  const next = upcoming[0];
  const sheetRoomId = new URLSearchParams(location.search).get('questionSheet');
  const sheet = upcoming.find(
    (item) =>
      item.room.id === sheetRoomId &&
      canPrepareQuestions(item.role, item.room.startsAt, now),
  );
  const readNoticeIds = useReservationStore((state) => state.readNoticeIds);
  const readNotices = useReservationStore((state) => state.readNotices);
  const [nearby, setNearby] = useState<LobbyInteractable | null>(null);
  // 3D 씬이 키오스크 위 화면 좌표를 알려주면, 키오스크 사용 안내를 그 위에 띄운다.
  const [kioskAnchor] = useState(createScreenAnchor);
  const notice = notices.find((item) => !readNoticeIds.includes(item.id));
  // 프로토타입 면접을 마치고 바로 들어왔을 때만 결과 도착 카드를 띄운다. 예약 알림보다 먼저 보여준다.
  const resultArrivedAt = getInterviewResultArrivedAt(location.state);
  const dismissResult = () =>
    navigate('/lobby', { replace: true, state: null });
  const openResult = () => {
    // 결과 화면에서 뒤로 와도 카드가 다시 뜨지 않게 먼저 state를 지운다.
    dismissResult();
    navigate(interviewPaths.receivedReview);
  };
  const openRooms = () => navigate(reservationPaths.rooms);
  // 출입증·질문지가 떠 있는 동안에는 캐릭터 이동과 공간의 단축키, 상호작용 안내를 쓰지 않는다.
  const isLobbyFocused = !booking && !sheet;
  const isNearKiosk = nearby === 'kiosk';
  const closePass = () => navigate('/lobby', { replace: true, state: null });
  useKeyboardShortcut(
    shortcuts.interact,
    openRooms,
    isLobbyFocused && isNearKiosk,
  );
  return (
    <>
      <SpaceShell
        header={
          email ? (
            <GNB
              variant='member'
              labels={gnbLabels.member}
              lobbyTo='/lobby'
              notificationsTo={reservationPaths.notifications}
              ticketCount={tickets}
              hasUnreadNotifications={Boolean(notice)}
              onBookInterview={openRooms}
            />
          ) : (
            <GNB
              variant='guest'
              labels={gnbLabels.guest}
              lobbyTo='/lobby'
              aboutTo='/#service'
              onLogin={() => navigate('/login')}
              onEnter={() => navigate(signupPaths.account)}
            />
          )
        }
        scene={
          <LobbyScene
            role={next?.role ?? 'interviewee'}
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
            onUse={openRooms}
          />
        )}
        <div className={styles.interviewCards}>
          {resultArrivedAt !== undefined ? (
            <NoticeCard
              className={styles.notice}
              time={formatRoomTime(resultArrivedAt)}
              title='면접 결과가 도착했어요'
              description='면접관이 남긴 키워드와 한 줄 평을 확인해요.'
              onClose={dismissResult}
              actions={<Button onClick={openResult}>확인</Button>}
            />
          ) : (
            notice && (
              <NoticeCard
                className={styles.notice}
                time={notice.label}
                title={notice.title}
                description={notice.detail}
                onClose={() => void readNotices([notice.id])}
                actions={
                  <Button
                    onClick={() => {
                      void readNotices([notice.id]);
                      navigate(notice.to);
                    }}
                  >
                    {notice.action}
                  </Button>
                }
              />
            )
          )}
          {next ? (
            <BookedInterviewCard
              key={next.room.id}
              room={next.room}
              role={next.role}
              now={now}
            />
          ) : (
            <EmptyInterviewCard
              className={styles.upcoming}
              bookingTo={reservationPaths.rooms}
              reservationsTo={email ? reservationPaths.mine : undefined}
            />
          )}
        </div>
        <WorldChatBar className={styles.worldChat} />
      </SpaceShell>
      {sheet && (
        <QuestionSheetOverlay
          isOpen
          key={sheet.room.id}
          interviewId={sheet.room.id}
          candidates={candidates}
          timerLabel='시작까지'
          remainingSeconds={secondsBetween(now, sheet.room.startsAt)}
          exitLabel='저장하고 로비로'
          finishDescription='면접 시작 전까지 언제든 다시 고칠 수 있어요'
          onClose={() => navigate('/lobby', { replace: true })}
        />
      )}
      {room && booking && (
        <Dialog isOpen className={bookingStyles.dialog} onCancel={closePass}>
          <Dialog.Header>면접 예약이 완료됐어요</Dialog.Header>
          <Dialog.Description>
            예약하고 오지 않으면 노쇼 경고가 쌓여요. 2회면 이용이 제한돼요.
          </Dialog.Description>
          <Dialog.Body className={bookingStyles.stack}>
            <InterviewPass room={room} role={booking.role} />
            <div className={bookingStyles.info}>
              <strong>남은 면접권 {tickets}장</strong>
              <span>
                취소·변경 ·{' '}
                {formatRoomTime(room.startsAt - preparationLeadTime)} 전까지
              </span>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Button
              display='block'
              variant='secondary'
              onClick={() => navigate(reservationPaths.mine, { replace: true })}
            >
              내 예약 보기
            </Button>
            <Button display='block' onClick={closePass}>
              로비로 가기
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
    </>
  );
}
