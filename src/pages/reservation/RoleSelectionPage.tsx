import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Dialog, Tag } from '@/components/common';
import { InterviewPass } from '@/components/reservation/interview-pass/InterviewPass';
import { reservationPaths } from '@/constants/common/paths';
import { roleLabels } from '@/constants/interview/roleLabels';
import { useNow } from '@/hooks/common/useNow';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import type { InterviewRole } from '@/types/interview/interview';
import type { InterviewRoom } from '@/types/reservation';
import {
  canPrepareQuestions,
  formatRoomDate,
  formatRoomTime,
  minute,
} from '@/utils/reservation';
import * as styles from './reservation.css';

type RoleDialog = 'confirm' | 'no-tickets' | 'unavailable' | null;
type RoleSelectionProps = { room: InterviewRoom };

const portraits = {
  interviewee: '/images/signup/boy-profile.png',
  interviewer: '/images/kim-daeri-profile.png',
};
const roles: InterviewRole[] = ['interviewee', 'interviewer'];

export function RoleSelectionPage() {
  const { roomId } = useParams();
  const room = useReservationStore((state) =>
    state.rooms.find((item) => item.id === roomId),
  );
  const reservation = useReservationStore((state) =>
    state.reservations.find((item) => item.roomId === roomId),
  );
  const navigate = useNavigate();
  const now = useNow(reservation?.role === 'interviewer');
  if (room && reservation)
    return (
      <>
        <h1 className={styles.heading}>내 예약</h1>
        <InterviewPass room={room} role={reservation.role} />
        {canPrepareQuestions(reservation.role, room.startsAt, now) && (
          <Button
            onClick={() => navigate(reservationPaths.questionSheet(room.id))}
          >
            질문지 작성
          </Button>
        )}
        <Button onClick={() => navigate(reservationPaths.mine)}>
          예약 목록 보기
        </Button>
      </>
    );
  if (
    !room ||
    room.startsAt <= Date.now() ||
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

function RoleSelection({ room }: RoleSelectionProps) {
  const navigate = useNavigate();
  const tickets = useReservationStore((state) => state.tickets);
  const reserve = useReservationStore((state) => state.reserve);
  const [role, setRole] = useState<InterviewRole>(
    room.seats.interviewee ? 'interviewee' : 'interviewer',
  );
  const [dialog, setDialog] = useState<RoleDialog>(null);
  const candidate = role === 'interviewee';
  const interviewerSeats = room.seats.interviewer;
  const confirm = () => {
    const result = reserve(room.id, role);
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
  return (
    <>
      <header>
        <h1 className={styles.heading}>이번엔 어느 자리에 앉아볼까요?</h1>
        <p className={styles.subtitle}>
          {room.title} · {formatRoomDate(room.startsAt)}{' '}
          {formatRoomTime(room.startsAt)}–
          {formatRoomTime(room.startsAt + 30 * minute)} · 2:2 면접
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
              disabled={!room.seats[item]}
              onClick={() => setRole(item)}
            >
              <span className={styles.roleCopy}>
                <span>
                  <span className={styles.roleTitle}>
                    <strong className={styles.time}>{roleLabels[item]}</strong>
                    <Tag tone='gray'>
                      {room.seats[item] === 0
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
              시작 1시간 전부터 예약 변경·취소가 불가해요. 노쇼 경고가 2회
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
            {candidate ? '면접권 1장으로 예약하기' : '면접관 자리 예약하기'}
          </Button>
        </aside>
      </div>
      <Dialog
        className={styles.dialog}
        isOpen={dialog !== null}
        onCancel={() => setDialog(null)}
      >
        <Dialog.Header>
          {dialog === 'no-tickets'
            ? '면접권이 부족해요'
            : dialog === 'unavailable'
              ? '이 자리는 예약할 수 없어요'
              : candidate
                ? '면접권 1장을 사용할까요?'
                : '이번엔 내가 면접관이에요'}
        </Dialog.Header>
        <Dialog.Description>
          {dialog === 'no-tickets'
            ? interviewerSeats > 0
              ? `면접관 자리가 ${interviewerSeats}개 남았어요. 참여를 완료하면 면접권 1장을 받아요.`
              : '이 방의 면접관 자리는 마감됐어요. 다른 방의 남은 자리를 확인해 주세요.'
            : dialog === 'unavailable'
              ? '다른 열린 면접방을 확인해 주세요.'
              : candidate
                ? `보유한 면접권 ${tickets}장 중 1장을 사용해요.`
                : '면접을 끝까지 진행하면 면접권 1장을 받아요.'}
        </Dialog.Description>
        {dialog === 'confirm' && (
          <Dialog.Body className={styles.info}>
            {!candidate && (
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
            <span>취소·변경은 면접 시작 1시간 전까지 가능해요.</span>
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
              onClick={() => setDialog(null)}
            >
              뒤로
            </Button>
          )}
          {dialog === 'confirm' ? (
            <Button display='block' onClick={confirm}>
              {candidate ? '면접자로 예약하기' : '면접관으로 예약하기'}
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
