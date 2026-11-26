import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { Button, Dialog, Tag } from '@/components/common';
import { reservationPaths } from '@/constants/common/paths';
import { roleLabels } from '@/constants/interview/roleLabels';
import { useNow } from '@/hooks/common/useNow';
import { useBookedRoom } from '@/hooks/reservation/useBookedRoom';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import type { InterviewRole } from '@/types/interview/interview';
import type { InterviewRoom } from '@/types/reservation';
import {
  canManageReservation,
  formatRoomDate,
  formatRoomTime,
  interviewDuration,
} from '@/utils/reservation';
import { ReservedRoomDetails } from './components/ReservedRoomDetails';
import * as styles from './reservation.css';

type RoleDialog =
  | 'confirm'
  | 'no-tickets'
  | 'unavailable'
  | 'locked'
  | 'error'
  | null;
type RoleSelectionProps = { room: InterviewRoom; bookedRole?: InterviewRole };

const portraits = {
  interviewee: '/images/signup/boy-profile.png',
  interviewer: '/images/kim-daeri-profile.png',
};
const roles: InterviewRole[] = ['interviewee', 'interviewer'];
const roleDirections = { interviewee: '면접자로', interviewer: '면접관으로' };
const reserveLabels = {
  interviewee: '면접권 1장으로 예약하기',
  interviewer: '면접관 자리 예약하기',
};
const failureCopy = {
  locked: {
    title: '역할 변경 시간이 지났어요',
    description: '면접 시작 1시간 전부터 예약 역할을 바꿀 수 없어요.',
  },
  error: {
    title: '예약 정보를 저장하지 못했어요',
    description: '다시 시도해 주세요.',
  },
  unavailable: {
    title: '이 자리는 예약할 수 없어요',
    description: '다른 열린 면접방을 확인해 주세요.',
  },
};

export function RoleSelectionPage() {
  const { roomId } = useParams();
  const { room, reservation } = useBookedRoom(roomId);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const now = useNow();
  if (room && reservation) {
    const canChange =
      params.has('changeRole') &&
      canManageReservation(room.startsAt, now) &&
      roles.some((role) => role !== reservation.role && room.seats[role] > 0);
    if (canChange) {
      return (
        <RoleSelection
          key={room.id + reservation.role}
          room={room}
          bookedRole={reservation.role}
        />
      );
    }
    return (
      <ReservedRoomDetails
        key={room.id}
        room={room}
        role={reservation.role}
        now={now}
      />
    );
  }
  if (
    !room ||
    room.startsAt <= now ||
    !roles.some((role) => room.seats[role] > 0)
  )
    return (
      <>
        <h1 className={styles.heading}>예약할 수 없는 면접방이에요</h1>
        <Button onClick={() => navigate(reservationPaths.rooms)}>
          열린 면접방 보기
        </Button>
      </>
    );
  return <RoleSelection key={room.id} room={room} />;
}

