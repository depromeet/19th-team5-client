import {
  type ComponentPropsWithRef,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react';
import * as styles from './dialog.css';

type DialogContextValue = { titleId: string; descriptionId: string };

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(partName: string) {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(`Dialog.${partName}는 Dialog 안에서 사용해야 합니다.`);
  }
  return context;
}

function joinClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

export type DialogProps = Omit<ComponentPropsWithRef<'dialog'>, 'open'> & {
  isOpen: boolean;
};

const _DialogRoot = ({
  isOpen: open,
  ref,
  className,
  onCancel,
  onClose,
  ...props
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const setRef = useCallback(
    (node: HTMLDialogElement | null) => {
      dialogRef.current = node;
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <DialogContext value={{ titleId, descriptionId }}>
      <dialog
        ref={setRef}
        className={joinClassNames(styles.root, className)}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        closedby='none'
        onCancel={(event) => {
          event.preventDefault();
          onCancel?.(event);
        }}
        onClose={(event) => {
          if (open) event.currentTarget.showModal();
          onClose?.(event);
        }}
        {...props}
      />
    </DialogContext>
  );
};

const _DialogHeader = ({
  className,
  ...props
}: ComponentPropsWithRef<'h2'>) => {
  const { titleId } = useDialogContext('Header');
  return (
    <h2
      id={titleId}
      className={joinClassNames(styles.header, className)}
      {...props}
    />
  );
};

const _DialogDescription = ({
  className,
  ...props
}: ComponentPropsWithRef<'p'>) => {
  const { descriptionId } = useDialogContext('Description');
  return (
    <p
      id={descriptionId}
      className={joinClassNames(styles.description, className)}
      {...props}
    />
  );
};

const _DialogBody = ({ className, ...props }: ComponentPropsWithRef<'div'>) => {
  useDialogContext('Body');
  return <div className={joinClassNames(styles.body, className)} {...props} />;
};

const _DialogFooter = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => {
  useDialogContext('Footer');
  return (
    <div className={joinClassNames(styles.footer, className)} {...props} />
  );
};

export const Dialog = Object.assign(_DialogRoot, {
  Header: _DialogHeader,
  Description: _DialogDescription,
  Body: _DialogBody,
  Footer: _DialogFooter,
});
