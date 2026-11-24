import {
  type ComponentPropsWithRef,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from 'react';
import * as styles from './textField.css';

function joinClassNames(...classNames: (string | false | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

export type TextFieldProps = Omit<
  ComponentPropsWithRef<'input'>,
  'children'
> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  showCount?: boolean;
};

export const TextField = ({
  label,
  helperText,
  error = false,
  showCount = true,
  className,
  id,
  ref,
  value,
  onChange,
  type = 'text',
  required,
  maxLength,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const hasLabel = label !== undefined && label !== null;
  const hasHelper = helperText !== undefined && helperText !== null;

  const [uncontrolledLength, setUncontrolledLength] = useState(0);
  const length =
    value === undefined ? uncontrolledLength : String(value).length;
  const isInvalid = error || (maxLength !== undefined && length > maxLength);

  const mergedRef = useCallback(
    (node: HTMLInputElement | null) => {
      const cleanup = typeof ref === 'function' ? ref(node) : undefined;
      if (ref && typeof ref !== 'function') ref.current = node;
      if (node) setUncontrolledLength(node.value.length);
      return cleanup;
    },
    [ref],
  );

  return (
    <div
      className={joinClassNames(styles.root, className)}
      data-invalid={isInvalid || undefined}
    >
      {hasLabel && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <div className={styles.box}>
        <input
          type={type}
          className={styles.input}
          {...inputProps}
          id={inputId}
          ref={mergedRef}
          value={value}
          required={required}
          onChange={(event) => {
            setUncontrolledLength(event.target.value.length);
            onChange?.(event);
          }}
          aria-invalid={isInvalid || undefined}
          aria-describedby={
            joinClassNames(ariaDescribedBy, hasHelper && helperId) || undefined
          }
        />
        {showCount && maxLength !== undefined && (
          <span className={styles.count}>
            {length} / {maxLength}
          </span>
        )}
      </div>
      {hasHelper && (
        <p id={helperId} className={styles.helper}>
          {helperText}
        </p>
      )}
    </div>
  );
};
