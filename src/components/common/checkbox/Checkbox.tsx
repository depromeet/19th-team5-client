import IconCheckmarkFill from '@karrotmarket/react-monochrome-icon/IconCheckmarkFill';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import * as styles from './checkbox.css';

function joinClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

type CheckboxInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'children'
>;

export type CheckboxVariant = 'default' | 'chip';

export type CheckboxProps = CheckboxInputProps &
  (
    | { variant?: 'default'; children?: never }
    | { variant: 'chip'; children: ReactNode }
  );

export const Checkbox = (props: CheckboxProps) => {
  if (props.variant === 'chip') {
    const { variant: _variant, className, children, ...inputProps } = props;

    return (
      <label className={joinClassNames(styles.root, className)}>
        <input type='checkbox' className={styles.hiddenInput} {...inputProps} />
        <span className={styles.chip}>{children}</span>
      </label>
    );
  }

  const { variant: _variant, className, ...inputProps } = props;

  return (
    <span className={joinClassNames(styles.root, className)}>
      <input type='checkbox' className={styles.overlayInput} {...inputProps} />
      <span className={styles.box} aria-hidden>
        <IconCheckmarkFill size={12} className={styles.checkIcon} />
      </span>
    </span>
  );
};
