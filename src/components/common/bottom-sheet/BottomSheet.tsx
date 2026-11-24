import { IconPersonFill } from '@karrotmarket/react-monochrome-icon';
import {
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../button';
import type { PanelVariants } from './bottomSheet.css';
import * as styles from './bottomSheet.css';

type AccessibleName = { 'aria-label': string } | { 'aria-labelledby': string };

export type BottomSheetProps = Omit<
  ComponentPropsWithoutRef<'dialog'>,
  'open' | 'closedby' | 'aria-modal'
> &
  AccessibleName & {
    isOpen: boolean;
    onRequestClose: () => void;
  };

function joinClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

function BottomSheetRoot({
  isOpen,
  onRequestClose,
  className,
  onKeyDown,
  onClose,
  ...props
}: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.show();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return createPortal(
    <dialog
      {...props}
      ref={dialogRef}
      className={joinClassNames(styles.root, className)}
      closedby='none'
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === 'Escape' && !event.defaultPrevented) {
          event.preventDefault();
          event.stopPropagation();
          onRequestClose();
        }
      }}
      onClose={(event) => {
        onClose?.(event);
        if (isOpen && !event.currentTarget.open) onRequestClose();
      }}
    />,
    document.body,
  );
}

function BottomSheetHeader({
  className,
  ...props
}: ComponentPropsWithRef<'header'>) {
  return (
    <header {...props} className={joinClassNames(styles.header, className)} />
  );
}

export type BottomSheetCandidate = { id: string; name: string };

function BottomSheetCandidateTabs({
  candidates,
  selectedId,
  onSelect,
}: {
  candidates: readonly BottomSheetCandidate[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <fieldset className={styles.candidateTabs} aria-label='면접자 선택'>
      {candidates.length === 0 && <span>참여한 면접자가 없습니다.</span>}
      {candidates.map(({ id, name }) => (
        <Button
          key={id}
          className={styles.candidateButton}
          variant={selectedId === id ? 'primary' : 'outline'}
          aria-pressed={selectedId === id}
          onClick={() => onSelect(id)}
        >
          {name}
        </Button>
      ))}
    </fieldset>
  );
}

type BottomSheetAvatarProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children'
> & {
  src?: string | null;
  alt?: string;
};

function AvatarContent({ src }: { src: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && <IconPersonFill size={32} aria-hidden='true' />}
      {src && (
        <img
          className={styles.avatarImage}
          alt=''
          src={src}
          hidden={!isLoaded}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(false)}
        />
      )}
    </>
  );
}

function BottomSheetAvatar({
  src,
  alt = '',
  className,
  ...props
}: BottomSheetAvatarProps) {
  const imageUrl = src?.trim() ?? '';
  return (
    <span
      role='img'
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      {...props}
      className={joinClassNames(styles.avatar, className)}
    >
      <AvatarContent key={imageUrl} src={imageUrl} />
    </span>
  );
}

type BottomSheetBodyProps = ComponentPropsWithRef<'div'> & {
  sidebar?: ReactNode;
};

function BottomSheetBody({
  children,
  sidebar,
  className,
  ...props
}: BottomSheetBodyProps) {
  const hasSidebar = sidebar != null && sidebar !== false;

  return (
    <div
      {...props}
      className={joinClassNames(
        styles.body,
        hasSidebar ? styles.withSidebar : undefined,
        className,
      )}
    >
      <div className={styles.column}>{children}</div>
      {hasSidebar && <div className={styles.column}>{sidebar}</div>}
    </div>
  );
}

function BottomSheetPanel({
  variant,
  className,
  ...props
}: ComponentPropsWithRef<'div'> & PanelVariants) {
  return (
    <div
      {...props}
      className={joinClassNames(styles.panel({ variant }), className)}
    />
  );
}

export const BottomSheet = Object.assign(BottomSheetRoot, {
  Header: BottomSheetHeader,
  Avatar: BottomSheetAvatar,
  CandidateTabs: BottomSheetCandidateTabs,
  Body: BottomSheetBody,
  Panel: BottomSheetPanel,
});