function RoleSelection({ room, bookedRole }: RoleSelectionProps) {
  const navigate = useNavigate();
  const tickets = useReservationStore((state) => state.tickets);
  const reserve = useReservationStore((state) => state.reserve);
  const [role, setRole] = useState<InterviewRole>(
    bookedRole === 'interviewee' || !room.seats.interviewee
      ? 'interviewer'
      : 'interviewee',
  );
  const [dialog, setDialog] = useState<RoleDialog>(null);
  const [pending, setPending] = useState(false);
  const candidate = role === 'interviewee';
  const interviewerSeats =
    bookedRole === 'interviewer' ? 0 : room.seats.interviewer;
  const confirmLabel = `${roleDirections[role]} ${bookedRole ? '변경하기' : '예약하기'}`;
  const confirmCopy = candidate
    ? {
        title: '면접권 1장을 사용할까요?',
        description: `보유한 면접권 ${tickets}장 중 1장을 사용해요.`,
      }
    : {
        title: '이번엔 내가 면접관이에요',
        description: bookedRole
          ? '기존 예약에 사용한 면접권 1장을 돌려드려요.'
          : '면접을 끝까지 진행하면 면접권 1장을 받아요.',
      };
  let copy = confirmCopy;
  if (dialog === 'no-tickets') {
    copy = {
      title: '면접권이 부족해요',
      description:
        interviewerSeats > 0
          ? `면접관 자리가 ${interviewerSeats}개 남았어요. 참여를 완료하면 면접권 1장을 받아요.`
          : bookedRole
            ? '면접권을 확보한 뒤 역할을 변경할 수 있어요.'
            : '이 방의 면접관 자리는 마감됐어요. 다른 방의 남은 자리를 확인해 주세요.',
    };
  } else if (dialog && dialog !== 'confirm') {
    copy = failureCopy[dialog];
  }
  const confirm = async () => {
    if (pending) return;
    setPending(true);
    const result = await reserve(room.id, role, Boolean(bookedRole));
    setPending(false);
    if (
      bookedRole &&
      (result === 'reserved' || result === 'already-reserved')
    ) {
      navigate(reservationPaths.room(room.id), { replace: true });
      return;
    }
    if (result === 'reserved') {
      navigate('/lobby', {
        replace: true,
        state: { confirmedRoomId: room.id },
      });
    } else if (result === 'already-reserved') {
      navigate(reservationPaths.mine);
    } else {
      setDialog(result);
    }
  };
  const closeDialog = () => {
    if (!pending) setDialog(null);
  };
  return (
    <>
      <header>
        <h1 className={styles.heading}>
          {bookedRole ? '예약 역할 바꾸기' : '이번엔 어느 자리에 앉아볼까요?'}
        </h1>
        <p className={styles.subtitle}>
          {room.title} · {formatRoomDate(room.startsAt)}{' '}
          {formatRoomTime(room.startsAt)}–
          {formatRoomTime(room.startsAt + interviewDuration)} · 2:2 면접
        </p>
      </header>
      <div className={styles.columns}>
        <fieldset className={styles.roleChoices} aria-label='역할 선택'>
          {roles.map((item) => (
            <button
              key={item}
              className={styles.roleCard}
              type='button'
              aria-label={roleLabels[item]}
              aria-pressed={role === item}
              disabled={item === bookedRole || !room.seats[item]}
              onClick={() => setRole(item)}
            >
              <span className={styles.roleCopy}>
                <span>
                  <span className={styles.roleTitle}>
                    <strong className={styles.time}>{roleLabels[item]}</strong>
                    <Tag tone='gray'>
                      {item === bookedRole
                        ? '현재 예약'
                        : room.seats[item] === 0
                          ? '자리 마감'
                          : item === 'interviewee'
                            ? '면접권 −1장'
                            : '참여 완료 후 면접권 +1장'}
                    </Tag>
                  </span>
                  {item === 'interviewee'
                    ? '내 답변을 실전처럼 연습해요.'
                    : '좋은 답변을 듣는 눈을 길러요.'}
                </span>
                <small className={styles.roleHint}>
                  {item === 'interviewee'
                    ? '질문에 답하고 키워드 피드백 받기'
                    : '질문 카드를 고르고 피드백 남기기'}
                </small>
              </span>
              <img className={styles.portrait} src={portraits[item]} alt='' />
            </button>
          ))}
        </fieldset>
        <aside className={styles.bordered}>
          <h2 className={styles.sectionTitle}>선택한 면접</h2>
          <dl className={styles.facts}>
            <dt>시간대</dt>
            <dd className={styles.value}>{formatRoomTime(room.startsAt)}</dd>
            <dt>직군</dt>
            <dd className={styles.value}>{room.job}</dd>
            <dt>역할</dt>
            <dd className={styles.value}>{roleLabels[role]}</dd>
          </dl>
          <div className={styles.info}>
            <strong>예약 전 확인해 주세요</strong>
            <p className={styles.muted}>
              시작 1시간 전부터 예약 취소·역할 변경이 불가해요. 노쇼 경고가 2회
              누적되면 서비스 이용이 제한돼요. 면접관 면접권은 참여 완료 후
              지급돼요.
            </p>
          </div>
          <Button
            size='large'
            onClick={() =>
              setDialog(candidate && !tickets ? 'no-tickets' : 'confirm')
            }
          >
            {bookedRole ? '역할 변경하기' : reserveLabels[role]}
          </Button>
          {bookedRole && (
            <Button
              variant='secondary'
              onClick={() =>
                navigate(reservationPaths.room(room.id), { replace: true })
              }
            >
              예약 상세로 돌아가기
            </Button>
          )}
        </aside>
      </div>
      <Dialog
        className={styles.dialog}
        isOpen={dialog !== null}
        onCancel={closeDialog}
      >
        <Dialog.Header>{copy.title}</Dialog.Header>
        <Dialog.Description>{copy.description}</Dialog.Description>
        {dialog === 'confirm' && (
          <Dialog.Body className={styles.info}>
            {!candidate && !bookedRole && (
              <div className={styles.chips}>
                <img
                  width='64'
                  height='64'
                  src={portraits.interviewee}
                  alt='내 모습'
                />{' '}
                →{' '}
                <img
                  width='64'
                  height='64'
                  src={portraits.interviewer}
                  alt='면접관으로 보일 모습'
                />
              </div>
            )}
            <strong>
              {room.title} · {formatRoomTime(room.startsAt)}
            </strong>
            <span>취소·역할 변경은 면접 시작 1시간 전까지 가능해요.</span>
          </Dialog.Body>
        )}
        <Dialog.Footer>
          {dialog === 'no-tickets' ? (
            <Button
              display='block'
              variant={interviewerSeats > 0 ? 'secondary' : 'primary'}
              onClick={() => navigate(reservationPaths.rooms)}
            >
              다른 방 보기
            </Button>
          ) : (
            <Button
              display='block'
              variant='secondary'
              disabled={pending}
              onClick={closeDialog}
            >
              뒤로
            </Button>
          )}
          {dialog === 'confirm' ? (
            <Button display='block' disabled={pending} onClick={confirm}>
              {pending ? '저장 중…' : confirmLabel}
            </Button>
          ) : dialog === 'no-tickets' && interviewerSeats > 0 ? (
            <Button
              display='block'
              onClick={() => {
                setRole('interviewer');
                setDialog('confirm');
              }}
            >
              면접관 자리 선택
            </Button>
          ) : dialog === 'unavailable' ? (
            <Button
              display='block'
              onClick={() => navigate(reservationPaths.rooms)}
            >
              열린 면접방 보기
            </Button>
          ) : null}
        </Dialog.Footer>
      </Dialog>
    </>
  );
}
