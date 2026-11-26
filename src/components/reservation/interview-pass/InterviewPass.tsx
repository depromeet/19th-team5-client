import { IconTieWatermark } from '@/assets/icons';
import { Tag } from '@/components/common';
import { roleLabels } from '@/constants/interview/roleLabels';
import type { InterviewRole } from '@/types/interview/interview';
import type { InterviewRoom } from '@/types/reservation';
import {
  formatRoomDate,
  formatRoomTime,
  waitingRoomLeadTime,
} from '@/utils/reservation';
import * as styles from './interviewPass.css';

type InterviewPassProps = { room: InterviewRoom; role: InterviewRole };

export function InterviewPass({ room, role }: InterviewPassProps) {
  return (
    <article className={styles.pass} aria-label={`${room.title} 면접 출입증`}>
      <IconTieWatermark className={styles.watermark} aria-hidden />
      <div className={styles.row}>
        <span>INTERVIEW PASS</span>
        <Tag tone='gray'>{roleLabels[role]}</Tag>
      </div>
      <strong className={styles.time}>
        {formatRoomDate(room.startsAt)} {formatRoomTime(room.startsAt)}
      </strong>
      <span>{room.title} · 30분</span>
      <div className={styles.passEntry}>
        <span>
          대기실 입장 · {formatRoomTime(room.startsAt - waitingRoomLeadTime)}
          부터
        </span>
        <span className={styles.barcode} aria-hidden />
      </div>
    </article>
  );
}
