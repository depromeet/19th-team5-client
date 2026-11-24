import { type ComponentPropsWithRef, type ReactNode, useId } from 'react';
import * as styles from './addButton.css';

function joinClassNames(...classNames: (string | false | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

export type AddButtonProps = ComponentPropsWithRef<'button'> & {
  limited?: boolean;
  description?: ReactNode;
};

export const AddButton = ({
  type = 'button',
  limited = false,
  description,
  disabled,
  className,
  id,
  children,
  'aria-describedby': ariaDescribedBy,
  ...props
}: AddButtonProps) => {
  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const descriptionId = `${buttonId}-description`;
  const hasDescription =
    limited && description !== undefined && description !== null;

  return (
    <div
      className={joinClassNames(styles.root, className)}
      data-limited={limited || undefined}
    >
      <button
        type={type}
        className={styles.button}
        {...props}
        id={buttonId}
        disabled={disabled || limited}
        aria-describedby={
          joinClassNames(ariaDescribedBy, hasDescription && descriptionId) ||
          undefined
        }
      >
        {children}
      </button>
      {hasDescription && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}
    </div>
  );
};
