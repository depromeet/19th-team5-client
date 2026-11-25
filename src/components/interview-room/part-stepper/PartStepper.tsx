import { interviewParts, partLabels } from '@/constants/interview-room/parts';
import type { InterviewPart } from '@/types/interview-room/interviewRoom';
import { formatDurationLabel } from '@/utils/formatTime';
import * as styles from './partStepper.css';

type PartStepperProps = {
  currentPart: InterviewPart;
  /** 각 부의 진행 시간(초) */
  partSeconds: Readonly<Record<InterviewPart, number>>;
  className?: string;
};

/** 면접방 왼쪽 위 진행 단계. 지금 부를 강조하고, 지난 부는 흐리게 보여준다. */
export function PartStepper({
  currentPart,
  partSeconds,
  className,
}: PartStepperProps) {
  const currentIndex = interviewParts.indexOf(currentPart);

  return (
    <ol
      className={[styles.stepper, className].filter(Boolean).join(' ')}
      aria-label='면접 진행 단계'
    >
      {interviewParts.map((part, index) => {
        const { order, title } = partLabels[part];
        const state =
          index < currentIndex
            ? 'done'
            : index === currentIndex
              ? 'current'
              : 'upcoming';
        return (
          <li
            key={part}
            className={styles.step}
            data-state={state}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {order} {title} · {formatDurationLabel(partSeconds[part])}
          </li>
        );
      })}
    </ol>
  );
}
