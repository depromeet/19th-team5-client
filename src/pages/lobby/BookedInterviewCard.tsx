import { IconCardFill } from '@karrotmarket/react-monochrome-icon';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/common';
import { UpcomingInterviewCard } from '@/components/lobby';
import { interviewPaths, reservationPaths } from '@/constants/common/paths';
import type { InterviewRole } from '@/types/interview/interview';
import type { InterviewRoom } from '@/types/reservation';
import {
  canPrepareQuestions,
  formatRoomDate,
  formatRoomTime,
  preparationLeadTime,
  reservationPhase,
  seatsPerRole,
  seoulDayStart,
  waitingRoomLeadTime,
} from '@/utils/reservation';
import { secondsBetween } from '@/utils/time';
import * as styles from './lobbyPage.css';

type BookedInterviewCardProps = {
  room: InterviewRoom;
  role: InterviewRole;
  now: number;
};

export function BookedInterviewCard({
  room,
  role,
  now,
}: BookedInterviewCardProps) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  if (collapsed) {
    return (
      <Button
        className={styles.upcoming}
        variant='secondary'
        aria-expanded={false}
        onClick={() => setCollapsed(false)}
      >
        <IconCardFill size={20} aria-hidden='true' /> 예약된 면접 펼치기
      </Button>
    );
  }
  const open = reservationPhase(room.startsAt, now) === 'open';
  const date =
    seoulDayStart(room.startsAt) === seoulDayStart(now)
      ? '오늘'
      : formatRoomDate(room.startsAt);
  const participation =
    role === 'interviewer' ? '면접관으로 참여' : '면접자로 참여';
  return (
    <UpcomingInterviewCard
      className={styles.upcoming}
      label='예약된 면접'
      title={`${date} ${formatRoomTime(room.startsAt)} · ${room.title}`}
      summary={`${participation} · 면접자 ${seatsPerRole - room.seats.interviewee} · 면접관 ${seatsPerRole - room.seats.interviewer}`}
      countdownLabel={open ? '면접 시작까지' : '대기실 오픈까지'}
      remainingSeconds={secondsBetween(
        now,
        open ? room.startsAt : room.startsAt - waitingRoomLeadTime,
      )}
      progress={1 - (room.startsAt - now) / preparationLeadTime}
      onClose={() => setCollapsed(true)}
      actions={
        <>
          <Button
            variant='secondary'
            onClick={() => navigate(reservationPaths.room(room.id))}
          >
            예약 보기
          </Button>
          {canPrepareQuestions(role, room.startsAt, now) && (
            <Button
              variant={open ? 'secondary' : 'primary'}
              onClick={() => navigate(reservationPaths.questionSheet(room.id))}
            >
              질문지 작성
            </Button>
          )}
          {open && (
            <Button
              onClick={() =>
                navigate(interviewPaths.waitingRoom(room.id, { role }))
              }
            >
              대기실 입장
            </Button>
          )}
        </>
      }
    />
  );
}
