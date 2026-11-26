import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button, Dialog, GNB } from '@/components/common';
import {
  type LobbyInteractable,
  LobbyScene,
  NoticeCard,
  WorldChatBar,
} from '@/components/lobby';
import { InterviewPass } from '@/components/reservation/interview-pass/InterviewPass';
import { InteractionPrompt, SpaceShell } from '@/components/space';
import { gnbLabels } from '@/constants/common/gnbLabels';
import { reservationPaths } from '@/constants/common/paths';
import { shortcuts } from '@/constants/space/shortcuts';
import { useReservationNotices } from '@/hooks/reservation/useReservationNotices';
import { useKeyboardShortcut } from '@/hooks/space/useKeyboardShortcut';
import * as bookingStyles from '@/pages/reservation/reservation.css';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import { visuallyHidden } from '@/styles/a11y.css';
import { formatRoomTime, minute } from '@/utils/reservation';
import * as styles from './lobbyPage.css';

export function ReservationLobby() {
  const navigate = useNavigate();
  const location = useLocation();
  const tickets = useReservationStore((state) => state.tickets);
  const room = useReservationStore((state) =>
    state.rooms.find((item) => item.id === location.state?.confirmedRoomId),
  );
  const booking = useReservationStore((state) =>
    state.reservations.find((item) => item.roomId === room?.id),
  );
  const notices = useReservationNotices();
  const readNoticeIds = useReservationStore((state) => state.readNoticeIds);
  const readNotices = useReservationStore((state) => state.readNotices);
  const [nearby, setNearby] = useState<LobbyInteractable | null>(null);
  const notice = notices.find((item) => !readNoticeIds.includes(item.id));
  const openRooms = () => navigate(reservationPaths.rooms);
  const canUseKiosk = nearby === 'kiosk' && !booking;
  const closePass = () => navigate('/lobby', { replace: true, state: null });
  useKeyboardShortcut(shortcuts.interact, openRooms, canUseKiosk);
  return (
    <>
      <SpaceShell
        header={
          <GNB
            variant='member'
            labels={gnbLabels.member}
            lobbyTo='/lobby'
            notificationsTo={reservationPaths.notifications}
            ticketCount={tickets}
            hasUnreadNotifications={Boolean(notice)}
            onBookInterview={openRooms}
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
            onClick={openRooms}
          />
        )}
        {notice && (
          <NoticeCard
            className={styles.notice}
            time={notice.label}
            title={notice.title}
            description={notice.detail}
            onClose={() => readNotices([notice.id])}
            actions={
              <Button
                onClick={() => {
                  readNotices([notice.id]);
                  navigate(notice.to);
                }}
              >
                {notice.action}
              </Button>
            }
          />
        )}
        <Button
          className={styles.upcoming}
          variant='secondary'
          onClick={() => navigate(reservationPaths.mine)}
        >
          내 예약 보기
        </Button>
        <WorldChatBar className={styles.worldChat} />
      </SpaceShell>
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
                취소·변경 · {formatRoomTime(room.startsAt - 60 * minute)} 전까지
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
