import { IconChevronLeftLine } from '@karrotmarket/react-monochrome-icon';
import { type ReactNode, useEffect, useId, useRef } from 'react';
import { Button, Timer } from '@/components/common';
import * as styles from './documentOverlay.css';

type DocumentOverlayProps = {
  isOpen: boolean;
  title: string;
  /** 면접 시작까지 남은 초 */
  remainingSeconds: number;
  /** 뒤로 가기·Esc로 닫을 때 부른다. */
  onClose: () => void;
  children: ReactNode;
};

/**
 * 대기실에서 서류를 읽기 전용으로 펼쳐 보는 전체 화면. 페이지를 옮기지 않고 공간 위에 띄워
 * 3D 씬과 대기실 연결을 유지한다. 고칠 내용이 없으니 Esc로도 닫는다.
 */
export function DocumentOverlay({
  isOpen,
  title,
  remainingSeconds,
  onClose,
  children,
}: DocumentOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.overlay}
      aria-labelledby={titleId}
      // 브라우저가 직접 닫지 않게 막고, 열림 상태는 부모가 정한다.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      {isOpen && (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <Button
                variant='text'
                className={styles.backButton}
                aria-label='대기실로 돌아가기'
                onClick={onClose}
              >
                <IconChevronLeftLine size={24} aria-hidden='true' />
              </Button>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            </div>
            <div className={styles.timerGroup}>
              면접 시작까지
              <Timer tone='default' seconds={remainingSeconds} />
            </div>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
