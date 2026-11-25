import {
  type ComponentPropsWithRef,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as styles from './countDown.css';

export type CountDownProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  seconds?: number;
  description?: (remaining: number) => ReactNode;
  onComplete?: () => void;
};

const defaultDescription = (remaining: number) =>
  remaining === 1
    ? '곧 면접이 시작됩니다.'
    : `${remaining}초뒤 면접이 시작됩니다.`;

export const CountDown = ({
  seconds = 3,
  description = defaultDescription,
  onComplete,
  className,
  ...props
}: CountDownProps) => {
  const start = Math.max(1, Math.floor(seconds));
  const [remaining, setRemaining] = useState(start);
  const [prevStart, setPrevStart] = useState(start);
  const onCompleteRef = useRef(onComplete);

  // seconds가 바뀌면 처음부터 다시 센다.
  if (prevStart !== start) {
    setPrevStart(start);
    setRemaining(start);
  }

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (remaining > 1) {
        setRemaining(remaining - 1);
      } else {
        onCompleteRef.current?.();
      }
    }, 1000);

    return () => clearTimeout(id);
  }, [remaining]);

  return (
    <div
      role='timer'
      className={[styles.countDown, className].filter(Boolean).join(' ')}
      {...props}
    >
      <div className={styles.circle} data-last={remaining === 1} aria-hidden>
        {remaining}
      </div>
      <p className={styles.description} aria-live='polite'>
        {description(remaining)}
      </p>
    </div>
  );
};
