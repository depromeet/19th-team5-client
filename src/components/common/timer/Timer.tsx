import type { ComponentPropsWithRef } from 'react';
import { formatTime, toDurationString } from '@/utils/formatTime';
import { dot, type TimerVariants, timer } from './timer.css';

export type TimerProps = Omit<ComponentPropsWithRef<'div'>, 'children'> &
  TimerVariants & {
    /** 표시할 시간(초). `mm:ss`로 표시되며 60분 이상은 분이 그대로 늘어나요. */
    seconds: number;
  };

export const Timer = ({ seconds, tone, className, ...props }: TimerProps) => {
  const classNames = [timer({ tone }), className].filter(Boolean).join(' ');

  return (
    <div role='timer' className={classNames} {...props}>
      <span className={dot} aria-hidden />
      <time dateTime={toDurationString(seconds)}>{formatTime(seconds)}</time>
    </div>
  );
};
