import { useId } from 'react';
import { IconIdMini, IconIdMiniEmployee } from '@/assets/icons';
import { Tag } from '@/components/common';
import { largeTag } from '@/components/interview/largeTag.css';
import { roleLabels } from '@/constants/interview/roleLabels';
import type { Participant } from '@/types/waiting-room/participant';
import * as styles from './participantsPanel.css';

type ParticipantsPanelProps = {
  participants: readonly Participant[];
  capacity: number;
  className?: string;
};

/** 대기실 좌측 상단 참가자 목록. 면접자는 방문증, 면접관은 사원증 아이콘을 쓴다. */
export function ParticipantsPanel({
  participants,
  capacity,
  className,
}: ParticipantsPanelProps) {
  const titleId = useId();

  return (
    <section
      className={[styles.participants, className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <div className={styles.participantsHeader}>
        <h2 id={titleId} className={styles.participantsTitle}>
          참가자
        </h2>
        <span className={styles.participantsCount}>
          {participants.length} / {capacity}
        </span>
      </div>
      <ul className={styles.participantList}>
        {participants.map(({ id, nickname, role, isMe, isReady }) => {
          const Icon = role === 'interviewer' ? IconIdMiniEmployee : IconIdMini;
          return (
            <li key={id} className={styles.participant}>
              <Icon
                className={styles.participantIcon}
                width={20}
                height={26}
                aria-hidden='true'
              />
              <span className={styles.participantText}>
                <span className={styles.participantName}>
                  {isMe ? `${nickname} (나)` : nickname}
                </span>
                <span className={styles.participantRole}>
                  {roleLabels[role]}
                </span>
              </span>
              <Tag tone={isReady ? 'green' : 'gray'} className={largeTag}>
                {isReady ? '준비 완료' : '마이크 확인'}
              </Tag>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
