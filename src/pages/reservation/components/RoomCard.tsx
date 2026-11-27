import {
  IconSeatLeftFill,
  IconSeatLeftLine,
} from '@karrotmarket/react-monochrome-icon';
import { Button, Tag } from '@/components/common';
import { roleLabels } from '@/constants/interview/roleLabels';
import { visuallyHidden } from '@/styles/a11y.css';
import type { InterviewRole } from '@/types/interview/interview';
import type { InterviewRoom } from '@/types/reservation';
import {
  formatRoomDate,
  formatRoomTime,
  seatsPerRole,
} from '@/utils/reservation';
import * as styles from './roomCard.css';

type RoomCardProps = {
  room: InterviewRoom;
  booked: boolean;
  onOpen: () => void;
};

type RoomSeatsProps = { interviewRole: InterviewRole; remaining: number };

const seatPositions = Array.from({ length: seatsPerRole }, (_, index) => index);

function RoomSeats({ interviewRole, remaining }: RoomSeatsProps) {
  const label = roleLabels[interviewRole];

  return (
    <span
      className={styles.seatGroup}
      title={`${label} ${remaining}자리 남음`}
      aria-hidden='true'
    >
      <span>{label}</span>
      {seatPositions.map((position) =>
        position < seatsPerRole - remaining ? (
          <IconSeatLeftFill key={position} size={16} aria-hidden='true' />
        ) : (
          <IconSeatLeftLine
            key={position}
            className={styles.availableSeat}
            size={16}
            aria-hidden='true'
          />
        ),
      )}
    </span>
  );
}

export function RoomCard({ room, booked, onOpen }: RoomCardProps) {
  const { interviewee, interviewer } = room.seats;
  const full = interviewee + interviewer === 0;
  const isAdmin = room.source === 'admin';

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.schedule}>
          <time
            className={styles.time}
            dateTime={new Date(room.startsAt).toISOString()}
          >
            {formatRoomTime(room.startsAt)}
          </time>
          <span className={styles.date}>{formatRoomDate(room.startsAt)}</span>
        </div>
        <Tag tone={isAdmin ? 'gray' : 'green'}>
          {isAdmin ? '관리자 방' : '개설된 방'}
        </Tag>
      </div>
      <div className={styles.details}>
        <h2 className={styles.title}>{room.title}</h2>
        <p className={styles.meta}>익명 음성 · {room.job}</p>
      </div>
      <div className={styles.seats}>
        <span className={visuallyHidden}>
          면접자 {interviewee}자리 · 면접관 {interviewer}자리
        </span>
        <RoomSeats interviewRole='interviewee' remaining={interviewee} />
        <RoomSeats interviewRole='interviewer' remaining={interviewer} />
        {(booked || full) && (
          <Tag tone='gray'>{booked ? '예약됨' : '마감'}</Tag>
        )}
      </div>
      <Button
        size='large'
        display='block'
        variant={isAdmin ? 'primary' : 'outline'}
        disabled={full && !booked}
        onClick={onOpen}
      >
        {booked ? '내 예약 보기' : '방 살펴보기'}
      </Button>
    </article>
  );
}
