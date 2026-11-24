import type { ComponentPropsWithRef, ReactNode } from 'react';
import * as styles from './radio.css';

function joinClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

export type RadioProps = Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'children'
> & {
  children: ReactNode;
};

export const Radio = ({ className, children, ...inputProps }: RadioProps) => (
  <label className={joinClassNames(styles.root, className)}>
    <input type='radio' className={styles.hiddenInput} {...inputProps} />
    <span className={styles.chip}>{children}</span>
  </label>
);
