import {
  type ComponentPropsWithRef,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from 'react';
import * as styles from './textArea.css';

function joinClassNames(...classNames: (string | false | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

export type TextAreaProps = Omit<
  ComponentPropsWithRef<'textarea'>,
  'children'
> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  showCount?: boolean;
};

export const TextArea = ({
  label,
  helperText,
  error = false,
  showCount = true,
  className,
  id,
  ref,
  value,
  onChange,
  required,
  maxLength,
  'aria-describedby': ariaDescribedBy,
  ...textareaProps
}: TextAreaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const helperId = `${textareaId}-helper`;
  const hasLabel = label !== undefined && label !== null;
  const hasHelper = helperText !== undefined && helperText !== null;

  const [uncontrolledLength, setUncontrolledLength] = useState(0);
  const length =
    value === undefined ? uncontrolledLength : String(value).length;
  const isInvalid = error || (maxLength !== undefined && length > maxLength);

  const mergedRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
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
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <div className={styles.box}>
        <textarea
          className={styles.textarea}
          {...textareaProps}
          id={textareaId}
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
