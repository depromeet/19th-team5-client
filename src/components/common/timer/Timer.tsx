import type { ComponentPropsWithRef, ReactNode } from 'react';
import { formatTime, toDurationString } from '@/utils/formatTime';
import { dot, type TimerVariants, timer } from './timer.css';

export type TimerProps = Omit<ComponentPropsWithRef<'div'>, 'children'> &
  TimerVariants & {
    seconds: number;
    /** 시간 앞에 붙는 문구. 예) 시작까지 */
    label?: ReactNode;
  };

export const Timer = ({
  seconds,
  label,
  tone,
  className,
  ...props
}: TimerProps) => {
  const classNames = [timer({ tone }), className].filter(Boolean).join(' ');
  const time = (
    <time dateTime={toDurationString(seconds)}>{formatTime(seconds)}</time>
  );

  return (
    <div role='timer' className={classNames} {...props}>
      <span className={dot} aria-hidden />
      {label ? (
        <span>
          {label} {time}
        </span>
      ) : (
        time
      )}
    </div>
  );
};
