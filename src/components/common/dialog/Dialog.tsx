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
        // 유저 행동을 강제하는 흐름이라 Esc·바깥 클릭으로 닫지 않는다.
        closedby='none'
        onCancel={(event) => {
          event.preventDefault();
          onCancel?.(event);
        }}
        onClose={(event) => {
          // 브라우저가 Esc 반복 입력 등으로 강제로 닫으면 상태에 맞춰 다시 연다.
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
