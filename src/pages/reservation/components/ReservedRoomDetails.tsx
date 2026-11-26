import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Dialog } from '@/components/common';
import { InterviewPass } from '@/components/reservation/interview-pass/InterviewPass';
import { reservationPaths } from '@/constants/common/paths';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import type { InterviewRole } from '@/types/interview/interview';
import type { InterviewRoom } from '@/types/reservation';
import { canManageReservation, canPrepareQuestions } from '@/utils/reservation';
import * as styles from '../reservation.css';
import { ReservationEntryButton } from './ReservationEntryButton';

type ReservedRoomDetailsProps = {
  room: InterviewRoom;
  role: InterviewRole;
  now: number;
};

export function ReservedRoomDetails({
  room,
  role,
  now,
}: ReservedRoomDetailsProps) {
  const navigate = useNavigate();
  const cancel = useReservationStore((state) => state.cancel);
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const manageable = canManageReservation(room.startsAt, now);
  const otherRole = role === 'interviewee' ? 'interviewer' : 'interviewee';

  function close() {
    if (pending) return;
    setConfirming(false);
    setError('');
  }

  async function confirm() {
    if (pending) return;
    setPending(true);
    setError('');
    const result = await cancel(room.id);
    setPending(false);
    if (result === 'cancelled') {
      navigate(reservationPaths.mine, { replace: true });
      return;
    }
    setError(
      result === 'locked'
        ? '면접 시작 1시간 전부터 예약을 취소할 수 없어요.'
        : '예약을 취소하지 못했어요. 다시 시도해 주세요.',
    );
  }

  return (
    <>
      <h1 className={styles.heading}>내 예약</h1>
      <InterviewPass room={room} role={role} />
      <div className={styles.actions}>
        {canPrepareQuestions(role, room.startsAt, now) && (
          <Button
            onClick={() => navigate(reservationPaths.questionSheet(room.id))}
          >
            질문지 작성
          </Button>
        )}
        <ReservationEntryButton room={room} role={role} now={now} />
        {manageable && room.seats[otherRole] > 0 && (
          <Button
            variant='secondary'
            onClick={() =>
              navigate({
                pathname: reservationPaths.room(room.id),
                search: '?changeRole=1',
              })
            }
          >
            역할 변경
          </Button>
        )}
        {manageable && (
          <Button variant='outline' onClick={() => setConfirming(true)}>
            예약 취소
          </Button>
        )}
        <Button
          variant='secondary'
          onClick={() => navigate(reservationPaths.mine)}
        >
          예약 목록 보기
        </Button>
      </div>
      <Dialog
        isOpen={confirming}
        className={styles.dialog}
        closedby='closerequest'
        onCancel={close}
      >
        <Dialog.Header>예약을 취소할까요?</Dialog.Header>
        <Dialog.Description>
          {role === 'interviewee'
            ? '예약에 사용한 면접권 1장을 돌려드려요.'
            : '예약한 면접관 자리가 다시 열려요.'}
        </Dialog.Description>
        {error && <Dialog.Body role='alert'>{error}</Dialog.Body>}
        <Dialog.Footer>
          <Button
            display='block'
            variant='secondary'
            disabled={pending}
            onClick={close}
          >
            예약 유지하기
          </Button>
          <Button display='block' disabled={pending} onClick={confirm}>
            {pending ? '취소 중…' : '예약 취소하기'}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}
